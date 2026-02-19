import {
  VisualizationStep,
  VisualizerState,
  Action,
  StackItem,
  WebAPIItem,
  QueueItem,
  ConsoleItem,
} from '@/lib/types';

/**
 * Creates the initial empty visualizer state.
 */
export function createInitialState(steps: VisualizationStep[]): VisualizerState {
  return {
    callStack: [],
    webAPIs: [],
    taskQueue: [],
    microtaskQueue: [],
    consoleLogs: [],
    currentStep: -1,
    totalSteps: steps.length,
    highlightLines: [],
    description: '',
    eventLoopActive: false,
  };
}

/**
 * Applies a single action to the state, returning a new state.
 * This is the core reducer for individual actions within a step.
 */
function applyAction(state: VisualizerState, action: Action): VisualizerState {
  const { type, payload } = action;

  switch (type) {
    case 'CALL_STACK_PUSH': {
      const item: StackItem = {
        id: payload.id,
        label: payload.label,
        ...(payload.color && { color: payload.color }),
      };
      return { ...state, callStack: [...state.callStack, item] };
    }

    case 'CALL_STACK_POP': {
      return {
        ...state,
        callStack: state.callStack.filter((item) => item.id !== payload.id),
      };
    }

    case 'WEB_API_ADD': {
      const item: WebAPIItem = {
        id: payload.id,
        label: payload.label,
        ...(payload.detail && { detail: payload.detail }),
        ...(payload.color && { color: payload.color }),
      };
      return { ...state, webAPIs: [...state.webAPIs, item] };
    }

    case 'WEB_API_REMOVE': {
      return {
        ...state,
        webAPIs: state.webAPIs.filter((item) => item.id !== payload.id),
      };
    }

    case 'TASK_QUEUE_ADD': {
      const item: QueueItem = {
        id: payload.id,
        label: payload.label,
        ...(payload.color && { color: payload.color }),
      };
      return { ...state, taskQueue: [...state.taskQueue, item] };
    }

    case 'TASK_QUEUE_REMOVE': {
      const index = state.taskQueue.findIndex((item) => item.id === payload.id);
      if (index === -1) return state;
      return {
        ...state,
        taskQueue: [
          ...state.taskQueue.slice(0, index),
          ...state.taskQueue.slice(index + 1),
        ],
      };
    }

    case 'MICROTASK_QUEUE_ADD': {
      const item: QueueItem = {
        id: payload.id,
        label: payload.label,
        ...(payload.color && { color: payload.color }),
      };
      return { ...state, microtaskQueue: [...state.microtaskQueue, item] };
    }

    case 'MICROTASK_QUEUE_REMOVE': {
      const index = state.microtaskQueue.findIndex(
        (item) => item.id === payload.id
      );
      if (index === -1) return state;
      return {
        ...state,
        microtaskQueue: [
          ...state.microtaskQueue.slice(0, index),
          ...state.microtaskQueue.slice(index + 1),
        ],
      };
    }

    case 'CONSOLE_LOG': {
      const item: ConsoleItem = {
        id: payload.id,
        content: payload.label,
        type: (payload.detail as ConsoleItem['type']) || 'log',
      };
      return { ...state, consoleLogs: [...state.consoleLogs, item] };
    }

    case 'EVENT_LOOP_TICK': {
      return { ...state, eventLoopActive: true };
    }

    default: {
      // Exhaustive check: if we reach here, an action type was unhandled
      const _exhaustive: never = type;
      console.warn(`Unhandled action type: ${_exhaustive}`);
      return state;
    }
  }
}

/**
 * Applies all actions in a step to the current state, producing the next state.
 * Updates description and highlightLines from the step metadata.
 */
export function applyStep(
  state: VisualizerState,
  step: VisualizationStep
): VisualizerState {
  // Reset eventLoopActive before processing the step's actions
  let nextState: VisualizerState = { ...state, eventLoopActive: false };

  // Apply each action in order
  for (const action of step.actions) {
    nextState = applyAction(nextState, action);
  }

  // Update step metadata
  return {
    ...nextState,
    description: step.description,
    highlightLines: step.highlightLines ?? [],
  };
}

/**
 * Computes the full state at a given step index by replaying
 * all steps from 0 through targetStep.
 */
export function computeStateAtStep(
  steps: VisualizationStep[],
  targetStep: number
): VisualizerState {
  let state = createInitialState(steps);

  const end = Math.min(targetStep, steps.length - 1);
  for (let i = 0; i <= end; i++) {
    state = applyStep(state, steps[i]);
    state = { ...state, currentStep: i };
  }

  return state;
}
