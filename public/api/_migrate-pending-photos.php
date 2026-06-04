<?php

require_once __DIR__ . '/___environment.php';
require_once __DIR__ . '/___database.php';
require_once __DIR__ . '/___github.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$expected = 'Bearer ' . getenv('MU_SECRET');
if (!hash_equals($expected, $authHeader)) {
    http_response_code(401);
    exit('Unauthorized');
}

header('Content-Type: text/plain; charset=UTF-8');

$dryRun = isset($_GET['dry_run']) && $_GET['dry_run'] === '1';
$limit = isset($_GET['limit']) ? max(1, min(50, (int) $_GET['limit'])) : 10;

$pendingDir = __DIR__ . '/../photos/pending';
if (!$dryRun && !is_dir($pendingDir)) {
    @mkdir($pendingDir, 0755, true);
}

$stmt = $pdo->prepare(
    "SELECT p.id, p.x, p.y, p.github_pr_number, p.author_id,
            u.username, u.locale
     FROM `mario-kart-world-photos` p
     LEFT JOIN `mario-kart-world-users` u ON u.id = p.author_id
     WHERE p.validated_at IS NULL
       AND p.rejected_at IS NULL
       AND p.github_pr_number IS NOT NULL
       AND p.github_issue_number IS NULL
     ORDER BY p.github_pr_number ASC
     LIMIT $limit"
);
$stmt->execute();
$photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Found " . count($photos) . " pending PR(s) to migrate" . ($dryRun ? ' (DRY RUN)' : '') . "\n\n";

foreach ($photos as $photo) {
    $photoId = $photo['id'];
    $prNumber = (int) $photo['github_pr_number'];
    $author = $photo['username'] ?: 'Anonymous';
    $locale = $photo['locale'] ?: 'en';

    echo "PR #$prNumber -> photo $photoId ... ";

    try {
        $files = githubApi("GET", "/repos/$owner/$repo/pulls/$prNumber/files", $githubToken);
        if (empty($files)) {
            echo "SKIP (no files in PR)\n";
            continue;
        }
        $branchName = null;
        try {
            $pr = githubApi("GET", "/repos/$owner/$repo/pulls/$prNumber", $githubToken);
            $branchName = $pr['head']['ref'] ?? null;
        } catch (Exception $e) {
            // ignore
        }

        $contents = githubApi("GET", $files[0]['contents_url'], $githubToken);
        if (empty($contents['content'])) {
            echo "SKIP (no content)\n";
            continue;
        }
        $binary = base64_decode($contents['content']);
        if ($binary === false || strlen($binary) === 0) {
            echo "SKIP (decode failed)\n";
            continue;
        }

        $pendingPath = "$pendingDir/$photoId.jpg";
        $pendingUrl = "https://www.mariouniversalis.fr/mario-kart-world-guessr/photos/pending/$photoId.jpg";

        $issueBody = "<!-- photo-id: $photoId -->\n\n"
            . "**Author:** $author ($locale)\n"
            . "**Coordinates:** ({$photo['x']}, {$photo['y']})\n"
            . "**Migrated from PR:** #$prNumber\n\n"
            . "![preview]($pendingUrl)\n\n"
            . "---\n"
            . "_Close as **completed** to validate, or as **not planned** with a comment explaining why to reject._";

        if ($dryRun) {
            echo "would write file + open issue + close PR #$prNumber"
                . ($branchName ? " + delete branch $branchName" : "") . "\n";
            continue;
        }

        if (file_put_contents($pendingPath, $binary) === false) {
            echo "FAIL (cannot write $pendingPath)\n";
            continue;
        }

        $issue = githubApi("POST", "/repos/$owner/$repo/issues", $githubToken, [
            "title" => "Photo à valider ($author)",
            "body" => $issueBody,
            "labels" => ["pending-photo"],
        ]);
        $issueNumber = (int) $issue['number'];

        $update = $pdo->prepare(
            "UPDATE `mario-kart-world-photos`
             SET github_issue_number = :issue
             WHERE id = :id"
        );
        $update->execute([':issue' => $issueNumber, ':id' => $photoId]);

        try {
            githubApi("PATCH", "/repos/$owner/$repo/pulls/$prNumber", $githubToken, [
                "state" => "closed",
            ]);
        } catch (Exception $e) {
            echo "warn (close PR failed: " . $e->getMessage() . ") ";
        }

        if ($branchName) {
            try {
                githubApi("DELETE", "/repos/$owner/$repo/git/refs/heads/$branchName", $githubToken);
            } catch (Exception $e) {
                // branch may already be gone
            }
        }

        echo "OK (issue #$issueNumber)\n";
    } catch (Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
}

echo "\nDone.\n";
