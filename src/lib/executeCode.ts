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

// Types for visualization state (mirror VisualizerState from types.ts)
export interface VizStackItem {
  id: string;
  label: string;
  color?: string;
}
export interface VizWebAPIItem {
  id: string;
  label: string;
  detail?: string;
  color?: string;
}
export interface VizQueueItem {
  id: string;
  label: string;
  color?: string;
}
export interface VizConsoleItem {
  id: string;
  content: string;
  type: "log" | "error" | "warn";
}
export interface VizStateUpdate {
  callStack?: VizStackItem[];
  webAPIs?: VizWebAPIItem[];
  taskQueue?: VizQueueItem[];
  microtaskQueue?: VizQueueItem[];
  consoleLogs?: VizConsoleItem[];
  eventLoopActive?: boolean;
}

let vizIdCounter = 0;
const nextId = () => `viz-${++vizIdCounter}-${Date.now()}`;

/**
 * Runs user code and drives the visualizer (call stack, Web APIs, task queue, microtask queue).
 * Calls onStateUpdate whenever the execution state changes.
 */
export function executeCodeWithVisualization(
  code: string,
  onOutput: (line: OutputLine) => void,
  onStateUpdate: (update: VizStateUpdate) => void
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
    log: (...args: unknown[]) =>
      pushOutput("log", args),
    error: (...args: unknown[]) =>
      pushOutput("error", args),
    warn: (...args: unknown[]) =>
      pushOutput("warn", args),
    info: (...args: unknown[]) =>
      pushOutput("info", args),
  };

  let callStack: VizStackItem[] = [];
  let webAPIs: VizWebAPIItem[] = [];
  let taskQueue: VizQueueItem[] = [];
  let microtaskQueue: VizQueueItem[] = [];
  const consoleLogs: VizConsoleItem[] = [];

  const pushLog = (type: VizConsoleItem["type"], content: string) => {
    const item: VizConsoleItem = {
      id: nextId(),
      type,
      content,
    };
    consoleLogs.push(item);
    flushState();
  };

  const flushState = () => {
    onStateUpdate({
      callStack: [...callStack],
      webAPIs: [...webAPIs],
      taskQueue: [...taskQueue],
      microtaskQueue: [...microtaskQueue],
      consoleLogs: [...consoleLogs],
      eventLoopActive: true,
    });
  };

  const pushStack = (label: string, color = "#3b82f6") => {
    const id = nextId();
    callStack = [...callStack, { id, label, color }];
    flushState();
    return id;
  };
  const popStack = (id: string) => {
    callStack = callStack.filter((item) => item.id !== id);
    flushState();
  };

  const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];
  const pendingIntervals: ReturnType<typeof setInterval>[] = [];

  const mockSetTimeout = (callback: () => void, ms: number) => {
    const timerId = nextId();
    const label = `setTimeout(${ms}ms)`;
    webAPIs = [...webAPIs, { id: timerId, label, detail: `${ms}ms` }];
    flushState();

    const id = setTimeout(() => {
      webAPIs = webAPIs.filter((w) => w.id !== timerId);
      const taskId = nextId();
      taskQueue = [...taskQueue, { id: taskId, label: "setTimeout callback", color: "#3b82f6" }];
      flushState();

      const stackId = pushStack("setTimeout callback");
      try {
        callback();
      } catch (err) {
        pushLog("error", err instanceof Error ? err.message : String(err));
      }
      popStack(stackId);
      taskQueue = taskQueue.filter((t) => t.id !== taskId);
      flushState();
    }, Math.min(ms, 3000));
    pendingTimeouts.push(id);
    return id;
  };

  const mockSetInterval = (callback: () => void, ms: number) => {
    const id = setInterval(() => {
      try {
        callback();
      } catch (err) {
        pushLog("error", err instanceof Error ? err.message : String(err));
      }
    }, Math.max(ms, 50));
    pendingIntervals.push(id);
    return id;
  };

  const mockClearTimeout = (id: ReturnType<typeof setTimeout>) => clearTimeout(id);
  const mockClearInterval = (id: ReturnType<typeof setInterval>) => clearInterval(id);

  const scheduleMicrotask = (callback: () => void, thenId: string) => {
    microtaskQueue = [
      ...microtaskQueue,
      { id: thenId, label: "Promise.then", color: "#10b981" },
    ];
    flushState();
    setTimeout(() => {
      microtaskQueue = microtaskQueue.filter((t) => t.id !== thenId);
      flushState();
      const stackId = pushStack("Promise callback", "#10b981");
      try {
        callback();
      } catch (err) {
        pushLog("error", err instanceof Error ? err.message : String(err));
      }
      popStack(stackId);
    }, 0);
  };

  const createThenable = (value: unknown) => ({
    then(onFulfilled?: (v: unknown) => unknown) {
      const thenId = nextId();
      scheduleMicrotask(
        () => typeof onFulfilled === "function" && onFulfilled(value),
        thenId
      );
      return { then: () => this };
    },
  });

  function MockPromise(
    this: { then: (onFulfilled?: (v: unknown) => unknown) => unknown },
    executor: (resolve: (v: unknown) => void, reject: (r: unknown) => void) => void
  ) {
    let value: unknown;
    const then = (onFulfilled?: (v: unknown) => unknown) => {
      const thenId = nextId();
      scheduleMicrotask(
        () => typeof onFulfilled === "function" && onFulfilled(value),
        thenId
      );
      return createThenable(undefined);
    };
    executor(
      (v) => {
        value = v;
        setTimeout(() => {}, 0);
      },
      () => {}
    );
    this.then = then;
    return this;
  }
  MockPromise.resolve = (v: unknown) => createThenable(v);
  MockPromise.reject = () => createThenable(undefined);
  (MockPromise as unknown as PromiseConstructor).all = (promises: unknown[]) =>
    createThenable(promises);
  (MockPromise as unknown as PromiseConstructor).race = (promises: unknown[]) =>
    createThenable(promises?.[0]);

  try {
    callStack = [{ id: nextId(), label: "main()", color: "#3b82f6" }];
    flushState();

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

    fn(
      {
        ...mockConsole,
        log: (...args: unknown[]) => {
          pushLog("log", formatArgs(args));
        },
        error: (...args: unknown[]) => {
          pushLog("error", formatArgs(args));
        },
        warn: (...args: unknown[]) => {
          pushLog("warn", formatArgs(args));
        },
        info: (...args: unknown[]) => {
          pushLog("log", formatArgs(args));
        },
      },
      mockSetTimeout,
      mockSetInterval,
      mockClearInterval,
      mockClearTimeout,
      MockPromise
    );

    callStack = [];
    onStateUpdate({
      callStack: [],
      webAPIs: [...webAPIs],
      taskQueue: [...taskQueue],
      microtaskQueue: [...microtaskQueue],
      consoleLogs: [...consoleLogs],
      eventLoopActive: true,
    });

    setTimeout(() => {
      pendingTimeouts.forEach(clearTimeout);
      pendingIntervals.forEach(clearInterval);
      onStateUpdate({ eventLoopActive: false });
    }, 5000);
  } catch (err) {
    pushLog("error", err instanceof Error ? err.message : String(err));
    callStack = [];
    flushState();
  }

  const executionTime = performance.now() - startTime;
  return { executionTime };
}
