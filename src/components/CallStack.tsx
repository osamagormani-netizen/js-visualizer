"use client";

import { type StackItem } from "@/lib/types";

interface CallStackProps {
  items: StackItem[];
}

export function CallStack({ items }: CallStackProps) {
  return (
    <div className="flex flex-col h-full rounded-lg border border-card-border overflow-hidden">
      <div className="px-3 py-2 bg-card border-b border-card-border flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Call Stack</span>
      </div>
      <div className="flex-1 flex flex-col-reverse justify-start p-2 gap-1.5 overflow-y-auto bg-background">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-muted/50">
            Empty
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="animate-stack-push px-3 py-2 rounded-md text-xs font-mono font-medium text-white truncate shadow-sm"
              style={{ backgroundColor: item.color || '#3b82f6' }}
              title={item.label}
            >
              {item.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
