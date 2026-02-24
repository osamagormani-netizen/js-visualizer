"use client";

import { type QueueItem } from "@/lib/types";

interface TaskQueueProps {
  items: QueueItem[];
}

export function TaskQueue({ items }: TaskQueueProps) {
  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="px-4 py-2.5 bg-sidebar/30 backdrop-blur-md border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-warning shadow-[0_0_10px_rgba(255,149,0,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">Task Queue</span>
        </div>
        <span className="text-[9px] font-medium text-muted/60 uppercase tracking-tight">Macrotasks</span>
      </div>
      <div className="flex-1 flex items-center p-3 gap-2 overflow-x-auto bg-transparent no-scrollbar">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-1">
            <div className="h-10 w-10 rounded-full border border-dashed border-muted/50" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted">Empty</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2">
                <div
                  className="animate-queue-add px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-black/5 whitespace-nowrap border border-white/10"
                  style={{
                    backgroundColor: item.color || '#ff9500',
                    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)'
                  }}
                >
                  {item.label}
                </div>
                {i < items.length - 1 && (
                  <div className="h-px w-3 bg-card-border" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
