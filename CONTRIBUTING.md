# Contributing to TinyPyk

Thank you for helping make Python easier for young children to learn.

TinyPyk is open source, but it is also child-facing. That means every change
should be understandable, safe, accessible, and kind.

## Ways to Help

- Add or improve Python lessons and quests.
- Improve Blockly blocks and Python code generation.
- Test the editor with browsers, tablets, and classroom displays.
- Improve accessibility, keyboard support, contrast, and readable text.
- Translate learning text.
- Improve documentation and deployment notes.
- Review AI, voice, and admin features for child safety.

## Local Setup

```bash
git clone git@github.com:sohamtech-uk/tinypyk.git
cd tinypyk
npm install
npm run dev
```

Before sending a change, run:

```bash
npm run build
```

## Where to Make Changes

- Lessons and quest data: `src/lessons/lessons.ts`
- Lesson types: `src/types/lesson.ts`
- Blockly definitions: `src/blockly/customBlocks.ts`
- Blockly toolbox and categories: `src/blockly/toolbox.ts`
- Python generation: `src/blockly/pythonGenerators.ts`
- Scratch-style palette: `src/blockly/scratchPalette.ts`
- Stage characters: `src/studio/characters.ts`
- Main app flow: `src/App.tsx`
- Styling: `src/styles.css`
- Policy text: `src/content/policies.ts`
- Optional PHP endpoints: `public/api/`

## Lesson Guidelines

TinyPyk lessons should be short, joyful, and progressive.

- Start with one idea at a time.
- Show real Python, beginning with `print()`.
- Keep examples concrete: pets, stories, drawings, quizzes, music, and simple
  games.
- Avoid personal data. Do not ask children for real full names, addresses,
  phone numbers, email addresses, school details, photos, or passwords.
- Include a clear success goal and a small next step.
- Keep text readable for young learners and adults helping them.

## Code Guidelines

- Prefer existing patterns in the codebase.
- Keep UI controls consistent with the Scratch-style editor.
- Keep generated Python simple and authentic.
- Do not expose API keys or admin secrets to browser code.
- Do not add analytics, tracking, accounts, or sharing flows without explicit
  child-safety review.
- Keep comments useful and brief.

## Pull Request Checklist

- The change is scoped and easy to review.
- `npm run build` passes.
- New lessons or blocks show the expected Python output.
- The change does not introduce hard-coded secrets.
- The change does not ask children for private personal information.
- The change has been checked on a narrow screen if it affects layout.

## Reporting Problems

Use GitHub issues for bugs, lesson ideas, and feature requests. For security or
child-safety problems, follow [SECURITY.md](SECURITY.md).
