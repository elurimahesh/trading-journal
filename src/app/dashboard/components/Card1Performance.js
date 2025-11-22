"use client";

export default function DashboardScoreCard(props) {
  const { journal, accounts } = props
  console.log("journal", journal, accounts);

  // journal = props.journal
  // accounts = props.accounts

  // Convert string numbers to actual numbers safely
  const toNum = (v) => (v ? Number(v) : 0);

  // Total trades
  const totalTrades = journal.length;

  // Win Rate (Win = pL > 0)
  const wins = journal.filter(t => toNum(t.pL || t.netPL) > 0).length;
  const winRateData = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  // RR Score (average RR normalized to 0–100)
  let rrTotal = 0;
  let rrCount = 0;
  journal.forEach(t => {
    const val = Number(t.rR);
    if (!isNaN(val)) {
      rrTotal += val;
      rrCount += 1;
    }
  });
  const avgRR = rrCount > 0 ? rrTotal / rrCount : 0;

  // Convert avgRR → 0–100 scale (cap at RR=5)
  const rrScoreData = Math.min((avgRR / 5) * 100, 100);

  // SL Usage → always 100%
  const slUsageData = 100;

  // Consistency = % profitable days
  let dayMap = {};
  journal.forEach(t => {
    const day = t.date;
    const pl = toNum(t.pL || t.netPL);
    if (!dayMap[day]) dayMap[day] = 0;
    dayMap[day] += pl;
  });

  const days = Object.keys(dayMap);
  const activeDays = days.length;
  const profitableDays = days.filter(d => dayMap[d] > 0).length;

  const consistencyData = activeDays > 0 ? (profitableDays / activeDays) * 100 : 0;
  // TODO: replace these with real calculated values later
  const winRate = Number(winRateData.toFixed(1));      // in %
  const rrScore = Number(rrScoreData.toFixed(1));      // in %
  const slUsage = 100;      // in %
  const consistency = Number(consistencyData.toFixed(1));  // in %

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
