# Deployment Guide

This guide explains how to publish TinyPyk to a static/PHP host such as
Hostinger.

## Build Locally

```bash
npm install
npm run build
```

The production site is generated in `dist/`.

## Upload to Hosting

Upload the contents of `dist/` to the web root for the domain, usually
`public_html`.

The Vite build copies files from `public/` into `dist/`, including:

- `api/*.php`
- `private/.htaccess`
- `favicon.svg`
- `icons.svg`

Do not upload local development secrets.

## DNS

If the domain is managed in GoDaddy and hosting is in Hostinger, point the
domain to Hostinger using the DNS settings supplied by Hostinger. Common
options are:

- Use Hostinger nameservers in GoDaddy.
- Or keep GoDaddy nameservers and point `A` and `CNAME` records to Hostinger.

DNS changes can take time to propagate.

## Optional PHP API Features

TinyPyk works as a static app without PHP. PHP is only needed for:

- Kid-safe AI coach replies.
- Optional OpenAI comments on generated Python.
- ElevenLabs talking character voices.
- Admin configuration.

The PHP endpoints read secrets from either server environment variables or
`public/private/tinypyk_secrets.php`.

Recommended server environment variables:

```bash
TINYPYK_OPENAI_API_KEY=
TINYPYK_OPENAI_MODEL=gpt-4.1-mini
TINYPYK_ELEVENLABS_API_KEY=
TINYPYK_ELEVENLABS_VOICE_ID=
TINYPYK_ELEVENLABS_MODEL_ID=eleven_multilingual_v2
TINYPYK_SETUP_CODE=
```

## Admin Setup

1. Deploy the app.
2. Open `https://tinypyk.com/#admin`.
3. Create the admin password.
4. Add optional OpenAI and ElevenLabs keys.
5. Confirm the public editor still works when logged out.

If `TINYPYK_SETUP_CODE` is set, the first admin setup must include that code.

## Cache Busting

If the site still shows an older version:

- Hard refresh the browser.
- Clear hosting cache if Hostinger caching is enabled.
- Confirm the latest `dist/assets/*` files were uploaded.

## Deployment Checklist

- `npm run build` passes.
- `dist/` was uploaded, not `src/` or `node_modules/`.
- No real keys were committed.
- `public/private/tinypyk_secrets.php` is not in Git.
- `https://tinypyk.com/#learn` loads.
- Green flag, stop, input, output, lessons, policies, and homepage links work.
