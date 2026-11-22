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
    // Value-returning calls can appear inside assignments, not just at line starts.
    const occurrences = code.match(new RegExp('\\b' + definition[1] + '\\s*\\(', 'g')) || [];
    return { parameters: definition[2].trim(), calls: Math.max(0, occurrences.length - 1) };
  });
  const hasFunction = functions.some((entry) => entry.calls >= 1);
  const hasTwice = functions.some((entry) => entry.calls >= 2);
  const hasParameter = functions.some((entry) => entry.parameters.length > 0 && entry.calls >= 1);
  const hasParameterTwice = functions.some((entry) => entry.parameters.length > 0 && entry.calls >= 2);
  const hasReturn = /^\s*return\b/m.test(code);

  const requirements: Record<string, [boolean, string][]> = {
    'space-m1-1': [[hasPrint, 'Add a message block so Python prints your greeting.']],
    'space-m1-2': [[inputs >= 1, 'Add an ask block using input().'], [hasPrint, 'Print the saved answer.']],
    'space-m1-3': [[inputs >= 1, 'Ask which planet to visit.'], [hasChoice, 'Add an if/else choice for the planet.']],
    'space-m1-4': [[hasLoop, 'Put a message inside a repeat block.'], [hasPrint, 'Show a launch message.']],
    'space-m2-1': [[hasFunction, 'Define a function and add a matching call block.']],
    'space-m2-2': [[hasTwice, 'Call the same function at least twice.']],
    'space-m2-3': [[hasParameter, 'Define a function with a parameter and call it with a value.']],
    'space-m2-4': [[hasParameterTwice, 'Call the parameter function at least twice.']],
    'space-bonus-1': [
      [hasParameterTwice, 'Use a parameter function and call it for at least two treasures.'],
      [hasReturn, 'Add a return value so your function gives back stars.'],
    ],
    'space-bonus-2': [
      [hasParameterTwice, 'Call the same planet function at least twice with different arguments.'],
      [hasLoop, 'Add a repeat block for the launch checks.'],
    ],
    'space-bonus-3': [
      [inputs >= 1, 'Ask the alien quiz question using input().'],
      [hasChoice, 'Use an if/else block to choose the right score.'],
      [hasFunction, 'Define and call your quiz function.'],
      [hasReturn, 'Return points from both quiz outcomes.'],
    ],
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
