"use client";

export default function ProfitabilityCard(props) {
  const { journal, accounts } = props
  // === Dynamic Profitability ===

  // Convert PL strings safely
  const toNum = (v) => (v ? Number(v) : 0);

  // 1) Total trades
  const totalTrades = journal.length;

  // 2) Wins / Losses
  const wins = journal.filter(t => toNum(t.pL || t.netPL) > 0).length;
  const losses = totalTrades - wins;

  // 3) Win rate / Loss rate
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const lossRate = 100 - winRate;

  // 4) Average holding time (from "0h 11m 28s")
  function parseDuration(d) {
    if (!d) return 0;

    // Example: "0h 11m 28s"
    const parts = d.match(/(\d+)h\s*(\d+)m\s*(\d+)s/);
    if (!parts) return 0;

    const h = Number(parts[1]);
    const m = Number(parts[2]);
    const s = Number(parts[3]);

    return h * 3600 + m * 60 + s;
  }

  // total seconds
  let totalSeconds = 0;
  journal.forEach(t => {
    totalSeconds += parseDuration(t.duration);
  });

  // average seconds
  let avgSeconds = totalTrades > 0 ? totalSeconds / totalTrades : 0;

  // convert avgSeconds → "Xh Ym"
  const avgHolding = (() => {
    const h = Math.floor(avgSeconds / 3600);
    const m = Math.floor((avgSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  })();

  // 5) Circle arc values
  const radius = 80;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - winRate / 100);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Profitability</h2>
        </div>

        <div className="text-right flex align-center">
          <p className="text-[12px] uppercase tracking-wide text-gray-500">
            Avg Holding Period:
          </p>
          <p className="text-[12px] font-semibold pl-1">{avgHolding}</p>
        </div>
      </div>

      {/* Main content: Left / Gauge / Right */}
      <div className="flex items-center justify-between gap-4 mt-4">
        {/* Left: Won */}
        <div className="flex flex-col items-start gap-1 text-xs">
          <span className="text-gray-500">Won</span>
          <span className="text-lg font-semibold text-emerald-500">
            {winRate.toFixed(1)}%
          </span>
          <span className="text-[11px] text-gray-500">
            {wins} trades
          </span>
        </div>

        {/* Center: Half-circle gauge */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-36 flex items-end justify-center">
            <svg
              width="260"
              height="160"
              viewBox="0 0 260 160"
              className="absolute top-0"
            >
              {/* Background grey arc */}
              <path
                d="M20 140 A110 110 0 0 1 240 140"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth={stroke}
              />

              {/* Full green arc */}
              <path
                d="M20 140 A110 110 0 0 1 240 140"
                fill="none"
                stroke="#10B981"
                strokeWidth={stroke}
                pathLength="100"
              />

              {/* red overlay: last winRate% from right side */}
              <path
                d="M20 140 A110 110 0 0 1 240 140"
                fill="none"
                stroke="#EF4444"
                strokeWidth={stroke}
                strokeLinecap="butt"
                pathLength="100"
                // gap (loss) → draw (win) → gap (loss)
                strokeDasharray={`${lossRate} ${winRate} ${lossRate}`}
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            </svg>

            {/* Center Text */}
            <div className="absolute bottom-4 flex flex-col items-center text-center">
              <span className="text-[10px] uppercase tracking-wide text-gray-500">
                Trades Taken
              </span>
              <span className="text-xl font-semibold">
                {totalTrades}
              </span>
              <span className="text-[11px] text-gray-500">
                Winrate: {winRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Lost */}
        <div className="flex flex-col items-end gap-1 text-xs">
          <span className="text-gray-500">Lost</span>
          <span className="text-lg font-semibold text-rose-500">
            {lossRate.toFixed(1)}%
          </span>
          <span className="text-[11px] text-gray-500">
            {losses} trades
          </span>
        </div>
      </div>
    </div>
  );
}
