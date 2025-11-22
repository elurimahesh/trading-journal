"use client";

export default function StepChallengeCard(props) {
  const { journal, accounts } = props

  // Props: stepsData (array), accounts (object)
// Example stepsData is the same structure you provided earlier
const stepsData = [
  { step: 1, lot_size: 0.01, target_pips: 60, profit: "6", balance: "106" },
  { step: 2, lot_size: 0.02, target_pips: 60, profit: "12", balance: "118" },
  { step: 3, lot_size: 0.05, target_pips: 60, profit: "30", balance: "148" },
  { step: 4, lot_size: 0.10, target_pips: 60, profit: "60", balance: "208" },
  { step: 5, lot_size: 0.20, target_pips: 60, profit: "120", balance: "328" },
  { step: 6, lot_size: 0.40, target_pips: 60, profit: "240", balance: "568" },
  { step: 7, lot_size: 0.80, target_pips: 60, profit: "480", balance: "1048" },
  { step: 8, lot_size: 1.50, target_pips: 60, profit: "900", balance: "1948" },
  { step: 9, lot_size: 2.00, target_pips: 60, profit: "1200", balance: "3148" },
  { step: 10, lot_size: 3.00, target_pips: 60, profit: "1800", balance: "4948" },
  { step: 11, lot_size: 4.00, target_pips: 60, profit: "2400", balance: "7348" },
  { step: 12, lot_size: 6.00, target_pips: 60, profit: "3600", balance: "10948" },
  { step: 13, lot_size: 10.00, target_pips: 60, profit: "6000", balance: "16948" },
  { step: 14, lot_size: 15.00, target_pips: 60, profit: "9000", balance: "25948" },
  { step: 15, lot_size: 20.00, target_pips: 60, profit: "12000", balance: "37948" },
  { step: 16, lot_size: 30.00, target_pips: 60, profit: "18000", balance: "55948" },
  { step: 17, lot_size: 50.00, target_pips: 60, profit: "30000", balance: "85948" },
  { step: 18, lot_size: 60.00, target_pips: 60, profit: "36000", balance: "121948" }
];

// Helper: parse balances that may contain commas and strings
const parseBalance = (b) => {
  if (b === undefined || b === null) return NaN;
  if (typeof b === "number") return b;
  return Number(String(b).replace(/[, ]+/g, ""));
};

// Current balance from accounts (prefer currentBalance, fallback initialBalance)
const currentBalance = (() => {
  if (accounts?.currentBalance !== undefined && accounts.currentBalance !== null) {
    return Number(accounts.currentBalance);
  }
  if (accounts?.initialBalance !== undefined && accounts.initialBalance !== null) {
    return Number(accounts.initialBalance);
  }
  return 0;
})();

// Convert stepsData balances to numeric and sort by step just in case
const steps = stepsData
  .map(s => ({ ...s, balanceNum: parseBalance(s.balance) }))
  .sort((a,b) => a.step - b.step);

// total steps
const totalSteps = steps.length || 18;

// Find the next step whose target balance is strictly greater than currentBalance
let currentStep = 1;
let nextTarget = steps[steps.length - 1].balanceNum; // default: last target
let prevTarget = 0; // previous step balance (or starting balance)
for (let i = 0; i < steps.length; i++) {
  const s = steps[i];
  if (currentBalance < s.balanceNum) {
    currentStep = s.step;
    nextTarget = s.balanceNum;
    prevTarget = i === 0 ? (accounts?.initialBalance ? Number(accounts.initialBalance) : 0) : steps[i-1].balanceNum;
    break;
  } else {
    // If we've reached or exceeded the last step, mark as completed
    currentStep = totalSteps + 1; // completed all
    nextTarget = steps[steps.length - 1].balanceNum;
    prevTarget = steps[steps.length - 1].balanceNum;
  }
}

// If currentBalance >= final target, set completed state
const completedAll = currentBalance >= steps[steps.length - 1].balanceNum;

// If user already finished all steps, clamp currentStep to totalSteps
if (completedAll) {
  currentStep = totalSteps;
  nextTarget = steps[steps.length - 1].balanceNum;
  prevTarget = steps[steps.length - 1].balanceNum;
}

// Compute completed / remaining steps
const completedSteps = Math.min(totalSteps, Math.max(0, currentStep - 1));
const remainingSteps = Math.max(0, totalSteps - completedSteps);

// Progress between prevTarget -> nextTarget
// If nextTarget === prevTarget (edge cases), progress = 100 if reached or 0 if not
let progressPercentWithinStep = 0;
if (nextTarget === prevTarget) {
  progressPercentWithinStep = currentBalance >= nextTarget ? 100 : 0;
} else {
  progressPercentWithinStep = ((currentBalance - prevTarget) / (nextTarget - prevTarget)) * 100;
  if (progressPercentWithinStep < 0) progressPercentWithinStep = 0;
  if (progressPercentWithinStep > 100) progressPercentWithinStep = 100;
}

// Overall progress as total completed steps + fraction of current step
const progressPercent = Math.min(100, ((completedSteps + (progressPercentWithinStep / 100)) / totalSteps) * 100);

// Steps array for rendering
const stepsArray = steps.map(s => s.step);

// Example values you can use in UI:
console.log({
  currentBalance,
  currentStep,
  totalSteps,
  nextTarget,
  prevTarget,
  completedSteps,
  remainingSteps,
  progressPercentWithinStep: Number(progressPercentWithinStep.toFixed(2)),
  progressPercent: Number(progressPercent.toFixed(2)),
  stepsArray
});

// Thumbnail / snapshot (your uploaded file path; system will expose this as URL)
const snapshotPath = "/mnt/data/Screenshot 2025-11-21 at 3.09.38 AM.png";
  // Dummy values for now – we’ll wire real logic later
  // const currentBalance = 1470;   // example
  // const currentStep = 1;
  // const totalSteps = 18;
  // const nextTarget = 1948;
  // const completedSteps = currentStep - 1;
  // const remainingSteps = totalSteps - currentStep;

  // const progressPercent = Math.min(
  //   100,
  //   (currentStep / totalSteps) * 100
  // );

  // const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

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
              Challenge progress: {progressPercent.toFixed(2)}%
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
