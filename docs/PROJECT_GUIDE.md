# Project Guide

This document gives contributors a quick tour of TinyPyk.

## Learning Model

TinyPyk introduces Python progressively. The first levels begin with real
`print()` output, then add input, variables, strings, conditions, loops,
functions, and later data ideas.

Lessons are stored in `src/lessons/lessons.ts`. Each lesson includes:

- Title, goal, concept, duration, and mission.
- Short instructions and success criteria.
- Starter Blockly XML.
- Exercises or quests for warm-up, build, challenge, and debugging work.

## Editor Flow

The main app state lives in `src/App.tsx`.

The editor has three primary panels:

- Blocks: Blockly workspace with Scratch-style categories.
- Python: Generated Python code with optional friendly comments.
- Stage, Input, Output: Character stage, input prompt, and program output.

The green flag starts execution. The red stop button requests a stop through
the runtime.

## Blockly

Blockly-related files live in `src/blockly/`.

- `customBlocks.ts` defines TinyPyk-specific blocks.
- `toolbox.ts` controls categories and available blocks.
- `theme.ts` defines the Scratch-like Blockly appearance.
- `pythonGenerators.ts` turns blocks into Python.
- `scratchPalette.ts` keeps category colors consistent.
- `workspaceConfig.ts` configures the workspace.

When adding blocks, update the block definition, toolbox, Python generator, and
lesson starter XML if needed.

## Runtime

Runtime code lives in `src/runtime/`.

- `skulptRunner.ts` runs generated Python in the browser.
- `musicPlayer.ts` provides simple sound playback helpers.

TinyPyk should generate clear Python before adding runtime magic. If something
can be represented as normal Python for the learner, prefer that.

## Characters and Stage

Character data lives in `src/studio/characters.ts`.

Character images are stored in `src/assets/characters/`.

The stage supports multiple characters, backdrops, costume-like actions, and
simple animated responses. Keep assets lightweight so the app loads quickly on
school devices.

## Optional Server Features

Optional PHP endpoints live in `public/api/`.

- `admin.php` stores server-side configuration.
- `coach.php` can ask OpenAI for a small, child-safe hint.
- `comments.php` can add friendly comments to generated Python.
- `voice.php` can request ElevenLabs speech for talking characters.
- `_shared.php` contains common request, secret, and JSON helpers.

These endpoints must never expose raw API keys to browser JavaScript.

## Policies and Membership

- Policy content: `src/content/policies.ts`
- Policy UI: `src/components/PolicyPage.tsx`
- Membership UI: `src/components/MembershipPage.tsx`

Policy pages should be detailed enough for adults, but clear enough for a
school or club to understand the expectations before using TinyPyk publicly.

## Useful Commands

```bash
npm run dev
npm run build
npm run preview
```

Use `npm run build` as the minimum check before pushing code.
