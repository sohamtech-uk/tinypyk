<?php

declare(strict_types=1);

function tinypyk_private_dir(): string
{
    $dir = dirname(__DIR__) . '/private';
    if (!is_dir($dir)) {
        mkdir($dir, 0700, true);
    }

    return $dir;
}

function tinypyk_secret_path(): string
{
    return tinypyk_private_dir() . '/tinypyk_secrets.php';
}

function tinypyk_read_json(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);

    return is_array($data) ? $data : [];
}

function tinypyk_json(int $status, array $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data);
    exit;
}

function tinypyk_text(array $data, string $key, int $max = 1000): string
{
    $value = isset($data[$key]) ? trim((string) $data[$key]) : '';
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? '';

    if (strlen($value) > $max) {
        return substr($value, 0, $max);
    }

    return $value;
}

function tinypyk_load_secrets(): array
{
    $path = tinypyk_secret_path();
    $secrets = [];

    if (is_file($path)) {
        $loaded = include $path;
        if (is_array($loaded)) {
            $secrets = $loaded;
        }
    }

    $envMap = [
        'openai_api_key' => 'TINYPYK_OPENAI_API_KEY',
        'openai_model' => 'TINYPYK_OPENAI_MODEL',
        'elevenlabs_api_key' => 'TINYPYK_ELEVENLABS_API_KEY',
        'elevenlabs_voice_id' => 'TINYPYK_ELEVENLABS_VOICE_ID',
        'elevenlabs_model_id' => 'TINYPYK_ELEVENLABS_MODEL_ID',
    ];

    foreach ($envMap as $key => $envName) {
        $envValue = getenv($envName);
        if ($envValue !== false && $envValue !== '') {
            $secrets[$key] = $envValue;
        }
    }

    return $secrets;
}

function tinypyk_save_secrets(array $secrets): void
{
    $path = tinypyk_secret_path();
    $php = "<?php\n\ndeclare(strict_types=1);\n\nreturn " . var_export($secrets, true) . ";\n";
    file_put_contents($path, $php, LOCK_EX);
    chmod($path, 0600);
}

function tinypyk_public_status(array $secrets, bool $authenticated = false): array
{
    return [
        'authenticated' => $authenticated,
        'setupRequired' => empty($secrets['admin_password_hash']),
        'setupCodeRequired' => (getenv('TINYPYK_SETUP_CODE') ?: '') !== '',
        'hasOpenAI' => !empty($secrets['openai_api_key']),
        'hasElevenLabs' => !empty($secrets['elevenlabs_api_key']) && !empty($secrets['elevenlabs_voice_id']),
        'openaiModel' => $secrets['openai_model'] ?? 'gpt-4.1-mini',
        'elevenlabsVoiceId' => $secrets['elevenlabs_voice_id'] ?? '',
        'elevenlabsModelId' => $secrets['elevenlabs_model_id'] ?? 'eleven_multilingual_v2',
        'elevenlabsEnabled' => !array_key_exists('elevenlabs_enabled', $secrets) || (bool) $secrets['elevenlabs_enabled'],
    ];
}

function tinypyk_require_post(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        tinypyk_json(405, ['error' => 'POST required.']);
    }
}

function tinypyk_curl_json(string $url, array $headers, array $payload, int $timeout = 30): array
{
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json'], $headers),
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => $timeout,
    ]);

    $body = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $error = curl_error($curl);
    curl_close($curl);

    return [
        'status' => $status,
        'body' => $body === false ? '' : $body,
        'error' => $error,
        'json' => is_string($body) ? json_decode($body, true) : null,
    ];
}
