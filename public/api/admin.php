<?php

declare(strict_types=1);

require __DIR__ . '/_shared.php';

session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Strict',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
]);
session_start();

$action = $_GET['action'] ?? 'status';
$secrets = tinypyk_load_secrets();
$authenticated = !empty($_SESSION['tinypyk_admin']);

if ($action === 'status') {
    tinypyk_json(200, tinypyk_public_status($secrets, $authenticated));
}

if ($action === 'setup') {
    tinypyk_require_post();

    if (!empty($secrets['admin_password_hash'])) {
        tinypyk_json(409, ['error' => 'Admin is already configured.']);
    }

    $data = tinypyk_read_json();
    $setupCode = getenv('TINYPYK_SETUP_CODE') ?: '';

    if ($setupCode !== '' && !hash_equals($setupCode, tinypyk_text($data, 'setupCode', 200))) {
        tinypyk_json(403, ['error' => 'Setup code is incorrect.']);
    }

    $password = tinypyk_text($data, 'password', 300);
    if (strlen($password) < 12) {
        tinypyk_json(422, ['error' => 'Use an admin password with at least 12 characters.']);
    }

    $secrets['admin_password_hash'] = password_hash($password, PASSWORD_DEFAULT);
    tinypyk_save_secrets($secrets);
    $_SESSION['tinypyk_admin'] = true;
    tinypyk_json(200, tinypyk_public_status($secrets, true));
}

if ($action === 'login') {
    tinypyk_require_post();

    if (empty($secrets['admin_password_hash'])) {
        tinypyk_json(409, ['error' => 'Create the admin password first.']);
    }

    $data = tinypyk_read_json();
    if (!password_verify(tinypyk_text($data, 'password', 300), (string) $secrets['admin_password_hash'])) {
        tinypyk_json(403, ['error' => 'Password is incorrect.']);
    }

    $_SESSION['tinypyk_admin'] = true;
    tinypyk_json(200, tinypyk_public_status($secrets, true));
}

if ($action === 'logout') {
    tinypyk_require_post();
    $_SESSION = [];
    session_destroy();
    tinypyk_json(200, tinypyk_public_status($secrets, false));
}

if ($action === 'save') {
    tinypyk_require_post();

    if (!$authenticated) {
        tinypyk_json(403, ['error' => 'Sign in to admin first.']);
    }

    $data = tinypyk_read_json();
    $openaiApiKey = tinypyk_text($data, 'openaiApiKey', 400);
    $elevenlabsApiKey = tinypyk_text($data, 'elevenlabsApiKey', 400);

    if ($openaiApiKey !== '') {
        $secrets['openai_api_key'] = $openaiApiKey;
    }

    $openaiModel = tinypyk_text($data, 'openaiModel', 80);
    if ($openaiModel !== '') {
        $secrets['openai_model'] = $openaiModel;
    }

    if ($elevenlabsApiKey !== '') {
        $secrets['elevenlabs_api_key'] = $elevenlabsApiKey;
    }

    $voiceId = tinypyk_text($data, 'elevenlabsVoiceId', 120);
    if ($voiceId !== '') {
        $secrets['elevenlabs_voice_id'] = $voiceId;
    }

    $voiceModel = tinypyk_text($data, 'elevenlabsModelId', 120);
    if ($voiceModel !== '') {
        $secrets['elevenlabs_model_id'] = $voiceModel;
    }

    $secrets['elevenlabs_enabled'] = !empty($data['elevenlabsEnabled']);
    tinypyk_save_secrets($secrets);
    tinypyk_json(200, tinypyk_public_status($secrets, true));
}

tinypyk_json(404, ['error' => 'Unknown admin action.']);
