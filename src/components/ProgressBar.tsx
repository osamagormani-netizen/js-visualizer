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
    <div className="flex items-center gap-3 px-4 py-1.5">
      <span className="text-[10px] text-muted font-mono shrink-0">
        {currentStep + 1 > 0 ? currentStep + 1 : 0}
      </span>
      <div className="relative flex-1 h-1.5 bg-card-border/40 rounded-full overflow-hidden group">
        <div
          className="absolute inset-y-0 left-0 bg-accent/80 rounded-full transition-all duration-300 group-hover:bg-accent"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min={-1}
          max={totalSteps - 1}
          value={currentStep}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        {totalSteps <= 50 && (
          <div className="absolute inset-0 flex items-center pointer-events-none">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`absolute h-0.5 w-0.5 rounded-full transition-colors ${
                  i <= currentStep ? "bg-white/30" : "bg-muted/15"
                }`}
                style={{
                  left: `${((i + 0.5) / totalSteps) * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted font-mono shrink-0">
        {totalSteps}
      </span>
    </div>
  );
}
