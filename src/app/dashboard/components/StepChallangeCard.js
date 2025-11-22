"use client";

export default function StepChallengeCard() {
  // Dummy values for now – we’ll wire real logic later
  const currentBalance = 1470;   // example
  const currentStep = 1;
  const totalSteps = 18;
  const nextTarget = 1948;
  const completedSteps = currentStep - 1;
  const remainingSteps = totalSteps - currentStep;

  const progressPercent = Math.min(
    100,
    (currentStep / totalSteps) * 100
  );

  const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Step Challenge</h2>
          <p className="text-[11px] text-gray-400">
            18-step compounding journey
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-[#111827] px-2.5 py-1 text-[10px] uppercase tracking-wide text-gray-400">
            Live Balance
          </span>
          <span className="text-base font-semibold text-[#7dd3fc]">
            {currentBalance} <span className="text-xs text-gray-400">USD</span>
          </span>
        </div>
      </div>

      {/* Main info row */}
      <div className="flex items-center justify-between gap-4 mt-5">
        {/* Left: Big step badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b1120] border border-[#1f2937] shadow-inner">
            <span className="text-xl font-bold text-[#5750F1]">
              {currentStep}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] uppercase tracking-wide text-gray-400">
              Current Step
            </span>
            <span className="text-sm font-semibold text-white">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-[11px] text-gray-500">
              Challenge progress: {progressPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Right: compact stats */}
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          <div className="rounded-lg border border-[#1f2937] bg-[#020617]/60 px-3 py-2">
            <div className="text-gray-400">Next Target</div>
            <div className="text-sm font-semibold text-[#7dd3fc]">
              {nextTarget} <span className="text-[10px] text-gray-500">USD</span>
            </div>
          </div>
          <div className="rounded-lg border border-[#1f2937] bg-[#020617]/60 px-3 py-2">
            <div className="text-gray-400">Remaining Steps</div>
            <div className="text-sm font-semibold text-white">
              {remainingSteps}
            </div>
          </div>
        </div>
      </div>

      {/* Segmented steps tracker */}
      <div className="mt-1 space-y-2 mt-5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>Step timeline</span>
          <span>
            Completed:{" "}
            <span className="text-gray-200 font-medium">
              {completedSteps}/{totalSteps}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {stepsArray.map((step) => {
            const isDone = step < currentStep;
            const isCurrent = step === currentStep;

            return (
              <div
                key={step}
                className={`
                  h-2 flex-1 rounded-full transition-all duration-300
                  ${
                    isCurrent
                      ? "bg-[#5750F1] shadow-[0_0_8px_rgba(87,80,241,0.7)]"
                      : isDone
                      ? "bg-emerald-500/80"
                      : "bg-gray-700"
                  }
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
