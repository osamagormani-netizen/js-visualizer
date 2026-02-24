"use client";

import { type WebAPIItem } from "@/lib/types";

interface WebAPIsProps {
  items: WebAPIItem[];
}

export function WebAPIs({ items }: WebAPIsProps) {
  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="px-4 py-2.5 bg-sidebar/30 backdrop-blur-md border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo shadow-[0_0_10px_rgba(88,86,214,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">Web APIs</span>
        </div>
        <span className="text-[9px] font-medium text-muted/60 uppercase tracking-tight">Timers & Async</span>
      </div>
      <div className="flex-1 flex flex-col justify-start p-3 gap-2 overflow-y-auto bg-transparent no-scrollbar">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-1">
            <div className="h-10 w-10 rounded-full border border-dashed border-muted/50" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted">Idle</span>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="animate-queue-add flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold shadow-md border"
              style={{
                borderColor: (item.color || '#5856d6') + '40',
                backgroundColor: (item.color || '#5856d6') + '10',
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: item.color || '#5856d6' }}
                />
                <span className="truncate" style={{ color: item.color || '#5856d6' }}>
                  {item.label}
                </span>
              </div>
              {item.detail && (
                <div className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[9px] font-bold text-muted tabular-nums">
                  {item.detail}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
