"use client";

interface EventLoopIndicatorProps {
  active: boolean;
}

export function EventLoopIndicator({ active }: EventLoopIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-4 px-6">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-card-border to-card-border" />
      <div className="flex items-center gap-4">
        <div
          className={`relative h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out shadow-lg ${active
            ? 'liquid-glass border-accent/30 scale-110 shadow-accent/20'
            : 'apple-card bg-sidebar/30 grayscale opacity-60'
            }`}
        >
          {/* Inner pulse effect when active */}
          {active && (
            <div className="absolute inset-0 rounded-2xl bg-accent/10 animate-pulse" />
          )}

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`${active ? 'animate-event-loop-spin text-accent' : 'text-muted'}`}
          >
            <path
              d="M12 4V2M12 22v-2M4 12H2m20 0h-2m-2.828-7.172l-1.414-1.414M7.243 16.757l-1.414 1.414M16.757 16.757l1.414 1.414M7.243 7.243L5.829 5.829"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="2 4"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${active ? 'text-accent' : 'text-muted/50'
            }`}>
            Engine
          </span>
          <span className={`text-sm font-semibold transition-colors duration-300 ${active ? 'text-foreground' : 'text-muted/40'
            }`}>
            Event Loop
          </span>
        </div>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-card-border to-card-border" />
    </div>
  );
}
