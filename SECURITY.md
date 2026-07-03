# Security and Safety

TinyPyk is child-facing software. Please report security and child-safety
issues carefully.

## What to Report

- Exposed API keys, passwords, tokens, or private files.
- Ways for children to share personal information publicly.
- Unsafe AI coach responses or voice output.
- Cross-site scripting, injection, or file access issues.
- Problems in the admin panel or PHP API endpoints.
- Any content flow that is not suitable for young learners.

## How to Report

If GitHub Security Advisories are enabled for the repository, use a private
security advisory. If they are not enabled, contact the repository owner through
GitHub and avoid posting exploit details publicly.

For urgent child-protection concerns, contact local emergency or child
protection services first. TinyPyk maintainers cannot provide emergency
response.

## Secret Handling

- Never commit real `.env` files.
- Never commit `public/private/tinypyk_secrets.php`.
- Never place OpenAI, ElevenLabs, FTP, hosting, or admin credentials in browser
  code.
- Rotate any key that may have been shared or committed.

## Maintainer Response

Maintainers should triage safety reports before normal feature work, remove
publicly exposed secrets, and publish a short fix note once the issue is
resolved.
