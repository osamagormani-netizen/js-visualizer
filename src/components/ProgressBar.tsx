"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onSeek: (step: number) => void;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  onSeek,
}: ProgressBarProps) {
  const progress =
    totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="flex items-center gap-4 px-6 py-2 bg-white/30 dark:bg-black/20 backdrop-blur-md">
      <span className="text-[10px] text-muted font-bold tracking-tighter tabular-nums shrink-0 opacity-60">
        {String(currentStep + 1 > 0 ? currentStep + 1 : 0).padStart(2, '0')}
      </span>
      <div className="relative flex-1 h-2 bg-card-border/30 rounded-full overflow-visible group">
        {/* Track */}
        <div className="absolute inset-0 bg-sidebar/50 backdrop-blur rounded-full border border-card-border/20 shadow-inner" />

        {/* Active Progress */}
        <div
          className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(0,113,227,0.3)] z-10"
          style={{ width: `${progress}%` }}
        >
          {/* Subtle shine on progress bar */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>

        <input
          type="range"
          min={-1}
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-30"
        />

        {/* Individual Step Indicators */}
        {totalSteps <= 40 && (
          <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none z-20">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1 w-1 rounded-full transition-all duration-500 ${i <= currentStep
                    ? "bg-white/40 scale-125"
                    : "bg-muted/10"
                  }`}
                style={{
                  left: `${((i + 0.5) / totalSteps) * 100}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Thumb handle (visual only as input is overlaid) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-card rounded-full border border-card-border shadow-xl z-40 transition-all duration-200 pointer-events-none group-active:scale-125 opacity-0 group-hover:opacity-100"
          style={{ left: `calc(${progress}% - 0.5rem)` }}
        />
      </div>
      <span className="text-[10px] text-muted font-bold tracking-tighter tabular-nums shrink-0 opacity-60">
        {String(totalSteps).padStart(2, '0')}
      </span>
    </div>
  );
}
