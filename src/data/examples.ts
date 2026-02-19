import {
  VisualizationStep,
  VisualizerExample,
  ExampleCategory,
} from '@/lib/types';

// Backward-compatible type aliases for existing components
export type Example = VisualizerExample;
export type Category = ExampleCategory & { icon?: string };

// ============================================================================
// Category 1: Call Stack Basics
// ============================================================================

const simpleFunctionCalls: VisualizerExample = {
  id: 'simple-function-calls',
  title: 'Simple Function Calls',
  description: 'Shows how functions push and pop on the call stack',
  category: 'call-stack-basics',
  code: `function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

const result = square(5);
console.log(result);`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'The script starts executing. A global execution context (main) is pushed onto the call stack.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'square-call', label: 'square(5)', color: '#3b82f6' } }],
      description: 'Line 9: square(5) is called. A new frame for square is pushed onto the call stack.',
      highlightLines: [9],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'multiply-call', label: 'multiply(5, 5)', color: '#3b82f6' } }],
      description: 'Inside square, multiply(n, n) is called with n=5. Another frame is pushed. The stack now has 3 frames.',
      highlightLines: [6],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'multiply-call', label: 'multiply(5, 5)' } }],
      description: 'multiply returns 25 (5 * 5). Its frame is popped off the call stack.',
      highlightLines: [2],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'square-call', label: 'square(5)' } }],
      description: 'square receives 25 from multiply and returns it. Its frame is popped off the stack.',
      highlightLines: [6],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-1', label: 'console.log(25)', color: '#22c55e' } }],
      description: 'Line 10: console.log(result) is called with result=25. A new frame is pushed.',
      highlightLines: [10],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-1', label: '25' } }],
      description: '"25" is printed to the console.',
      highlightLines: [10],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-1', label: 'console.log(25)' } }],
      description: 'console.log finishes and is popped off the call stack.',
      highlightLines: [10],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'The script has finished executing. main() is popped off the call stack. The stack is now empty.',
      highlightLines: [],
    },
  ],
};

const recursiveCallStack: VisualizerExample = {
  id: 'recursive-call-stack',
  title: 'Recursive Call Stack',
  description: 'Shows how recursion fills up the call stack with multiple frames',
  category: 'call-stack-basics',
  code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(4));`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script starts executing. main() is pushed onto the call stack.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log', label: 'console.log(...)', color: '#22c55e' } }],
      description: 'Line 6: console.log is called, but first it needs to evaluate factorial(4).',
      highlightLines: [6],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'factorial-4', label: 'factorial(4)', color: '#3b82f6' } }],
      description: 'factorial(4) is called. n=4, which is > 1, so it calls factorial(3). The stack grows.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'factorial-3', label: 'factorial(3)', color: '#3b82f6' } }],
      description: 'factorial(3) is called. n=3, which is > 1, so it calls factorial(2). Each recursive call adds a frame.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'factorial-2', label: 'factorial(2)', color: '#3b82f6' } }],
      description: 'factorial(2) is called. n=2, which is > 1, so it calls factorial(1).',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'factorial-1', label: 'factorial(1)', color: '#3b82f6' } }],
      description: 'factorial(1) is called. n=1, which is <= 1, so it returns 1. This is the base case! The stack is at its deepest (6 frames).',
      highlightLines: [2],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'factorial-1', label: 'factorial(1)' } }],
      description: 'factorial(1) returns 1. Now the stack starts unwinding.',
      highlightLines: [2],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'factorial-2', label: 'factorial(2)' } }],
      description: 'factorial(2) computes 2 * 1 = 2 and returns 2.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'factorial-3', label: 'factorial(3)' } }],
      description: 'factorial(3) computes 3 * 2 = 6 and returns 6.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'factorial-4', label: 'factorial(4)' } }],
      description: 'factorial(4) computes 4 * 6 = 24 and returns 24. All recursive calls are now resolved.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-1', label: '24' } }],
      description: 'console.log receives 24 from factorial(4) and prints it to the console.',
      highlightLines: [6],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log', label: 'console.log(...)' } }],
      description: 'console.log finishes and is popped off the stack.',
      highlightLines: [6],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'Script is done. main() is popped. The call stack is empty.',
      highlightLines: [],
    },
  ],
};

// ============================================================================
// Category 2: setTimeout & Task Queue
// ============================================================================

const setTimeoutBasics: VisualizerExample = {
  id: 'settimeout-basics',
  title: 'setTimeout Basics',
  description: 'The classic event loop example: setTimeout defers execution via Web APIs and the Task Queue',
  category: 'settimeout-task-queue',
  code: `console.log('Start');

setTimeout(function timer() {
  console.log('Timer done');
}, 1000);

console.log('End');`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script begins execution. main() is pushed onto the call stack.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-start', label: "console.log('Start')", color: '#22c55e' } }],
      description: "Line 1: console.log('Start') is called and pushed onto the stack.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-start', label: 'Start' } }],
      description: "'Start' is printed to the console. Synchronous code runs immediately.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-start', label: "console.log('Start')" } }],
      description: 'console.log finishes and is popped off the stack.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'settimeout-1', label: 'setTimeout(timer, 1000)', color: '#f59e0b' } }],
      description: 'Line 3: setTimeout is called. This is a Web API, not part of the JS engine itself.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'WEB_API_ADD', payload: { id: 'timer-1', label: 'timer', detail: '1000ms', color: '#f59e0b' } }],
      description: 'setTimeout registers the timer callback with the Web API environment. The browser will track the 1000ms countdown.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'settimeout-1', label: 'setTimeout(timer, 1000)' } }],
      description: 'setTimeout itself returns immediately and is popped. JS does NOT wait for the timer! It continues executing.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-end', label: "console.log('End')", color: '#22c55e' } }],
      description: "Line 7: console.log('End') is called while the timer is still counting down in the background.",
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-end', label: 'End' } }],
      description: "'End' is printed. Notice: 'End' appears BEFORE 'Timer done' even though setTimeout was called first!",
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-end', label: "console.log('End')" } }],
      description: 'console.log finishes and is popped.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'All synchronous code is done. main() is popped. The call stack is empty, but the timer is still running in the Web API.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'WEB_API_REMOVE', payload: { id: 'timer-1', label: 'timer' } }],
      description: 'After 1000ms, the Web API timer completes. The callback needs to get back to JavaScript.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'TASK_QUEUE_ADD', payload: { id: 'timer-cb-1', label: 'timer()', color: '#f59e0b' } }],
      description: 'The timer callback is moved to the Task Queue (aka Callback Queue / Macrotask Queue). It waits here for the event loop.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-1', label: 'Event Loop Tick' } }],
      description: 'The Event Loop checks: Is the call stack empty? YES. Is there a task in the queue? YES. It moves the callback to the stack.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'TASK_QUEUE_REMOVE', payload: { id: 'timer-cb-1', label: 'timer()' } }],
      description: 'The timer callback is removed from the Task Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'timer-fn', label: 'timer()', color: '#f59e0b' } }],
      description: 'The timer callback is pushed onto the call stack and begins executing.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-timer', label: "console.log('Timer done')", color: '#22c55e' } }],
      description: "Inside the timer callback, console.log('Timer done') is called.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-timer', label: 'Timer done' } }],
      description: "'Timer done' is finally printed. Output order: Start → End → Timer done.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-timer', label: "console.log('Timer done')" } }],
      description: 'console.log finishes and is popped.',
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'timer-fn', label: 'timer()' } }],
      description: 'The timer callback finishes and is popped. The call stack is empty again. Program complete!',
      highlightLines: [],
    },
  ],
};

const setTimeoutZero: VisualizerExample = {
  id: 'settimeout-zero',
  title: 'setTimeout(0)',
  description: 'Even with 0ms delay, setTimeout callback goes through Web API → Task Queue → Event Loop',
  category: 'settimeout-task-queue',
  code: `console.log('First');

setTimeout(function callback() {
  console.log('Third');
}, 0);

console.log('Second');`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script starts. main() is pushed onto the call stack.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-first', label: "console.log('First')", color: '#22c55e' } }],
      description: "console.log('First') is pushed onto the call stack.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-first', label: 'First' } }],
      description: "'First' is printed to the console.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-first', label: "console.log('First')" } }],
      description: 'console.log is popped off the stack.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'settimeout-1', label: 'setTimeout(callback, 0)', color: '#f59e0b' } }],
      description: 'setTimeout is called with 0ms delay. Key insight: 0ms does NOT mean "run immediately"!',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'WEB_API_ADD', payload: { id: 'timer-1', label: 'callback', detail: '0ms', color: '#f59e0b' } }],
      description: 'Even with 0ms, the callback is sent to the Web API. The timer completes almost instantly, but the callback still must go through the queue.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'settimeout-1', label: 'setTimeout(callback, 0)' } }],
      description: 'setTimeout returns and is popped. JavaScript continues to the next line.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-second', label: "console.log('Second')", color: '#22c55e' } }],
      description: "console.log('Second') is called BEFORE the setTimeout callback, even though the timer was 0ms!",
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-second', label: 'Second' } }],
      description: "'Second' is printed. The call stack must be empty before any queued callbacks can run.",
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-second', label: "console.log('Second')" } }],
      description: 'console.log is popped off the stack.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'main() finishes and is popped. The call stack is now empty.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'WEB_API_REMOVE', payload: { id: 'timer-1', label: 'callback' } }],
      description: 'The 0ms timer has already completed. The Web API moves the callback out.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'TASK_QUEUE_ADD', payload: { id: 'timer-cb-1', label: 'callback()', color: '#f59e0b' } }],
      description: 'The callback is placed in the Task Queue, waiting for the event loop.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-1', label: 'Event Loop Tick' } }],
      description: 'Event Loop checks: Stack empty? YES. Task in queue? YES. Time to execute the callback!',
      highlightLines: [],
    },
    {
      actions: [{ type: 'TASK_QUEUE_REMOVE', payload: { id: 'timer-cb-1', label: 'callback()' } }],
      description: 'callback is dequeued from the Task Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'callback-fn', label: 'callback()', color: '#f59e0b' } }],
      description: 'callback() is pushed onto the call stack.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-third', label: "console.log('Third')", color: '#22c55e' } }],
      description: "Inside callback, console.log('Third') is called.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-third', label: 'Third' } }],
      description: "'Third' is printed LAST. Output: First → Second → Third. setTimeout(0) guarantees deferred execution, not immediate!",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-third', label: "console.log('Third')" } }],
      description: 'console.log is popped.',
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'callback-fn', label: 'callback()' } }],
      description: 'callback() finishes and is popped. Stack is empty. Program complete!',
      highlightLines: [],
    },
  ],
};

const multipleTimers: VisualizerExample = {
  id: 'multiple-timers',
  title: 'Multiple Timers',
  description: 'Multiple setTimeout calls: shorter delays finish first in the Web API, so their callbacks enter the queue first',
  category: 'settimeout-task-queue',
  code: `console.log('Start');

setTimeout(function slow() {
  console.log('Slow timer');
}, 2000);

setTimeout(function fast() {
  console.log('Fast timer');
}, 500);

console.log('End');`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script begins. main() is pushed onto the call stack.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-start', label: "console.log('Start')", color: '#22c55e' } }],
      description: "console.log('Start') is pushed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-start', label: 'Start' } }],
      description: "'Start' is printed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-start', label: "console.log('Start')" } }],
      description: 'console.log is popped.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'settimeout-slow', label: 'setTimeout(slow, 2000)', color: '#f59e0b' } }],
      description: 'First setTimeout: registers slow() with 2000ms delay.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'WEB_API_ADD', payload: { id: 'timer-slow', label: 'slow', detail: '2000ms', color: '#f59e0b' } }],
      description: 'slow timer is registered in the Web API. It will take 2 seconds to complete.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'settimeout-slow', label: 'setTimeout(slow, 2000)' } }],
      description: 'setTimeout returns and is popped.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'settimeout-fast', label: 'setTimeout(fast, 500)', color: '#f59e0b' } }],
      description: 'Second setTimeout: registers fast() with only 500ms delay.',
      highlightLines: [7, 8, 9],
    },
    {
      actions: [{ type: 'WEB_API_ADD', payload: { id: 'timer-fast', label: 'fast', detail: '500ms', color: '#f59e0b' } }],
      description: 'fast timer is registered. Now both timers are counting down in parallel in the Web API.',
      highlightLines: [7, 8, 9],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'settimeout-fast', label: 'setTimeout(fast, 500)' } }],
      description: 'setTimeout returns and is popped.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-end', label: "console.log('End')", color: '#22c55e' } }],
      description: "console.log('End') is called.",
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-end', label: 'End' } }],
      description: "'End' is printed.",
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-end', label: "console.log('End')" } }],
      description: 'console.log is popped.',
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'All synchronous code done. main() is popped. Both timers are still ticking in the Web API.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'WEB_API_REMOVE', payload: { id: 'timer-fast', label: 'fast' } }],
      description: 'After 500ms, the fast timer completes FIRST (even though slow was registered first).',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'TASK_QUEUE_ADD', payload: { id: 'fast-cb', label: 'fast()', color: '#f59e0b' } }],
      description: 'fast() callback is moved to the Task Queue.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-1', label: 'Event Loop Tick' } }],
      description: 'Event Loop: Stack is empty, picks fast() from the Task Queue.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'TASK_QUEUE_REMOVE', payload: { id: 'fast-cb', label: 'fast()' } }],
      description: 'fast() is dequeued.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'fast-fn', label: 'fast()', color: '#f59e0b' } }],
      description: 'fast() is pushed onto the call stack and executes.',
      highlightLines: [7, 8, 9],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-fast', label: "console.log('Fast timer')", color: '#22c55e' } }],
      description: "Inside fast(), console.log('Fast timer') is called.",
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-fast', label: 'Fast timer' } }],
      description: "'Fast timer' is printed.",
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-fast', label: "console.log('Fast timer')" } }],
      description: 'console.log is popped.',
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'fast-fn', label: 'fast()' } }],
      description: 'fast() finishes and is popped.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'WEB_API_REMOVE', payload: { id: 'timer-slow', label: 'slow' } }],
      description: 'After 2000ms, the slow timer finally completes.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'TASK_QUEUE_ADD', payload: { id: 'slow-cb', label: 'slow()', color: '#f59e0b' } }],
      description: 'slow() callback is moved to the Task Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-2', label: 'Event Loop Tick' } }],
      description: 'Event Loop: Stack is empty, picks slow() from the Task Queue.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'TASK_QUEUE_REMOVE', payload: { id: 'slow-cb', label: 'slow()' } }],
      description: 'slow() is dequeued.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'slow-fn', label: 'slow()', color: '#f59e0b' } }],
      description: 'slow() is pushed onto the call stack.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-slow', label: "console.log('Slow timer')", color: '#22c55e' } }],
      description: "console.log('Slow timer') is called.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-slow', label: 'Slow timer' } }],
      description: "'Slow timer' is printed. Final output: Start → End → Fast timer → Slow timer.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-slow', label: "console.log('Slow timer')" } }],
      description: 'console.log is popped.',
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'slow-fn', label: 'slow()' } }],
      description: 'slow() finishes and is popped. All timers processed. Program complete!',
      highlightLines: [],
    },
  ],
};

// ============================================================================
// Category 3: Promises & Microtasks
// ============================================================================

const promiseBasics: VisualizerExample = {
  id: 'promise-basics',
  title: 'Promise Basics',
  description: 'Promise.then() callbacks go to the Microtask Queue, not the Task Queue',
  category: 'promises-microtasks',
  code: `console.log('Start');

Promise.resolve().then(function promiseCb() {
  console.log('Promise');
});

console.log('End');`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script begins. main() is pushed.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-start', label: "console.log('Start')", color: '#22c55e' } }],
      description: "console.log('Start') is pushed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-start', label: 'Start' } }],
      description: "'Start' is printed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-start', label: "console.log('Start')" } }],
      description: 'console.log is popped.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'promise-resolve', label: 'Promise.resolve().then(...)', color: '#8b5cf6' } }],
      description: 'Promise.resolve() creates an already-resolved promise. .then() schedules the callback.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_ADD', payload: { id: 'promise-cb-1', label: 'promiseCb()', color: '#8b5cf6' } }],
      description: 'The promise is already resolved, so promiseCb is immediately placed in the MICROTASK Queue (not the Task Queue!). This is a key difference from setTimeout.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'promise-resolve', label: 'Promise.resolve().then(...)' } }],
      description: 'The .then() registration is popped. The callback is queued but NOT executed yet.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-end', label: "console.log('End')", color: '#22c55e' } }],
      description: "console.log('End') runs. Synchronous code always finishes before microtasks!",
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-end', label: 'End' } }],
      description: "'End' is printed.",
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-end', label: "console.log('End')" } }],
      description: 'console.log is popped.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'main() finishes. Stack is empty. Now the event loop checks the MICROTASK queue before checking the Task Queue.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-1', label: 'Event Loop Tick (Microtasks)' } }],
      description: 'Event Loop: Stack is empty → Check microtask queue FIRST (before task queue). Found promiseCb!',
      highlightLines: [],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_REMOVE', payload: { id: 'promise-cb-1', label: 'promiseCb()' } }],
      description: 'promiseCb is dequeued from the Microtask Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'promise-cb-fn', label: 'promiseCb()', color: '#8b5cf6' } }],
      description: 'promiseCb() is pushed onto the call stack.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-promise', label: "console.log('Promise')", color: '#22c55e' } }],
      description: "console.log('Promise') is called inside the microtask callback.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-promise', label: 'Promise' } }],
      description: "'Promise' is printed. Final output: Start → End → Promise.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-promise', label: "console.log('Promise')" } }],
      description: 'console.log is popped.',
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'promise-cb-fn', label: 'promiseCb()' } }],
      description: 'promiseCb() finishes and is popped. Program complete!',
      highlightLines: [],
    },
  ],
};

const microtaskVsMacrotask: VisualizerExample = {
  id: 'microtask-vs-macrotask',
  title: 'Microtask vs Macrotask Priority',
  description: 'THE key insight: microtasks (Promises) always run before macrotasks (setTimeout), even if setTimeout was registered first',
  category: 'promises-microtasks',
  code: `console.log('Start');

setTimeout(function timeout() {
  console.log('Timeout');
}, 0);

Promise.resolve().then(function promise() {
  console.log('Promise');
});

console.log('End');`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script starts. main() is pushed onto the call stack.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-start', label: "console.log('Start')", color: '#22c55e' } }],
      description: "console.log('Start') is pushed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-start', label: 'Start' } }],
      description: "'Start' is printed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-start', label: "console.log('Start')" } }],
      description: 'console.log is popped.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'settimeout-1', label: 'setTimeout(timeout, 0)', color: '#f59e0b' } }],
      description: 'setTimeout is called with 0ms. The callback will go to the TASK Queue (macrotask).',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'WEB_API_ADD', payload: { id: 'timer-1', label: 'timeout', detail: '0ms', color: '#f59e0b' } }],
      description: 'timeout callback is registered with the Web API.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'settimeout-1', label: 'setTimeout(timeout, 0)' } }],
      description: 'setTimeout returns and is popped.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'promise-then', label: 'Promise.resolve().then(...)', color: '#8b5cf6' } }],
      description: 'Promise.resolve().then() is called. The promise callback goes to the MICROTASK Queue.',
      highlightLines: [7, 8, 9],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_ADD', payload: { id: 'promise-cb-1', label: 'promise()', color: '#8b5cf6' } }],
      description: 'promise() is added to the Microtask Queue. This is crucial: it goes to a DIFFERENT queue than setTimeout!',
      highlightLines: [7, 8, 9],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'promise-then', label: 'Promise.resolve().then(...)' } }],
      description: '.then() registration is popped.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-end', label: "console.log('End')", color: '#22c55e' } }],
      description: "console.log('End') is called.",
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-end', label: 'End' } }],
      description: "'End' is printed.",
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-end', label: "console.log('End')" } }],
      description: 'console.log is popped.',
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'main() is done. Stack is empty. Now the event loop kicks in. It checks microtasks FIRST!',
      highlightLines: [],
    },
    {
      actions: [{ type: 'WEB_API_REMOVE', payload: { id: 'timer-1', label: 'timeout' } }],
      description: 'The 0ms timer has completed. timeout() callback moves to Task Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'TASK_QUEUE_ADD', payload: { id: 'timeout-cb', label: 'timeout()', color: '#f59e0b' } }],
      description: 'timeout() is in the Task Queue. But the event loop checks microtasks first!',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-1', label: 'Event Loop Tick (Microtasks First!)' } }],
      description: 'Event Loop: Stack empty → Check Microtask Queue FIRST → Found promise()! Microtasks have PRIORITY over macrotasks.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_REMOVE', payload: { id: 'promise-cb-1', label: 'promise()' } }],
      description: 'promise() is dequeued from the Microtask Queue.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'promise-fn', label: 'promise()', color: '#8b5cf6' } }],
      description: 'promise() is pushed onto the call stack. It runs BEFORE timeout() even though setTimeout was called first!',
      highlightLines: [7, 8, 9],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-promise', label: "console.log('Promise')", color: '#22c55e' } }],
      description: "console.log('Promise') is called.",
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-promise', label: 'Promise' } }],
      description: "'Promise' is printed BEFORE 'Timeout'. This is the key insight!",
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-promise', label: "console.log('Promise')" } }],
      description: 'console.log is popped.',
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'promise-fn', label: 'promise()' } }],
      description: 'promise() finishes. Now the microtask queue is empty, so the event loop checks the Task Queue.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-2', label: 'Event Loop Tick (Task Queue)' } }],
      description: 'Event Loop: Microtask queue empty → Check Task Queue → Found timeout()!',
      highlightLines: [],
    },
    {
      actions: [{ type: 'TASK_QUEUE_REMOVE', payload: { id: 'timeout-cb', label: 'timeout()' } }],
      description: 'timeout() is dequeued from the Task Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'timeout-fn', label: 'timeout()', color: '#f59e0b' } }],
      description: 'timeout() is pushed onto the call stack.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-timeout', label: "console.log('Timeout')", color: '#22c55e' } }],
      description: "console.log('Timeout') is called.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-timeout', label: 'Timeout' } }],
      description: "'Timeout' is printed LAST. Final output: Start → End → Promise → Timeout. Microtasks always beat macrotasks!",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-timeout', label: "console.log('Timeout')" } }],
      description: 'console.log is popped.',
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'timeout-fn', label: 'timeout()' } }],
      description: 'timeout() finishes. Program complete! Remember: Microtasks > Macrotasks in priority.',
      highlightLines: [],
    },
  ],
};

const promiseChain: VisualizerExample = {
  id: 'promise-chain',
  title: 'Promise Chain',
  description: 'Chained .then() callbacks: each .then() creates a new microtask only after the previous one resolves',
  category: 'promises-microtasks',
  code: `console.log('Start');

Promise.resolve()
  .then(function first() {
    console.log('First then');
  })
  .then(function second() {
    console.log('Second then');
  });

console.log('End');`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script starts. main() is pushed.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-start', label: "console.log('Start')", color: '#22c55e' } }],
      description: "console.log('Start') is pushed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-start', label: 'Start' } }],
      description: "'Start' is printed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-start', label: "console.log('Start')" } }],
      description: 'console.log is popped.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'promise-chain-setup', label: 'Promise.resolve().then().then()', color: '#8b5cf6' } }],
      description: 'The promise chain is set up. Only the FIRST .then() callback is queued immediately since the promise is already resolved.',
      highlightLines: [3, 4, 5, 6, 7, 8, 9],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_ADD', payload: { id: 'first-then', label: 'first()', color: '#8b5cf6' } }],
      description: 'first() is added to the Microtask Queue. The second .then() will only be queued AFTER first() completes and returns.',
      highlightLines: [4, 5, 6],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'promise-chain-setup', label: 'Promise.resolve().then().then()' } }],
      description: 'Promise chain setup is done and popped.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-end', label: "console.log('End')", color: '#22c55e' } }],
      description: "console.log('End') runs synchronously.",
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-end', label: 'End' } }],
      description: "'End' is printed.",
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-end', label: "console.log('End')" } }],
      description: 'console.log is popped.',
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'main() is done. Stack is empty. Event loop processes microtasks.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-1', label: 'Event Loop Tick (Microtasks)' } }],
      description: 'Event Loop: Stack empty → Microtask Queue has first(). Dequeue and execute it.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_REMOVE', payload: { id: 'first-then', label: 'first()' } }],
      description: 'first() is dequeued from the Microtask Queue.',
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'first-fn', label: 'first()', color: '#8b5cf6' } }],
      description: 'first() is pushed onto the call stack.',
      highlightLines: [4, 5, 6],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-first', label: "console.log('First then')", color: '#22c55e' } }],
      description: "console.log('First then') is called.",
      highlightLines: [5],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-first', label: 'First then' } }],
      description: "'First then' is printed.",
      highlightLines: [5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-first', label: "console.log('First then')" } }],
      description: 'console.log is popped.',
      highlightLines: [5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'first-fn', label: 'first()' } }],
      description: 'first() returns (resolving its promise). NOW the second .then() callback gets queued as a microtask.',
      highlightLines: [6],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_ADD', payload: { id: 'second-then', label: 'second()', color: '#8b5cf6' } }],
      description: 'second() is added to the Microtask Queue. Chained .then() callbacks are queued sequentially, not all at once.',
      highlightLines: [7, 8, 9],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-2', label: 'Event Loop Tick (Microtasks)' } }],
      description: 'Event Loop continues draining microtasks. Found second()!',
      highlightLines: [],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_REMOVE', payload: { id: 'second-then', label: 'second()' } }],
      description: 'second() is dequeued.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'second-fn', label: 'second()', color: '#8b5cf6' } }],
      description: 'second() is pushed onto the call stack.',
      highlightLines: [7, 8, 9],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-second', label: "console.log('Second then')", color: '#22c55e' } }],
      description: "console.log('Second then') is called.",
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-second', label: 'Second then' } }],
      description: "'Second then' is printed. Output: Start → End → First then → Second then.",
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-second', label: "console.log('Second then')" } }],
      description: 'console.log is popped.',
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'second-fn', label: 'second()' } }],
      description: 'second() finishes. All microtasks drained. Program complete!',
      highlightLines: [],
    },
  ],
};

// ============================================================================
// Category 4: Advanced Patterns
// ============================================================================

const mixedAsync: VisualizerExample = {
  id: 'mixed-async',
  title: 'Mixed Async',
  description: 'Complex interleaving of setTimeout and Promise.then — tests your understanding of the full event loop',
  category: 'advanced-patterns',
  code: `console.log('Script start');

setTimeout(function timeout() {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(function promise1() {
    console.log('promise1');
  })
  .then(function promise2() {
    console.log('promise2');
  });

console.log('Script end');`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script starts. main() is pushed.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-start', label: "console.log('Script start')", color: '#22c55e' } }],
      description: "console.log('Script start') is pushed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-start', label: 'Script start' } }],
      description: "'Script start' is printed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-start', label: "console.log('Script start')" } }],
      description: 'console.log is popped.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'settimeout-1', label: 'setTimeout(timeout, 0)', color: '#f59e0b' } }],
      description: 'setTimeout registers timeout() with 0ms delay. Goes to Web API → Task Queue path.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'WEB_API_ADD', payload: { id: 'timer-1', label: 'timeout', detail: '0ms', color: '#f59e0b' } }],
      description: 'timeout callback sent to Web API.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'settimeout-1', label: 'setTimeout(timeout, 0)' } }],
      description: 'setTimeout is popped.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'promise-chain', label: 'Promise.resolve().then().then()', color: '#8b5cf6' } }],
      description: 'Promise chain is set up. First .then() callback is immediately queued as microtask.',
      highlightLines: [7, 8, 9, 10, 11, 12, 13],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_ADD', payload: { id: 'promise1-cb', label: 'promise1()', color: '#8b5cf6' } }],
      description: 'promise1() is added to the Microtask Queue.',
      highlightLines: [8, 9, 10],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'promise-chain', label: 'Promise.resolve().then().then()' } }],
      description: 'Promise chain setup is popped.',
      highlightLines: [7],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-end', label: "console.log('Script end')", color: '#22c55e' } }],
      description: "console.log('Script end') is called.",
      highlightLines: [15],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-end', label: 'Script end' } }],
      description: "'Script end' is printed. All synchronous code is done.",
      highlightLines: [15],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-end', label: "console.log('Script end')" } }],
      description: 'console.log is popped.',
      highlightLines: [15],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'main() is done. Stack is empty. Both queues have items: Microtask has promise1(), Task Queue is about to get timeout().',
      highlightLines: [],
    },
    {
      actions: [{ type: 'WEB_API_REMOVE', payload: { id: 'timer-1', label: 'timeout' } }],
      description: '0ms timer completes. timeout() moves to Task Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'TASK_QUEUE_ADD', payload: { id: 'timeout-cb', label: 'timeout()', color: '#f59e0b' } }],
      description: 'timeout() is in Task Queue. But microtasks run first!',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-1', label: 'Event Loop: Microtasks First' } }],
      description: 'Event Loop priority: Drain ALL microtasks before processing any macrotask.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_REMOVE', payload: { id: 'promise1-cb', label: 'promise1()' } }],
      description: 'promise1() is dequeued.',
      highlightLines: [8],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'promise1-fn', label: 'promise1()', color: '#8b5cf6' } }],
      description: 'promise1() runs. timeout() still waits in the Task Queue.',
      highlightLines: [8, 9, 10],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-p1', label: "console.log('promise1')", color: '#22c55e' } }],
      description: "console.log('promise1') is called.",
      highlightLines: [9],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-p1', label: 'promise1' } }],
      description: "'promise1' is printed.",
      highlightLines: [9],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-p1', label: "console.log('promise1')" } }],
      description: 'console.log is popped.',
      highlightLines: [9],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'promise1-fn', label: 'promise1()' } }],
      description: 'promise1() returns, resolving its promise. This triggers the next .then() in the chain.',
      highlightLines: [10],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_ADD', payload: { id: 'promise2-cb', label: 'promise2()', color: '#8b5cf6' } }],
      description: 'promise2() is added to the Microtask Queue. The event loop will process this BEFORE the Task Queue timeout()!',
      highlightLines: [11, 12, 13],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-2', label: 'Event Loop: Still Draining Microtasks' } }],
      description: 'Event Loop: Microtask queue is NOT empty yet (has promise2). Continue draining microtasks before touching Task Queue.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'MICROTASK_QUEUE_REMOVE', payload: { id: 'promise2-cb', label: 'promise2()' } }],
      description: 'promise2() is dequeued.',
      highlightLines: [11],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'promise2-fn', label: 'promise2()', color: '#8b5cf6' } }],
      description: 'promise2() runs. timeout() STILL waits.',
      highlightLines: [11, 12, 13],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-p2', label: "console.log('promise2')", color: '#22c55e' } }],
      description: "console.log('promise2') is called.",
      highlightLines: [12],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-p2', label: 'promise2' } }],
      description: "'promise2' is printed. Both microtasks ran before the macrotask.",
      highlightLines: [12],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-p2', label: "console.log('promise2')" } }],
      description: 'console.log is popped.',
      highlightLines: [12],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'promise2-fn', label: 'promise2()' } }],
      description: 'promise2() finishes. Microtask queue is now empty. NOW the event loop checks the Task Queue.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-3', label: 'Event Loop: Task Queue' } }],
      description: 'Event Loop: Microtask queue empty → Now check Task Queue → Found timeout()!',
      highlightLines: [],
    },
    {
      actions: [{ type: 'TASK_QUEUE_REMOVE', payload: { id: 'timeout-cb', label: 'timeout()' } }],
      description: 'timeout() is dequeued from the Task Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'timeout-fn', label: 'timeout()', color: '#f59e0b' } }],
      description: 'timeout() finally gets to run.',
      highlightLines: [3, 4, 5],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-timeout', label: "console.log('setTimeout')", color: '#22c55e' } }],
      description: "console.log('setTimeout') is called.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-timeout', label: 'setTimeout' } }],
      description: "'setTimeout' is printed LAST. Final: Script start → Script end → promise1 → promise2 → setTimeout.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-timeout', label: "console.log('setTimeout')" } }],
      description: 'console.log is popped.',
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'timeout-fn', label: 'timeout()' } }],
      description: 'timeout() finishes. All queues empty. Program complete!',
      highlightLines: [],
    },
  ],
};

const nestedSetTimeout: VisualizerExample = {
  id: 'nested-settimeout',
  title: 'Nested setTimeout',
  description: 'setTimeout inside setTimeout: the inner timer is only registered when the outer callback runs',
  category: 'advanced-patterns',
  code: `console.log('Start');

setTimeout(function outer() {
  console.log('Outer timeout');
  setTimeout(function inner() {
    console.log('Inner timeout');
  }, 0);
}, 0);

console.log('End');`,
  steps: [
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'main', label: 'main()', color: '#3b82f6' } }],
      description: 'Script starts. main() is pushed.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-start', label: "console.log('Start')", color: '#22c55e' } }],
      description: "console.log('Start') is pushed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-start', label: 'Start' } }],
      description: "'Start' is printed.",
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-start', label: "console.log('Start')" } }],
      description: 'console.log is popped.',
      highlightLines: [1],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'settimeout-outer', label: 'setTimeout(outer, 0)', color: '#f59e0b' } }],
      description: 'setTimeout registers outer() with 0ms delay.',
      highlightLines: [3, 4, 5, 6, 7, 8],
    },
    {
      actions: [{ type: 'WEB_API_ADD', payload: { id: 'timer-outer', label: 'outer', detail: '0ms', color: '#f59e0b' } }],
      description: 'outer callback sent to Web API. The inner setTimeout inside it has NOT been seen yet!',
      highlightLines: [3, 4, 5, 6, 7, 8],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'settimeout-outer', label: 'setTimeout(outer, 0)' } }],
      description: 'setTimeout is popped.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-end', label: "console.log('End')", color: '#22c55e' } }],
      description: "console.log('End') is called.",
      highlightLines: [10],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-end', label: 'End' } }],
      description: "'End' is printed.",
      highlightLines: [10],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-end', label: "console.log('End')" } }],
      description: 'console.log is popped.',
      highlightLines: [10],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'main', label: 'main()' } }],
      description: 'main() finishes. Stack empty.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'WEB_API_REMOVE', payload: { id: 'timer-outer', label: 'outer' } }],
      description: 'outer timer completes.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'TASK_QUEUE_ADD', payload: { id: 'outer-cb', label: 'outer()', color: '#f59e0b' } }],
      description: 'outer() is placed in the Task Queue.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-1', label: 'Event Loop Tick' } }],
      description: 'Event Loop: Stack empty, picks outer() from Task Queue.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'TASK_QUEUE_REMOVE', payload: { id: 'outer-cb', label: 'outer()' } }],
      description: 'outer() is dequeued.',
      highlightLines: [3],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'outer-fn', label: 'outer()', color: '#f59e0b' } }],
      description: 'outer() is pushed and starts executing.',
      highlightLines: [3, 4, 5, 6, 7, 8],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-outer', label: "console.log('Outer timeout')", color: '#22c55e' } }],
      description: "console.log('Outer timeout') is called.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-outer', label: 'Outer timeout' } }],
      description: "'Outer timeout' is printed.",
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-outer', label: "console.log('Outer timeout')" } }],
      description: 'console.log is popped.',
      highlightLines: [4],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'settimeout-inner', label: 'setTimeout(inner, 0)', color: '#f59e0b' } }],
      description: 'NOW the inner setTimeout is encountered for the first time! It registers inner() with the Web API.',
      highlightLines: [5, 6, 7],
    },
    {
      actions: [{ type: 'WEB_API_ADD', payload: { id: 'timer-inner', label: 'inner', detail: '0ms', color: '#f59e0b' } }],
      description: 'inner callback is registered with Web API. It will complete quickly but still must go through the queue.',
      highlightLines: [5, 6, 7],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'settimeout-inner', label: 'setTimeout(inner, 0)' } }],
      description: 'setTimeout is popped.',
      highlightLines: [5],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'outer-fn', label: 'outer()' } }],
      description: 'outer() finishes and is popped. Stack is empty again.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'WEB_API_REMOVE', payload: { id: 'timer-inner', label: 'inner' } }],
      description: 'inner timer completes (0ms).',
      highlightLines: [5],
    },
    {
      actions: [{ type: 'TASK_QUEUE_ADD', payload: { id: 'inner-cb', label: 'inner()', color: '#f59e0b' } }],
      description: 'inner() is placed in the Task Queue.',
      highlightLines: [5],
    },
    {
      actions: [{ type: 'EVENT_LOOP_TICK', payload: { id: 'tick-2', label: 'Event Loop Tick' } }],
      description: 'Event Loop: Stack empty, picks inner() from Task Queue.',
      highlightLines: [],
    },
    {
      actions: [{ type: 'TASK_QUEUE_REMOVE', payload: { id: 'inner-cb', label: 'inner()' } }],
      description: 'inner() is dequeued.',
      highlightLines: [5],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'inner-fn', label: 'inner()', color: '#f59e0b' } }],
      description: 'inner() is pushed onto the call stack.',
      highlightLines: [5, 6, 7],
    },
    {
      actions: [{ type: 'CALL_STACK_PUSH', payload: { id: 'console-log-inner', label: "console.log('Inner timeout')", color: '#22c55e' } }],
      description: "console.log('Inner timeout') is called.",
      highlightLines: [6],
    },
    {
      actions: [{ type: 'CONSOLE_LOG', payload: { id: 'log-inner', label: 'Inner timeout' } }],
      description: "'Inner timeout' is printed. Final output: Start → End → Outer timeout → Inner timeout.",
      highlightLines: [6],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'console-log-inner', label: "console.log('Inner timeout')" } }],
      description: 'console.log is popped.',
      highlightLines: [6],
    },
    {
      actions: [{ type: 'CALL_STACK_POP', payload: { id: 'inner-fn', label: 'inner()' } }],
      description: 'inner() finishes. All done! Nested timeouts execute sequentially, each going through the full event loop cycle.',
      highlightLines: [],
    },
  ],
};

// ============================================================================
// Assemble Categories & Exports
// ============================================================================

export const categories: Category[] = [
  {
    id: 'call-stack-basics',
    name: 'Call Stack Basics',
    icon: 'BookOpen',
    examples: [simpleFunctionCalls, recursiveCallStack],
  },
  {
    id: 'settimeout-task-queue',
    name: 'setTimeout & Task Queue',
    icon: 'Clock',
    examples: [setTimeoutBasics, setTimeoutZero, multipleTimers],
  },
  {
    id: 'promises-microtasks',
    name: 'Promises & Microtasks',
    icon: 'Sparkles',
    examples: [promiseBasics, microtaskVsMacrotask, promiseChain],
  },
  {
    id: 'advanced-patterns',
    name: 'Advanced Patterns',
    icon: 'Network',
    examples: [mixedAsync, nestedSetTimeout],
  },
];

export const allExamples: VisualizerExample[] = categories.flatMap(
  (cat) => cat.examples
);
