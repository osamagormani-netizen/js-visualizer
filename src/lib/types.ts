export type ActionType =
  | 'CALL_STACK_PUSH'
  | 'CALL_STACK_POP'
  | 'WEB_API_ADD'
  | 'WEB_API_REMOVE'
  | 'TASK_QUEUE_ADD'
  | 'TASK_QUEUE_REMOVE'
  | 'MICROTASK_QUEUE_ADD'
  | 'MICROTASK_QUEUE_REMOVE'
  | 'CONSOLE_LOG'
  | 'EVENT_LOOP_TICK';

export interface Action {
  type: ActionType;
  payload: {
    id: string;
    label: string;
    detail?: string;
    color?: string; // for visual distinction
  };
}

export interface VisualizationStep {
  actions: Action[];
  description: string;
  highlightLines?: number[]; // lines to highlight in editor (1-based)
}

export interface StackItem {
  id: string;
  label: string;
  color?: string;
}

export interface WebAPIItem {
  id: string;
  label: string;
  detail?: string; // e.g. "timer: 1000ms"
  color?: string;
}

export interface QueueItem {
  id: string;
  label: string;
  color?: string;
}

export interface ConsoleItem {
  id: string;
  content: string;
  type: 'log' | 'error' | 'warn';
}

export interface VisualizerState {
  callStack: StackItem[];
  webAPIs: WebAPIItem[];
  taskQueue: QueueItem[];
  microtaskQueue: QueueItem[];
  consoleLogs: ConsoleItem[];
  currentStep: number;
  totalSteps: number;
  highlightLines: number[];
  description: string;
  eventLoopActive: boolean;
}

export interface VisualizerExample {
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
  steps: VisualizationStep[];
}

export interface ExampleCategory {
  id: string;
  name: string;
  examples: VisualizerExample[];
}
