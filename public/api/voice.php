<?php

declare(strict_types=1);

require __DIR__ . '/_shared.php';

tinypyk_require_post();

$secrets = tinypyk_load_secrets();
if (array_key_exists('elevenlabs_enabled', $secrets) && !$secrets['elevenlabs_enabled']) {
    tinypyk_json(403, ['error' => 'Voice is muted by admin.']);
}

$apiKey = $secrets['elevenlabs_api_key'] ?? '';
$voiceId = $secrets['elevenlabs_voice_id'] ?? '';

if ($apiKey === '' || $voiceId === '') {
    tinypyk_json(503, ['error' => 'ElevenLabs is not configured.']);
}

$data = tinypyk_read_json();
$text = tinypyk_text($data, 'text', 280);

if ($text === '') {
    tinypyk_json(422, ['error' => 'Text is required.']);
}

$payload = [
    'text' => $text,
    'model_id' => $secrets['elevenlabs_model_id'] ?? 'eleven_multilingual_v2',
    'voice_settings' => [
        'stability' => 0.55,
        'similarity_boost' => 0.75,
        'style' => 0.15,
        'use_speaker_boost' => true,
    ],
];

$url = 'https://api.elevenlabs.io/v1/text-to-speech/' . rawurlencode((string) $voiceId) . '?output_format=mp3_44100_128';
$curl = curl_init($url);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: audio/mpeg',
        'xi-api-key: ' . $apiKey,
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 30,
]);

$audio = curl_exec($curl);
$status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$error = curl_error($curl);
curl_close($curl);

if ($audio === false || $status < 200 || $status >= 300) {
    tinypyk_json(502, ['error' => $error !== '' ? 'Voice service error.' : 'Voice service could not speak.']);
}

http_response_code(200);
header('Content-Type: audio/mpeg');
header('Cache-Control: no-store');
echo $audio;
