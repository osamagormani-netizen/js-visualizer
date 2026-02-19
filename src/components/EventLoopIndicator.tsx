"use client";

interface EventLoopIndicatorProps {
  active: boolean;
}

export function EventLoopIndicator({ active }: EventLoopIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-2 px-4">
      <div className="h-px flex-1 bg-card-border" />
      <div className="flex items-center gap-2">
        <div
          className={`relative h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            active
              ? 'border-success bg-success/10 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
              : 'border-card-border bg-card'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={active ? 'animate-event-loop-spin' : ''}
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10"
              stroke={active ? '#22c55e' : 'currentColor'}
              strokeWidth="2.5"
              strokeLinecap="round"
              className={active ? '' : 'text-muted/40'}
            />
            <path
              d="M22 12c0-5.52-4.48-10-10-10"
              stroke={active ? '#22c55e' : 'currentColor'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
              className={active ? '' : 'text-muted/20'}
            />
            <path
              d="M12 2l3 3-3 3"
              stroke={active ? '#22c55e' : 'currentColor'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={active ? '' : 'text-muted/40'}
            />
          </svg>
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
          active ? 'text-success' : 'text-muted/50'
        }`}>
          Event Loop
        </span>
      </div>
      <div className="h-px flex-1 bg-card-border" />
    </div>
  );
}
