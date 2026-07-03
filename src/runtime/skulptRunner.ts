import Sk from 'skulpt';

export type OutputHandlers = {
  onText: (text: string) => void;
  onError: (error: string) => void;
  onInput?: (prompt: string) => Promise<string>;
  shouldStop?: () => boolean;
  turtleTargetId: string;
};

export type PythonRunResult = 'finished' | 'stopped' | 'error';
const stopSignal = 'TINYPYK_STOP';
const runtimePrelude = `
def play_sound(name):
    print("__TINYPYK_SOUND__|" + str(name))

def rest(seconds):
    print("__TINYPYK_REST__|" + str(seconds))
`;

function builtinRead(fileName: string) {
  if (!Sk.builtinFiles?.files[fileName]) {
    throw new Error(`File not found: ${fileName}`);
  }

  return Sk.builtinFiles.files[fileName];
}

export function mapPythonError(error: string) {
  if (error.includes('TimeLimitError')) {
    return 'That program kept going for too long. Check your loops, then press Play again.';
  }

  if (error.includes('NameError') && error.includes('t')) {
    return "Oops! Add the 'create turtle' block first.";
  }

  if (error.includes('SyntaxError')) {
    return 'Something is not connected properly. Check your blocks.';
  }

  if (error.includes('IndentationError')) {
    return 'Check the blocks inside your loop or if block.';
  }

  return 'Your code needs a small fix. Check the blocks and try again.';
}

function makeStopError() {
  return new Error(stopSignal);
}

function isStopError(error: unknown) {
  return String(error).includes(stopSignal);
}

function resumeWithStopCheck(suspension: { resume: () => unknown }, handlers: OutputHandlers) {
  return new Promise((resolve, reject) => {
    if (handlers.shouldStop?.()) {
      reject(makeStopError());
      return;
    }

    window.setTimeout(() => {
      try {
        if (handlers.shouldStop?.()) {
          reject(makeStopError());
          return;
        }

        resolve(suspension.resume());
      } catch (error) {
        reject(error);
      }
    }, 0);
  });
}

export async function runPython(code: string, handlers: OutputHandlers): Promise<PythonRunResult> {
  try {
    Sk.TurtleGraphics = {
      target: handlers.turtleTargetId,
      width: 500,
      height: 360,
    };

    Sk.configure({
      output: (text: string) => {
        if (handlers.shouldStop?.()) {
          throw makeStopError();
        }

        handlers.onText(text);
      },
      read: builtinRead,
      inputfun: (promptText: string) => {
        if (handlers.shouldStop?.()) {
          return Promise.reject(makeStopError());
        }

        return handlers.onInput?.(promptText) ?? Promise.resolve(window.prompt(promptText) ?? '');
      },
      inputfunTakesPrompt: true,
      killableWhile: true,
      killableFor: true,
      breakpoints: () => Boolean(handlers.shouldStop?.()),
      execLimit: 20000,
      timeoutMsg: () => 'TinyPyk stopped a program that kept going.',
    });

    await Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody('<stdin>', false, `${runtimePrelude}\n${code}`, true),
    {
      'Sk.delay': (suspension) => resumeWithStopCheck(suspension, handlers),
      'Sk.yield': (suspension) => resumeWithStopCheck(suspension, handlers),
    },
    );

    return 'finished';
  } catch (error) {
    if (isStopError(error)) {
      return 'stopped';
    }

    handlers.onError(mapPythonError(String(error)));
    return 'error';
  }
}
