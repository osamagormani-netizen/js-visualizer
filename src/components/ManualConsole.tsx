"use client";

import { Terminal, Trash2, AlertCircle } from "lucide-react";
import { type OutputLine } from "@/lib/executeCode";

interface ManualConsoleProps {
  output: OutputLine[];
  isRunning: boolean;
  executionTime: number | null;
  onClear: () => void;
}

export function ManualConsole({
  output,
  isRunning,
  executionTime,
  onClear,
}: ManualConsoleProps) {
  return (
    <div className="flex flex-col h-full rounded-lg border border-card-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-card border-b border-card-border">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-success" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Console Output
          </span>
          {output.length > 0 && (
            <span className="text-[10px] text-muted bg-card-border/50 px-1.5 py-0.5 rounded-full">
              {output.length}
            </span>
          )}
          {executionTime !== null && (
            <span className="text-[10px] text-muted">
              {executionTime.toFixed(1)}ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <div className="flex items-center gap-1.5 text-[10px] text-accent">
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Running...
            </div>
          )}
          <button
            onClick={onClear}
            className="p-1 rounded-md hover:bg-sidebar-hover transition-colors cursor-pointer"
            title="Clear console"
          >
            <Trash2 className="h-3 w-3 text-muted" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 bg-background font-mono text-xs space-y-0.5">
        {output.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted/50 gap-2">
            <Terminal className="h-6 w-6 opacity-30" />
            <p className="text-xs">Run code to see output here</p>
          </div>
        ) : (
          output.map((line) => (
            <div
              key={line.id}
              className={`animate-fade-in flex items-start gap-1.5 px-2 py-1 rounded ${
                line.type === "error"
                  ? "text-error bg-error/5"
                  : line.type === "warn"
                    ? "text-warning bg-warning/5"
                    : line.type === "info"
                      ? "text-accent"
                      : "text-foreground"
              }`}
            >
              {line.type === "error" && (
                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
              )}
              <pre className="whitespace-pre-wrap break-all leading-relaxed">
                {line.content}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
