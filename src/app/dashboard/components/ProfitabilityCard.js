"use client";

export default function ProfitabilityCard() {
  // Dummy values for now – will make dynamic later
  const winRate = 90;        // in %
  const totalTrades = 61;
  const wins = 16;
  const losses = 45;
  const avgHolding = "1h 27m";

  const lossRate = 100 - winRate;

  // Bigger arc config
  const radius = 80;
  const stroke = 14;

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
