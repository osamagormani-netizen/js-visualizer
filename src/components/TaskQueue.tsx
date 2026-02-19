"use client";

import { type QueueItem } from "@/lib/types";

interface TaskQueueProps {
  items: QueueItem[];
}

export function TaskQueue({ items }: TaskQueueProps) {
  return (
    <div className="flex flex-col h-full rounded-lg border border-card-border overflow-hidden">
      <div className="px-3 py-2 bg-card border-b border-card-border flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-warning" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Task Queue</span>
        <span className="text-[10px] text-muted">(Macrotask)</span>
      </div>
      <div className="flex-1 flex items-center p-2 gap-1.5 overflow-x-auto bg-background">
        {items.length === 0 ? (
          <div className="flex items-center justify-center w-full text-xs text-muted/50">
            Empty
          </div>
        ) : (
          <>
            {items.map((item, i) => (
              <div key={item.id} className="flex items-center gap-1.5">
                <div
                  className="animate-queue-add px-3 py-2 rounded-md text-xs font-mono font-medium text-white shadow-sm whitespace-nowrap"
                  style={{ backgroundColor: item.color || '#f59e0b' }}
                >
                  {item.label}
                </div>
                {i < items.length - 1 && (
                  <span className="text-muted/40 text-xs">→</span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
