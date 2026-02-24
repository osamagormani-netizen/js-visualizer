"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from "lucide-react";

interface ControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onStepForward: () => void;
  onStepBack: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export function Controls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onStepForward,
  onStepBack,
  onPlayPause,
  onReset,
  onSpeedChange,
}: ControlsProps) {
  const canStepBack = currentStep > -1;
  const canStepForward = currentStep < totalSteps - 1;
  const displayStep = currentStep + 1;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onReset}
        className="apple-button h-8 w-8 hover:bg-sidebar-active text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-default"
        disabled={currentStep === -1}
        title="Reset"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      <div className="flex items-center bg-sidebar/50 backdrop-blur-sm border border-card-border rounded-xl p-0.5">
        <button
          onClick={onStepBack}
          disabled={!canStepBack}
          className="apple-button h-7 px-2 hover:bg-white dark:hover:bg-card hover:shadow-sm text-foreground disabled:opacity-30 disabled:cursor-default"
          title="Step back"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        <button
          onClick={onPlayPause}
          disabled={!canStepForward && !isPlaying}
          className="apple-button h-7 px-3 hover:bg-white dark:hover:bg-card hover:shadow-sm text-foreground disabled:opacity-30 disabled:cursor-default border-x border-card-border/50 mx-0.5"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={onStepForward}
          disabled={!canStepForward}
          className="apple-button h-7 px-2 hover:bg-white dark:hover:bg-card hover:shadow-sm text-foreground disabled:opacity-30 disabled:cursor-default"
          title="Step forward"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      <span className="hidden xs:inline text-xs text-muted font-mono min-w-[60px] text-center">
        {displayStep > 0 ? displayStep : '–'} / {totalSteps}
      </span>

      <div className="flex items-center gap-1 ml-1">
        <span className="text-[10px] text-muted">Speed:</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="text-xs bg-card border border-card-border rounded px-1 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent/50"
        >
          <option value={2000}>0.5×</option>
          <option value={1000}>1×</option>
          <option value={600}>1.5×</option>
          <option value={400}>2×</option>
          <option value={200}>3×</option>
        </select>
      </div>
    </div>
  );
}
