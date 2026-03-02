<?php

require_once __DIR__ . '/___environment.php';

$githubAppId = getenv('GITHUB_APP_ID');
$installationId = getenv('GITHUB_INSTALLATION_ID');
$owner = getenv('GITHUB_OWNER');
$repo = getenv('GITHUB_REPOSITORY');
$baseBranch = getenv('GITHUB_BASE_BRANCH');

function base64url_encode($data) {
  return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function generateGitHubAppJWT($appId) {
    $privateKey = getenv('GITHUB_JWT_PRIVATE_KEY');

  $header = ['alg' => 'RS256', 'typ' => 'JWT'];
  $payload = [
    'iat' => time() - 60,
    'exp' => time() + (10 * 60),
    'iss' => $appId
  ];

  $segments = [];
  $segments[] = base64url_encode(json_encode($header));
  $segments[] = base64url_encode(json_encode($payload));

  $dataToSign = implode('.', $segments);
  openssl_sign($dataToSign, $signature, $privateKey, OPENSSL_ALGO_SHA256);
  $segments[] = base64url_encode($signature);

  return implode('.', $segments);
}

function getGitHubInstallationToken($jwt, $installationId) {
  $ch = curl_init("https://api.github.com/app/installations/$installationId/access_tokens");
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $jwt",
    "Accept: application/vnd.github+json",
    "User-Agent: MarioGeoGuessrApp"
  ]);
  $response = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($status >= 400) {
    http_response_code(500);
    die('{"error":true,"message":"'.$response.'"}');
  }

  $json = json_decode($response, true);
  return $json['token'];
}

function githubApi($method, $endpoint, $token, $data = null) {
  $githubApiRootUrl = 'https://api.github.com';

  $ch = curl_init(
    (str_starts_with($endpoint, $githubApiRootUrl) ? '': $githubApiRootUrl)
    .$endpoint
);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_USERAGENT, "MarioGeoGuessrApp");
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/vnd.github+json"
  ]);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
  if ($data) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
  }

  $response = curl_exec($ch);
  $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  if ($status >= 400) {
    throw new Exception($response);
  }

  return json_decode($response, true);
}

function getPhotoURLByPRId($prId) {
  global $owner, $repo, $githubToken;

  try {
    $pr = githubApi("GET", "/repos/$owner/$repo/pulls/$prId/files", $githubToken);

    if (empty($pr)) {
      return false;
    }

    $photo = githubApi("GET", $pr[0]['contents_url'], $githubToken);
 
    if (!empty($photo['content'])) {
      return 'data:image/jpeg;base64,' . $photo['content'];
    }

    return empty($photo['download_url']) ? false : $photo['download_url'];
  } catch (Exception $e) {
    return false;
  }

}

$jwt = generateGitHubAppJWT($githubAppId);
$githubToken = getGitHubInstallationToken($jwt, $installationId);