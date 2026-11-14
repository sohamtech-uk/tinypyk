import { spaceExplorerProjectId } from './spaceExplorer';

export type SpaceCheckResult = { ok: boolean; feedback: string };

// A friendly structural checkpoint, not a complete Python code grader.
// It is checked only after the program runs without a Python error.
export function checkSpaceMission(id: string, source: string): SpaceCheckResult {
  const code = source.trim();
  const hasPrint = /\bprint\s*\(/.test(code);
  const inputs = (code.match(/\binput\s*\(/g) || []).length;
  const hasChoice = /^\s*if\s+.+:\s*$/m.test(code) && /^\s*else\s*:\s*$/m.test(code);
  const hasLoop = /^\s*(for\s+\w+\s+in\s+|while\s+.+:)/m.test(code);
  const definitions = [...code.matchAll(/^\s*def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:/gm)];
  const functions = definitions.map((definition) => {
    const calls = code.match(new RegExp('^\\s*' + definition[1] + '\\s*\\(', 'gm')) || [];
    return { parameters: definition[2].trim(), calls: calls.length };
  });
  const hasFunction = functions.some((entry) => entry.calls >= 1);
  const hasTwice = functions.some((entry) => entry.calls >= 2);
  const hasParameter = functions.some((entry) => entry.parameters.length > 0 && entry.calls >= 1);
  const hasParameterTwice = functions.some((entry) => entry.parameters.length > 0 && entry.calls >= 2);

  const requirements: Record<string, [boolean, string][]> = {
    'space-m1-1': [[hasPrint, 'Add a message block so Python prints your greeting.']],
    'space-m1-2': [[inputs >= 1, 'Add an ask block using input().'], [hasPrint, 'Print the saved answer.']],
    'space-m1-3': [[inputs >= 1, 'Ask which planet to visit.'], [hasChoice, 'Add an if/else choice for the planet.']],
    'space-m1-4': [[hasLoop, 'Put a message inside a repeat block.'], [hasPrint, 'Show a launch message.']],
    'space-m2-1': [[hasFunction, 'Define a function and add a matching call block.']],
    'space-m2-2': [[hasTwice, 'Call the same function at least twice.']],
    'space-m2-3': [[hasParameter, 'Define a function with a parameter and call it with a value.']],
    'space-m2-4': [[hasParameterTwice, 'Call the parameter function at least twice.']],
    [spaceExplorerProjectId]: [
      [inputs >= 2, 'Ask two questions: astronaut nickname and planet.'],
      [hasChoice, 'Add an if/else choice for the planet.'],
      [hasLoop, 'Add a repeated launch check.'],
      [hasFunction, 'Define a helper function and call it.'],
      [hasPrint, 'Show messages in your space story.'],
    ],
  };

  const checks = requirements[id];
  if (!checks) return { ok: false, feedback: 'This is not a Space Explorer mission.' };
  const missing = checks.find(([passed]) => !passed);
  return missing
    ? { ok: false, feedback: missing[1] }
    : { ok: true, feedback: 'Space mission passed! Well done.' };
}
