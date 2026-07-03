# TinyPyk

TinyPyk is an open-source, Scratch-inspired block coding studio for young
children learning Python. Learners snap friendly blocks together, press the
green flag, see real Python, and watch characters respond on a stage.

The project is designed for supervised learning with children around ages 5 to
7. It is not a social network, and it should not collect children's personal
information.

## What TinyPyk Teaches

- Real Python ideas introduced gently, starting with `print()`.
- Progressive levels inspired by Hedy's "one idea at a time" learning model.
- Scratch-style categories such as Events, Motion, Looks, Sound, Control,
  Sensing, Operators, Variables, and My Blocks.
- Character, costume, sound, input, output, and stage-based projects.
- Optional kid-safe AI coach and talking character features through server-side
  API endpoints.

## Tech Stack

- React, TypeScript, and Vite.
- Blockly `13.0.0-beta.8` from the Raspberry Pi Foundation Blockly fork.
- Skulpt for browser-side Python execution.
- PHP endpoints for optional OpenAI, ElevenLabs, and admin configuration on
  simple shared hosting.

## Quick Start

Requirements:

- Node.js 20 or newer.
- npm.

Install and run locally:

```bash
npm install
npm run dev
```

The local app usually opens at:

```text
http://127.0.0.1:5173/
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Optional API Keys

TinyPyk can run without OpenAI or ElevenLabs. If those features are enabled,
keys must stay on the server and must never be committed to Git.

Supported environment variables:

```bash
TINYPYK_OPENAI_API_KEY=
TINYPYK_OPENAI_MODEL=gpt-4.1-mini
TINYPYK_ELEVENLABS_API_KEY=
TINYPYK_ELEVENLABS_VOICE_ID=
TINYPYK_ELEVENLABS_MODEL_ID=eleven_multilingual_v2
TINYPYK_SETUP_CODE=
```

On PHP hosting, the admin endpoint can also save secrets to
`public/private/tinypyk_secrets.php`. That file is ignored by Git and protected
by `public/private/.htaccess`.

Use `.env.example` as a template only. Do not put real production keys in this
repository.

## Project Structure

```text
src/
  blockly/       Blockly blocks, theme, toolbox, and Python generators
  components/    React UI for the studio, learning map, policies, and admin
  content/       Policy content
  lessons/       Progressive Python levels and starter workspaces
  runtime/       Skulpt runner and music helpers
  studio/        Character and stage data
public/
  api/           Optional PHP endpoints for coach, voice, comments, and admin
  private/       Server-only secret storage placeholder
docs/            Contributor, deployment, and architecture notes
```

## Deployment

For a static/PHP host such as Hostinger:

1. Run `npm run build`.
2. Upload the contents of `dist/` to the site's `public_html` directory.
3. Confirm PHP is enabled if you want the optional API features.
4. Keep server secrets outside Git, either in host environment variables or in
   the generated `public/private/tinypyk_secrets.php` file.
5. Visit `https://tinypyk.com/` and hard refresh if the browser cached older
   assets.

Detailed steps are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Contributing

TinyPyk welcomes help with lessons, blocks, accessibility, translations,
testing, design, documentation, and child-safe AI or voice features.

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Please also read
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and [SECURITY.md](SECURITY.md).

## Child Safety Principles

- Do not ask children for full names, locations, contact details, photos,
  passwords, or private family information.
- Keep examples warm, age-appropriate, and classroom-friendly.
- Treat AI and voice features as optional adult-configured tools.
- Prefer local, visible learning over accounts, sharing, or social features.

## Acknowledgements

TinyPyk is built with Blockly and thanks the Blockly team and Raspberry Pi
Foundation for making block-based coding tools available to the education
community.

TinyPyk is inspired by creative coding environments such as Scratch and gradual
Python learning approaches such as Hedy. TinyPyk is an independent project
unless stated otherwise.

## License

TinyPyk is released under the [MIT License](LICENSE).
