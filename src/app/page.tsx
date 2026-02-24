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
    <div className="h-full md:h-screen flex flex-col overflow-auto md:overflow-hidden relative bg-background antialiased">
      {/* Decorative background gradients */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-purple/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-indigo/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="h-auto min-h-[3.5rem] flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:px-6 border-b border-card-border glass sticky top-0 z-40 gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Braces className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight leading-none text-foreground">JS Visualizer</h1>
              <p className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider">
                {mode === "visualizer" ? "Event Loop" : "Code Playground"}
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center bg-sidebar/50 backdrop-blur-sm rounded-xl p-1 border border-card-border">
            <button
              onClick={() => setMode("visualizer")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${mode === "visualizer"
                ? "bg-white dark:bg-card text-foreground shadow-sm border border-card-border"
                : "text-muted hover:text-foreground"
                }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Visualizer
            </button>
            <button
              onClick={() => setMode("playground")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${mode === "playground"
                ? "bg-white dark:bg-card text-foreground shadow-sm border border-card-border"
                : "text-muted hover:text-foreground"
                }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              Playground
            </button>
          </div>

          {/* Mode-specific header controls */}
          <div className="hidden xs:block">
            {mode === "visualizer" && (
              <ExampleSelector
                selectedExample={selectedExample}
                onSelect={handleSelectExample}
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {/* Example selector for mobile only */}
          <div className="xs:hidden flex-1">
            {mode === "visualizer" && (
              <ExampleSelector
                selectedExample={selectedExample}
                onSelect={handleSelectExample}
              />
            )}
          </div>
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
                className="apple-button h-8 px-4 bg-accent text-white hover:bg-accent-hover text-xs disabled:opacity-50 shadow-md shadow-accent/10"
              >
                <Play className="h-3.5 w-3.5 mr-1.5" />
                {isRunning ? "Running..." : "Run"}
                <span className="ml-2 text-[10px] opacity-60 font-medium">⌘↵</span>
              </button>
            </div>
          )}

          <div className="w-px h-8 bg-card-border mx-1" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      {mode === "visualizer" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Progress Bar */}
          <div className="border-b border-card-border glass z-30">
            <ProgressBar
              currentStep={state.currentStep}
              totalSteps={state.totalSteps}
              onSeek={handleSeek}
            />
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-auto lg:overflow-hidden p-2 sm:p-4 gap-2 sm:gap-4">
            {/* Left Panel: Code + Console */}
            <div className="w-full lg:w-[38%] lg:min-w-[400px] flex flex-col gap-2 sm:gap-4">
              <div className="h-[400px] lg:flex-1 min-h-[300px] apple-card shadow-sm">
                <CodeEditor
                  code={selectedExample.code}
                  readOnly
                  highlightLines={state.highlightLines}
                />
              </div>
              <div className="h-[180px] lg:h-[200px] min-h-[180px] apple-card shadow-sm">
                <ConsoleOutput items={state.consoleLogs} />
              </div>
            </div>

            {/* Right Panel: Visualization */}
            <div className="flex-1 flex flex-col gap-2 sm:gap-4 min-w-0 min-h-[600px] lg:min-h-0">
              {/* Top: Call Stack + Web APIs */}
              <div className="flex-[5] flex flex-col md:flex-row gap-2 sm:gap-4 min-h-0">
                <div className="flex-1 min-w-0 min-h-[200px] lg:min-h-0 apple-card shadow-sm">
                  <CallStack items={state.callStack} />
                </div>
                <div className="flex-1 min-w-0 min-h-[200px] lg:min-h-0 apple-card shadow-sm">
                  <WebAPIs items={state.webAPIs} />
                </div>
              </div>

              {/* Event Loop Indicator */}
              <div className="py-1">
                <EventLoopIndicator active={state.eventLoopActive} />
              </div>

              {/* Bottom: Task Queue + Microtask Queue */}
              <div className="flex-[4] flex flex-col md:flex-row gap-2 sm:gap-4 min-h-0">
                <div className="flex-1 min-w-0 min-h-[200px] lg:min-h-0 apple-card shadow-sm">
                  <TaskQueue items={state.taskQueue} />
                </div>
                <div className="flex-1 min-w-0 min-h-[200px] lg:min-h-0 apple-card shadow-sm">
                  <MicrotaskQueue items={state.microtaskQueue} />
                </div>
              </div>

              {/* Step Description */}
              <div className="min-h-[80px] rounded-2xl border border-card-border liquid-glass p-4 shadow-lg shadow-black/5 transition-all hover:shadow-xl hover:shadow-black/10">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquareText className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    {state.description ? (
                      <p className="text-sm leading-relaxed font-medium text-foreground/90 animate-fade-in">
                        {state.description}
                      </p>
                    ) : (
                      <div className="text-sm text-muted font-medium">
                        Press{" "}
                        <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-sidebar border border-card-border text-[10px] font-mono shadow-sm">
                          →
                        </kbd>{" "}
                        or click <strong>Step Forward</strong> to start visualizing the execution.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Playground Mode */
        <div className="flex-1 flex flex-col md:flex-row overflow-auto md:overflow-hidden">
          {/* Left: Code Editor */}
          <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-card-border h-[500px] md:h-full">
            {/* Snippet selector */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-card-border bg-card overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-muted uppercase tracking-wider font-semibold shrink-0">Snippets:</span>
              {playgroundSnippets.map((snippet) => (
                <button
                  key={snippet.label}
                  onClick={() => {
                    setPlaygroundCode(snippet.code);
                    setPlaygroundOutput([]);
                    setExecutionTime(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap border ${playgroundCode === snippet.code
                    ? "bg-accent shadow-lg shadow-accent/20 text-white border-accent"
                    : "bg-white/50 dark:bg-card/50 backdrop-blur-sm text-muted hover:text-foreground hover:bg-white dark:hover:bg-card border-card-border"
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
          <div className="w-full md:w-1/2 flex flex-col h-[300px] md:h-full">
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
