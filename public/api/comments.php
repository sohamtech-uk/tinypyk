<?php

declare(strict_types=1);

require __DIR__ . '/_shared.php';

function tinypyk_comments_extract_response_text(array $data): string
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

function tinypyk_comments_clean_code(string $text): string
{
    $text = trim($text);
    $text = preg_replace('/^```(?:python)?\s*/i', '', $text) ?? $text;
    $text = preg_replace('/\s*```$/i', '', $text) ?? $text;

    return trim($text);
}

tinypyk_require_post();

$secrets = tinypyk_load_secrets();
$apiKey = $secrets['openai_api_key'] ?? '';

if ($apiKey === '') {
    tinypyk_json(503, ['error' => 'Friendly comments need an adult to add the OpenAI key in Admin.']);
}

$data = tinypyk_read_json();
$code = tinypyk_text($data, 'code', 5000);
$lessonTitle = tinypyk_text($data, 'lessonTitle', 160);

if ($code === '') {
    tinypyk_json(200, ['code' => '# Add blocks to make Python code appear here.']);
}

$instructions = implode("\n", [
    'You add short Python comments for TinyPyk, a block coding app for children aged 5 to 7.',
    'Return only Python code. Do not use markdown fences.',
    'Do not change executable code, names, strings, indentation, or line order.',
    'Add only brief, kind comments that explain what the code does.',
    'Use simple words a young child can understand.',
    'Do not ask for personal information and do not add external links.',
]);

$prompt = "Lesson: {$lessonTitle}\n\nPython code:\n{$code}\n\nAdd helpful comments.";

$result = tinypyk_curl_json(
    'https://api.openai.com/v1/responses',
    ['Authorization: Bearer ' . $apiKey],
    [
        'model' => $secrets['openai_model'] ?? 'gpt-4.1-mini',
        'instructions' => $instructions,
        'input' => $prompt,
        'max_output_tokens' => 650,
        'store' => false,
    ],
    30
);

if ($result['status'] < 200 || $result['status'] >= 300 || !is_array($result['json'])) {
    tinypyk_json(502, ['error' => 'Friendly comments are taking a short break.']);
}

$commentedCode = tinypyk_comments_clean_code(tinypyk_comments_extract_response_text($result['json']));
if ($commentedCode === '') {
    tinypyk_json(502, ['error' => 'Friendly comments did not return code.']);
}

tinypyk_json(200, ['code' => $commentedCode]);
