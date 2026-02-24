"use client";

import { type StackItem } from "@/lib/types";

interface CallStackProps {
  items: StackItem[];
}

export function CallStack({ items }: CallStackProps) {
  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="px-4 py-2.5 bg-sidebar/30 backdrop-blur-md border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(0,113,227,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">Call Stack</span>
        </div>
        <span className="text-[9px] font-medium text-muted/60 uppercase tracking-tight">Active</span>
      </div>
      <div className="flex-1 flex flex-col-reverse justify-start p-3 gap-2 overflow-y-auto bg-transparent no-scrollbar">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-1">
            <div className="h-10 w-10 rounded-full border border-dashed border-muted/50" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted">Empty</span>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="animate-stack-push px-4 py-3 rounded-xl text-xs font-semibold text-white truncate shadow-lg shadow-black/5 border border-white/10"
              style={{
                backgroundColor: item.color || '#0071e3',
                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)'
              }}
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
