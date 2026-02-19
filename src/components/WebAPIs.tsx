"use client";

import { type WebAPIItem } from "@/lib/types";

interface WebAPIsProps {
  items: WebAPIItem[];
}

export function WebAPIs({ items }: WebAPIsProps) {
  return (
    <div className="flex flex-col h-full rounded-lg border border-card-border overflow-hidden">
      <div className="px-3 py-2 bg-card border-b border-card-border flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-warning" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Web APIs</span>
      </div>
      <div className="flex-1 flex flex-col justify-start p-2 gap-1.5 overflow-y-auto bg-background">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-muted/50">
            No active APIs
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="animate-queue-add flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono shadow-sm border"
              style={{
                borderColor: item.color || '#f59e0b',
                backgroundColor: (item.color || '#f59e0b') + '18',
              }}
            >
              <span className="font-medium truncate" style={{ color: item.color || '#f59e0b' }}>
                {item.label}
              </span>
              {item.detail && (
                <span className="text-muted ml-2 shrink-0 text-[10px]">
                  ⏱ {item.detail}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
