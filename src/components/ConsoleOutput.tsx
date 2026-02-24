"use client";

import { Terminal } from "lucide-react";
import { type ConsoleItem } from "@/lib/types";

interface ConsoleOutputProps {
  items: ConsoleItem[];
}

export function ConsoleOutput({ items }: ConsoleOutputProps) {
  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="px-4 py-2.5 bg-sidebar/30 backdrop-blur-md border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-success" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">Console</span>
        </div>
        {items.length > 0 && (
          <span className="text-[9px] font-bold text-success/80 bg-success/10 px-1.5 py-0.5 rounded-full border border-success/20">
            {items.length}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 bg-transparent font-mono text-[11px] leading-relaxed space-y-1 no-scrollbar">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full opacity-30 gap-1 pb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted">No Output</span>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`animate-fade-in px-3 py-1.5 rounded-lg border shadow-sm ${item.type === 'error'
                ? 'text-error bg-error/5 border-error/10'
                : item.type === 'warn'
                  ? 'text-warning bg-warning/5 border-warning/10'
                  : 'text-foreground bg-sidebar/20 border-card-border/30'
                }`}
            >
              <span className="text-muted/40 mr-2 font-bold">›</span>
              {item.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
