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
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-sidebar/30 backdrop-blur-md border-b border-card-border">
        <div className="flex items-center gap-3">
          <Terminal className="h-3.5 w-3.5 text-success" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">
            Console Output
          </span>
          {output.length > 0 && (
            <span className="text-[9px] font-bold text-success/80 bg-success/10 px-1.5 py-0.5 rounded-full border border-success/20">
              {output.length}
            </span>
          )}
          {executionTime !== null && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sidebar/50 border border-card-border/30">
              <span className="text-[9px] font-bold text-muted tabular-nums">
                {executionTime.toFixed(1)}ms
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isRunning && (
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
              <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] font-bold text-accent uppercase tracking-wider">Running</span>
            </div>
          )}
          <button
            onClick={onClear}
            className="apple-button h-6 w-6 hover:bg-sidebar-active text-muted hover:text-foreground transition-all"
            title="Clear console"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-transparent font-mono text-[11px] leading-relaxed space-y-1.5 no-scrollbar">
        {output.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20 gap-3 pb-8">
            <Terminal className="h-8 w-8" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-center max-w-[120px]">Ready to execute code</p>
          </div>
        ) : (
          output.map((line) => (
            <div
              key={line.id}
              className={`animate-fade-in flex items-start gap-2 px-3 py-2 rounded-xl border shadow-sm transition-all hover:shadow-md ${line.type === "error"
                  ? "text-error bg-error/5 border-error/10"
                  : line.type === "warn"
                    ? "text-warning bg-warning/5 border-warning/10"
                    : line.type === "info"
                      ? "text-accent bg-accent/5 border-accent/10"
                      : "text-foreground bg-sidebar/20 border-card-border/30"
                }`}
            >
              <span className="text-muted/40 mt-0.5 font-bold shrink-0">›</span>
              <pre className="whitespace-pre-wrap break-all leading-normal font-mono">
                {line.content}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
