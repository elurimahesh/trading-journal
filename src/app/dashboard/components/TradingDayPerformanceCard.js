"use client";

export default function TradingDayPerformanceCard(props) {
    const { journal, accounts } = props
    // === Dynamic Day Performance ===

    const toNum = (v) => (v ? Number(v) : 0);
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weekdayPL = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };

    // Build weekday PL
    journal.forEach(t => {
        const date = new Date(t.date);
        if (!isNaN(date)) {
            const idx = date.getDay();
            const name = dayLabels[idx];
            if (weekdayPL[name] !== undefined) {
                weekdayPL[name] += toNum(t.netPL);
            }
        }
    });

    // Convert to chart-friendly format
    const dayData = [
        { label: "Mon", value: weekdayPL.Mon },
        { label: "Tue", value: weekdayPL.Tue },
        { label: "Wed", value: weekdayPL.Wed },
        { label: "Thu", value: weekdayPL.Thu },
        { label: "Fri", value: weekdayPL.Fri },
    ];

    // Best day
    const bestDay = dayData.reduce(
        (best, day) => (day.value > best.value ? day : best),
        { label: "", value: -Infinity }
    );

    // Scaling
    const maxAbsValue = Math.max(...dayData.map(d => Math.abs(d.value))) || 1;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold">Trading Day Performance</h2>

                </div>
                <div className="text-right flex">
                    <p className="text-[12px] uppercase tracking-wide text-gray-500">
                        Best Day:
                    </p>
                    <p className="text-[12px] font-semibold pl-1">
                        {bestDay.label}
                    </p>
                </div>
            </div>

            {/* Candle-style mini chart */}
            <div className="mt-2">
                <div className="relative h-35 flex items-stretch justify-between gap-3">
                    {/* zero line in the middle */}
                    <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200/70 pointer-events-none" />

                    {dayData.map((day) => {
                        const absVal = Math.abs(day.value);
                        const isPositive = day.value > 0;
                        const isNegative = day.value < 0;

                        // barHeight: 0–50% of full height (so max is half the chart)
                        let barHeight = (absVal / maxAbsValue) * 50;
                        const minHeight = 8; // keep tiny bars still visible
                        if (barHeight > 0 && barHeight < minHeight) {
                            barHeight = minHeight;
                        }

                        return (
                            <div
                                key={day.label}
                                className="relative flex-1 flex flex-col items-center justify-end text-xs"
                            >
                                {/* The bar, anchored at the middle (50%) */}
                                {(isPositive || isNegative) && (
                                    <div
                                        className={`absolute w-3 rounded-full ${isPositive ? "bg-emerald-500/80" : "bg-rose-500/80"
                                            }`}
                                        style={
                                            isPositive
                                                ? {
                                                    bottom: "50%",          // start from zero line
                                                    height: `${barHeight}%`, // grow upwards
                                                }
                                                : {
                                                    top: "50%",             // start from zero line
                                                    height: `${barHeight}%`, // grow downwards
                                                }
                                        }
                                    />
                                )}

                                {/* Day label at bottom */}
                                <span className="absolute bottom-0 mb-0.5 text-[11px] text-gray-500">
                                    {day.label}
                                </span>
                            </div>
                        );
                    })}
                </div>


            </div>

        </div>
    );
}
