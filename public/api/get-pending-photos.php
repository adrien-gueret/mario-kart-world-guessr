<?php

require_once __DIR__ . '/___middleware.php';

require_once __DIR__ . '/___github.php';

allowMethod('GET');

$pr = githubApi("GET", "/repos/$owner/$repo/pulls/169/files", $githubToken);
$photo = githubApi("GET", $pr[0]['contents_url'], $githubToken);

print_r($photo['download_url']);