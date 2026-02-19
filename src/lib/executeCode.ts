export interface OutputLine {
  id: string;
  type: "log" | "error" | "warn" | "info";
  content: string;
}

const formatValue = (val: unknown): string => {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "string") return val;
  if (typeof val === "function")
    return `[Function: ${val.name || "anonymous"}]`;
  if (val instanceof Error) return `${val.name}: ${val.message}`;
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
};

const formatArgs = (args: unknown[]): string => {
  return args.map(formatValue).join(" ");
};

let outputCounter = 0;

export function executeCode(
  code: string,
  onOutput: (line: OutputLine) => void
): { executionTime: number } {
  const startTime = performance.now();

  const pushOutput = (type: OutputLine["type"], args: unknown[]) => {
    onOutput({
      id: `output-${++outputCounter}`,
      type,
      content: formatArgs(args),
    });
  };

  const mockConsole = {
    log: (...args: unknown[]) => pushOutput("log", args),
    error: (...args: unknown[]) => pushOutput("error", args),
    warn: (...args: unknown[]) => pushOutput("warn", args),
    info: (...args: unknown[]) => pushOutput("info", args),
  };

  try {
    const wrappedCode = `"use strict";\n${code}`;
    const fn = new Function(
      "console",
      "setTimeout",
      "setInterval",
      "clearInterval",
      "clearTimeout",
      "Promise",
      wrappedCode
    );

    const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];
    const pendingIntervals: ReturnType<typeof setInterval>[] = [];

    const mockSetTimeout = (callback: () => void, ms: number) => {
      const id = setTimeout(() => {
        try {
          callback();
        } catch (err) {
          pushOutput("error", [
            err instanceof Error ? err.message : String(err),
          ]);
        }
      }, Math.min(ms, 5000));
      pendingTimeouts.push(id);
      return id;
    };

    const mockSetInterval = (callback: () => void, ms: number) => {
      const id = setInterval(() => {
        try {
          callback();
        } catch (err) {
          pushOutput("error", [
            err instanceof Error ? err.message : String(err),
          ]);
        }
      }, Math.max(ms, 50));
      pendingIntervals.push(id);
      return id;
    };

    fn(
      mockConsole,
      mockSetTimeout,
      mockSetInterval,
      (id: ReturnType<typeof setInterval>) => clearInterval(id),
      (id: ReturnType<typeof setTimeout>) => clearTimeout(id),
      Promise
    );

    setTimeout(() => {
      pendingTimeouts.forEach(clearTimeout);
      pendingIntervals.forEach(clearInterval);
    }, 6000);
  } catch (err) {
    pushOutput("error", [
      err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    ]);
  }

  const executionTime = performance.now() - startTime;
  return { executionTime };
}
