"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Braces, MessageSquareText, Play, Eye, Code2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CodeEditor } from "@/components/CodeEditor";
import { CallStack } from "@/components/CallStack";
import { WebAPIs } from "@/components/WebAPIs";
import { TaskQueue } from "@/components/TaskQueue";
import { MicrotaskQueue } from "@/components/MicrotaskQueue";
import { EventLoopIndicator } from "@/components/EventLoopIndicator";
import { ConsoleOutput } from "@/components/ConsoleOutput";
import { Controls } from "@/components/Controls";
import { ExampleSelector } from "@/components/ExampleSelector";
import { ProgressBar } from "@/components/ProgressBar";
import { ManualConsole } from "@/components/ManualConsole";
import { createInitialState, computeStateAtStep, applyStep } from "@/lib/engine";
import { type VisualizerExample, type VisualizerState } from "@/lib/types";
import { allExamples } from "@/data/examples";
import { executeCode, type OutputLine } from "@/lib/executeCode";

type AppMode = "visualizer" | "playground";

const playgroundSnippets = [
  {
    label: "Event Loop Demo",
    code: `console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise callback');
});

console.log('End');
// Output: Start, End, Promise callback, Timeout callback`,
  },
  {
    label: "Async/Await",
    code: `async function fetchData() {
  console.log('Fetching...');
  const data = await Promise.resolve({ name: 'JS Visualizer' });
  console.log('Data:', JSON.stringify(data));
  return data;
}

console.log('Before fetch');
fetchData().then(() => console.log('Done!'));
console.log('After fetch call');`,
  },
  {
    label: "Closures",
    code: `function createCounter(initial) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log('Final:', counter.getCount());`,
  },
  {
    label: "Array Methods",
    code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evenSquares = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * n);
console.log('Even squares:', evenSquares);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);

const grouped = numbers.reduce((acc, n) => {
  const key = n % 2 === 0 ? 'even' : 'odd';
  acc[key] = acc[key] || [];
  acc[key].push(n);
  return acc;
}, {});
console.log('Grouped:', JSON.stringify(grouped));`,
  },
  {
    label: "Promises",
    code: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Starting...');

Promise.all([
  delay(100).then(() => 'First'),
  delay(200).then(() => 'Second'),
  delay(50).then(() => 'Third'),
]).then(results => {
  console.log('All resolved:', results);
});

Promise.race([
  delay(100).then(() => 'Slow'),
  delay(50).then(() => 'Fast'),
]).then(winner => {
  console.log('Race winner:', winner);
});`,
  },
  {
    label: "Generators",
    code: `function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
const first10 = [];
for (let i = 0; i < 10; i++) {
  first10.push(fib.next().value);
}
console.log('Fibonacci:', first10);`,
  },
];

export default function Home() {
  const [mode, setMode] = useState<AppMode>("visualizer");

  // ── Visualizer state ──
  const [selectedExample, setSelectedExample] = useState<VisualizerExample>(allExamples[0]);
  const [state, setState] = useState<VisualizerState>(() =>
    createInitialState(selectedExample.steps)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Playground state ──
  const [playgroundCode, setPlaygroundCode] = useState(playgroundSnippets[0].code);
  const [playgroundOutput, setPlaygroundOutput] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);


  // ── Visualizer handlers ──
  const handleSelectExample = useCallback((example: VisualizerExample) => {
    setSelectedExample(example);
    setState(createInitialState(example.steps));
    setIsPlaying(false);
  }, []);

  const stepBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep < 0) return prev;
      const prevStep = prev.currentStep - 1;
      if (prevStep < 0) return createInitialState(selectedExample.steps);
      return computeStateAtStep(selectedExample.steps, prevStep);
    });
  }, [selectedExample]);

  const handleReset = useCallback(() => {
    setState(createInitialState(selectedExample.steps));
    setIsPlaying(false);
  }, [selectedExample]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const stepForward = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= prev.totalSteps - 1) return prev;
      const nextStep = prev.currentStep + 1;
      const newState = applyStep(prev, selectedExample.steps[nextStep]);
      return { ...newState, currentStep: nextStep };
    });
  }, [selectedExample]);

  const handleSeek = useCallback((step: number) => {
    setIsPlaying(false);
    if (step < 0) {
      setState(createInitialState(selectedExample.steps));
    } else {
      setState(computeStateAtStep(selectedExample.steps, step));
    }
  }, [selectedExample]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.currentStep >= prev.totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          const nextStep = prev.currentStep + 1;
          const newState = applyStep(prev, selectedExample.steps[nextStep]);
          return { ...newState, currentStep: nextStep };
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, selectedExample]);

  // ── Playground handlers ──
  const handleRunCode = useCallback(() => {
    setPlaygroundOutput([]);
    setIsRunning(true);
    setExecutionTime(null);

    setTimeout(() => {
      const { executionTime: time } = executeCode(playgroundCode, (line: OutputLine) => {
        setPlaygroundOutput((prev) => [...prev, line]);
      });
      setExecutionTime(time);
      setIsRunning(false);
    }, 50);
  }, [playgroundCode]);



  const handleClearOutput = useCallback(() => {
    setPlaygroundOutput([]);
    setExecutionTime(null);
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
      if (target.closest(".monaco-editor")) return;

      if (mode === "visualizer") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          stepForward();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          stepBack();
        } else if (e.key === " ") {
          e.preventDefault();
          handlePlayPause();
        }
      }

      if (mode === "playground" && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, stepForward, stepBack, handlePlayPause, handleRunCode]);

  // ── Render ──
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-[3.25rem] min-h-[3.25rem] flex items-center justify-between px-4 border-b border-card-border bg-card">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
              <Braces className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">JS Visualizer</h1>
              <p className="text-[10px] text-muted leading-tight">
                {mode === "visualizer" ? "Event Loop Execution" : "Code Playground"}
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center bg-sidebar rounded-lg p-0.5 border border-card-border">
            <button
              onClick={() => setMode("visualizer")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${mode === "visualizer"
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-foreground"
                }`}
            >
              <Eye className="h-3 w-3" />
              Visualizer
            </button>
            <button
              onClick={() => setMode("playground")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${mode === "playground"
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-foreground"
                }`}
            >
              <Code2 className="h-3 w-3" />
              Playground
            </button>
          </div>

          {/* Mode-specific header controls */}
          {mode === "visualizer" && (
            <ExampleSelector
              selectedExample={selectedExample}
              onSelect={handleSelectExample}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          {mode === "visualizer" && (
            <Controls
              currentStep={state.currentStep}
              totalSteps={state.totalSteps}
              isPlaying={isPlaying}
              speed={speed}
              onStepForward={stepForward}
              onStepBack={stepBack}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onSpeedChange={setSpeed}
            />
          )}



          {mode === "playground" && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-success text-white hover:bg-success/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default shadow-sm"
              >
                <Play className="h-3 w-3" />
                {isRunning ? "Running..." : "Run"}
                <kbd className="ml-1 text-[9px] opacity-70">⌘↵</kbd>
              </button>
            </div>
          )}

          <div className="w-px h-6 bg-card-border" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      {mode === "visualizer" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Progress Bar */}
          <div className="border-b border-card-border bg-card">
            <ProgressBar
              currentStep={state.currentStep}
              totalSteps={state.totalSteps}
              onSeek={handleSeek}
            />
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Code + Console */}
            <div className="w-[38%] min-w-[320px] flex flex-col border-r border-card-border">
              <div className="flex-1 p-2 pb-1 min-h-0">
                <CodeEditor
                  code={selectedExample.code}
                  readOnly
                  highlightLines={state.highlightLines}
                />
              </div>
              <div className="h-[170px] min-h-[170px] p-2 pt-1">
                <ConsoleOutput items={state.consoleLogs} />
              </div>
            </div>

            {/* Right Panel: Visualization */}
            <div className="flex-1 flex flex-col p-2 gap-2 min-w-0">
              {/* Top: Call Stack + Web APIs */}
              <div className="flex-1 flex gap-2 min-h-0">
                <div className="flex-1 min-w-0">
                  <CallStack items={state.callStack} />
                </div>
                <div className="flex-1 min-w-0">
                  <WebAPIs items={state.webAPIs} />
                </div>
              </div>

              {/* Event Loop Indicator */}
              <EventLoopIndicator active={state.eventLoopActive} />

              {/* Bottom: Task Queue + Microtask Queue */}
              <div className="flex-1 flex gap-2 min-h-0">
                <div className="flex-1 min-w-0">
                  <TaskQueue items={state.taskQueue} />
                </div>
                <div className="flex-1 min-w-0">
                  <MicrotaskQueue items={state.microtaskQueue} />
                </div>
              </div>

              {/* Step Description */}
              <div className="min-h-[72px] rounded-lg border border-card-border bg-card p-3">
                <div className="flex items-start gap-2">
                  <MessageSquareText className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    {state.description ? (
                      <p className="text-sm leading-relaxed animate-fade-in">
                        {state.description}
                      </p>
                    ) : (
                      <p className="text-sm text-muted">
                        Press{" "}
                        <kbd className="px-1.5 py-0.5 rounded bg-sidebar border border-card-border text-xs font-mono">
                          →
                        </kbd>{" "}
                        or click <strong>Step Forward</strong> to start.
                        Use{" "}
                        <kbd className="px-1.5 py-0.5 rounded bg-sidebar border border-card-border text-xs font-mono">
                          Space
                        </kbd>{" "}
                        to play/pause.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Playground Mode */
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Code Editor */}
          <div className="w-1/2 flex flex-col border-r border-card-border">
            {/* Snippet selector */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-card-border bg-card overflow-x-auto">
              <span className="text-[10px] text-muted uppercase tracking-wider font-semibold shrink-0">Snippets:</span>
              {playgroundSnippets.map((snippet) => (
                <button
                  key={snippet.label}
                  onClick={() => {
                    setPlaygroundCode(snippet.code);
                    setPlaygroundOutput([]);
                    setExecutionTime(null);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${playgroundCode === snippet.code
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "bg-sidebar text-muted hover:text-foreground hover:bg-sidebar-hover border border-transparent"
                    }`}
                >
                  {snippet.label}
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="flex-1 p-2 min-h-0">
              <CodeEditor
                code={playgroundCode}
                onChange={setPlaygroundCode}
              />
            </div>
          </div>

          {/* Right: Console Output */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 p-2 min-h-0">
              <ManualConsole
                output={playgroundOutput}
                isRunning={isRunning}
                executionTime={executionTime}
                onClear={handleClearOutput}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
