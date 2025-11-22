"use client";

export default function DashboardScoreCard() {
  // TODO: replace these with real calculated values later
  const winRate = 62;      // in %
  const rrScore = 65;      // in %
  const slUsage = 55;      // in %
  const consistency = 72;  // in %

  const score = Math.round((winRate + rrScore + slUsage + consistency) / 4);

  const metrics = [
    { label: "Win Rate", value: winRate },
    { label: "RR Quality", value: rrScore },
    { label: "SL Usage", value: slUsage },
    { label: "Consistency", value: consistency },
  ];

  return (
    <div>
      {/* Title */}
      <div>
        <h2 className="text-sm font-semibold">Score</h2>
     
      </div>

      <div className="flex items-center gap-6">
        {/* Main score circle */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-[#5750F1]/40 bg-[#5750F1]/5">
            <span className="text-2xl font-bold text-[#5750F1]">
              {score}
            </span>
          </div>
          <span className="mt-2 text-xs text-gray-500">Overall score</span>
        </div>

        {/* Metrics list */}
        <div className="flex-1 space-y-3">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{m.label}</span>
                <span className="font-medium">{m.value}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-dark-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5750F1] transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, m.value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
