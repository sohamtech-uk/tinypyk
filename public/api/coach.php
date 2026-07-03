<?php

declare(strict_types=1);

require __DIR__ . '/_shared.php';

function tinypyk_moderation_flagged(string $apiKey, string $text): bool
{
    if ($text === '') {
        return false;
    }

    $result = tinypyk_curl_json(
        'https://api.openai.com/v1/moderations',
        ['Authorization: Bearer ' . $apiKey],
        [
            'model' => 'omni-moderation-latest',
            'input' => $text,
        ],
        20
    );

    if ($result['status'] < 200 || $result['status'] >= 300 || !is_array($result['json'])) {
        return true;
    }

    return !empty($result['json']['results'][0]['flagged']);
}

function tinypyk_extract_response_text(array $data): string
{
    if (!empty($data['output_text']) && is_string($data['output_text'])) {
        return trim($data['output_text']);
    }

    $parts = [];
    foreach (($data['output'] ?? []) as $output) {
        foreach (($output['content'] ?? []) as $content) {
            if (($content['type'] ?? '') === 'output_text' && isset($content['text'])) {
                $parts[] = (string) $content['text'];
            }
        }
    }

    return trim(implode("\n", $parts));
}

tinypyk_require_post();

$secrets = tinypyk_load_secrets();
$apiKey = $secrets['openai_api_key'] ?? '';

if ($apiKey === '') {
    tinypyk_json(503, ['error' => 'Tiny Coach needs an adult to add the OpenAI key in Admin.']);
}

$data = tinypyk_read_json();
$question = tinypyk_text($data, 'question', 500);
$code = tinypyk_text($data, 'code', 4000);
$lessonTitle = tinypyk_text($data, 'lessonTitle', 120);

if ($question === '') {
    tinypyk_json(422, ['error' => 'Ask Tiny Coach a question first.']);
}

if (tinypyk_moderation_flagged((string) $apiKey, $question)) {
    tinypyk_json(200, [
        'answer' => 'Ask a grown-up for help with that. I can help with safe Python blocks, drawings, sounds, and tiny games.',
    ]);
}

$instructions = implode("\n", [
    'You are Tiny Coach for TinyPyk, a Python blocks app for children aged 5 to 7.',
    'Be warm, brief, and concrete. Use simple words and one small next step.',
    'Do not ask for personal information. Do not request full names, addresses, school names, photos, phone numbers, emails, or passwords.',
    'If the child shares private information, gently say not to share it and return to the coding task.',
    'Only help with beginner Python, Blockly blocks, drawing, music, input/output, and character projects.',
    'Do not provide external links. Do not discuss adult, unsafe, violent, sexual, self-harm, medical, legal, or financial topics.',
    'If code is broken, explain the likely block to add or move. Keep answers under 80 words.',
]);

$prompt = "Lesson: {$lessonTitle}\n\nGenerated Python:\n{$code}\n\nChild question:\n{$question}";

$result = tinypyk_curl_json(
    'https://api.openai.com/v1/responses',
    ['Authorization: Bearer ' . $apiKey],
    [
        'model' => $secrets['openai_model'] ?? 'gpt-4.1-mini',
        'instructions' => $instructions,
        'input' => $prompt,
        'max_output_tokens' => 180,
        'store' => false,
    ],
    30
);

if ($result['status'] < 200 || $result['status'] >= 300 || !is_array($result['json'])) {
    tinypyk_json(502, ['error' => 'Tiny Coach is taking a short break. Try again soon.']);
}

$answer = tinypyk_extract_response_text($result['json']);
if ($answer === '' || tinypyk_moderation_flagged((string) $apiKey, $answer)) {
    $answer = 'Try one small step: check your first block, then press Play again.';
}

tinypyk_json(200, ['answer' => $answer]);
