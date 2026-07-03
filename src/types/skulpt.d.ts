declare module 'skulpt' {
  type SkulptFile = {
    $builtinmodule?: unknown;
  };

  type SkulptConfigureOptions = {
    output?: (text: string) => void;
    read?: (fileName: string) => string | SkulptFile;
    inputfun?: (prompt: string) => string | Promise<string>;
    inputfunTakesPrompt?: boolean;
    killableWhile?: boolean;
    killableFor?: boolean;
    breakpoints?: () => boolean;
    execLimit?: number;
    timeoutMsg?: () => string;
    __future__?: Record<string, boolean | null>;
  };

  type SkulptSuspension = {
    resume: () => unknown;
    data?: Record<string, unknown>;
  };

  const Sk: {
    configure(options: SkulptConfigureOptions): void;
    importMainWithBody(
      name: string,
      dumpJS: boolean,
      body: string,
      canSuspend: boolean,
    ): unknown;
    misceval: {
      asyncToPromise<T>(
        fn: () => T,
        handlers?: Record<string, (suspension: SkulptSuspension) => Promise<unknown> | null>,
      ): Promise<T>;
    };
    builtinFiles?: {
      files: Record<string, string>;
    };
    TurtleGraphics?: {
      target: string;
      width: number;
      height: number;
    };
  };

  export default Sk;
}
