"use client";

import { Terminal } from "lucide-react";
import { type ConsoleItem } from "@/lib/types";

interface ConsoleOutputProps {
  items: ConsoleItem[];
}

export function ConsoleOutput({ items }: ConsoleOutputProps) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-card-border overflow-hidden glass shadow-sm">
      <div className="px-3 py-2 bg-card/40 border-b border-card-border flex items-center gap-2">
        <Terminal className="h-3.5 w-3.5 text-success shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Console</span>
        {items.length > 0 && (
          <span className="text-[10px] text-muted bg-card-border/30 px-1.5 py-0.5 rounded-full border border-card-border/20">
            {items.length}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 bg-transparent font-mono text-xs space-y-0.5">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-muted/50">
            No output yet
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`animate-fade-in px-2 py-1 rounded ${item.type === 'error'
                  ? 'text-error bg-error/5'
                  : item.type === 'warn'
                    ? 'text-warning bg-warning/5'
                    : 'text-foreground'
                }`}
            >
              <span className="text-muted/40 mr-2">›</span>
              {item.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
