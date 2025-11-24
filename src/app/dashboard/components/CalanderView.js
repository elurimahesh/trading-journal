'use client';
import { useMemo, useState } from "react";
import { BiTransfer } from "react-icons/bi";
import { CiCalendar } from "react-icons/ci";

export default function CalendarDailySummary(props) {
    const { journal = [], accounts } = props;

    const toNum = (v) => (v ? Number(v) : 0);
    const formatYMD = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;

    const aggregated = useMemo(() => {
        const m = {};
        for (const t of journal) {
            const key = t.date;
            const pnl = toNum(t.pL || t.netPL);
            if (!m[key]) m[key] = { pnl: 0, trades: 0, items: [] };
            m[key].pnl += pnl;
            m[key].trades += 1;
            m[key].items.push({ ...t, pnl });
        }
        return m;
    }, [journal]);

    function getCalendarWeeks(year, monthIndex) {
        const first = new Date(year, monthIndex, 1);
        const firstMonday = (() => {
            const d = new Date(first);
            const day = d.getDay();
            if (day === 1) return d;
            const diff = day === 0 ? -6 : 1 - day;
            d.setDate(d.getDate() + diff);
            d.setHours(0, 0, 0, 0);
            return d;
        })();

        const weeks = [];
        let cursor = new Date(firstMonday);
        for (let wk = 0; wk < 6; wk++) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(cursor));
                cursor.setDate(cursor.getDate() + 1);
            }
            weeks.push(week);
        }
        return weeks;
    }

    const initialMonth = new Date().getMonth();
    const initialYear = new Date().getFullYear();
    const [year, setYear] = useState(initialYear);
    const [monthIndex, setMonthIndex] = useState(initialMonth);
    const [selectedDay, setSelectedDay] = useState(null);

    const todayYMD = formatYMD(new Date());
    const weeks = useMemo(() => getCalendarWeeks(year, monthIndex), [year, monthIndex]);

    const monthLabel = new Date(year, monthIndex, 1).toLocaleString(undefined, {
        month: "long",
        year: "numeric",
    });

    const monthTotals = useMemo(() => {
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        let total = 0;
        let activeDays = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            if (aggregated[key]) {
                total += aggregated[key].pnl;
                activeDays++;
            }
        }
        return { total, activeDays };
    }, [aggregated, year, monthIndex]);

    const gotoPrevMonth = () => {
        const d = new Date(year, monthIndex - 1, 1);
        setYear(d.getFullYear());
        setMonthIndex(d.getMonth());
    };
    const gotoNextMonth = () => {
        const d = new Date(year, monthIndex + 1, 1);
        setYear(d.getFullYear());
        setMonthIndex(d.getMonth());
    };
    const handleToday = () => {
        const now = new Date();
        setYear(now.getFullYear());
        setMonthIndex(now.getMonth());
    };

    /* small-cell mobile-friendly calendar rendering */
    return (
        <div className="max-w-7xl mx-auto">
            {/* header */}
            <div className="flex items-center flex-wrap justify-between mb-4 gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Daily Summary</h2>
                    <div className="text-sm text-gray-500 mt-2 flex items-center flex-wrap gap-2">
                        <div className="">
                            <button onClick={gotoPrevMonth} className="px-3 py-1 rounded hover:bg-gray-100 bg-gray-800 cursor-pointer" aria-label="Previous month">&lt;</button>
                            <button className="px-4 py-1 rounded font-medium hover:bg-gray-100 dark:hover:bg-gray-800">{monthLabel}</button>
                            <button onClick={gotoNextMonth} className="px-3 py-1 rounded hover:bg-gray-100 bg-gray-800 cursor-pointer" aria-label="Next month">&gt;</button>
                        </div>

                        <div>
                            <button onClick={handleToday} className="ml-2 text-xs text-gray-400 bg-gray-800 px-3 py-2 cursor-pointer flex align-center"><CiCalendar size={15} />&nbsp; Today</button>
                        </div>

                    </div>
                </div>

                <div className="text-sm text-gray-500 whitespace-nowrap bg-gray-800 px-3 py-2">
                    PnL:{" "}
                    <span className={`${monthTotals.total < 0 ? "text-rose-500" : "text-emerald-500"} font-semibold`}>
                        ${monthTotals.total.toLocaleString()}
                    </span>&nbsp; &nbsp;
                    Days: <span className="font-semibold text-white">{monthTotals.activeDays}</span>
                </div>
            </div>

            {/* calendar + weekly summary layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* calendar */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="rounded-lg border bg-white dark:bg-[#041826] border-gray-200 dark:border-gray-800 p-2 md:p-4">
                        {/* weekday header (always show) */}
                        <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                                <div key={d} className="text-center px-1 md:px-0">{d}</div>
                            ))}
                        </div>

                        {/* responsive calendar container:
                - On small screens make the calendar horizontally scrollable
                - set a min-width so columns keep decent width
            */}
                        <div
                            className="overflow-x-auto -mx-2 md:mx-0 py-1"
                            style={{ WebkitOverflowScrolling: "touch" }}
                        >
                            {/* set minWidth to 700-840px depending on desired column size.
                  7 columns * 110px = 770px which fits phones with horizontal scroll. */}
                            <div className="inline-block min-w-[770px] w-auto">
                                <div className="grid grid-cols-7 gap-0.5">
                                    {weeks.map((week, wi) =>
                                        week.map((day, di) => {
                                            const ymd = formatYMD(day);
                                            const inMonth = day.getMonth() === monthIndex;
                                            const info = aggregated[ymd];
                                            return (
                                                <div
                                                    key={`${wi}-${di}`}
                                                    onClick={() => setSelectedDay(ymd)}
                                                    className={`p-2 md:p-3 rounded-lg border transition cursor-pointer
                            ${inMonth ? "border-gray-200 dark:border-gray-800" : "border-transparent opacity-40"}
                            ${info?.pnl > 0
                                                            ? "bg-cal-win-20 text-emerald-700"
                                                            : info?.pnl < 0
                                                                ? "bg-cal-loss-20 text-rose-700"
                                                                : inMonth
                                                                    ? "bg-white dark:bg-[#051827]"
                                                                    : "bg-gray-50 dark:bg-[#021018]/40"
                                                        }
                            ${ymd === todayYMD ? "ring-2 ring-[#5750F1] shadow-md" : ""}
                          `}
                                                    style={{
                                                        // make cells compact on mobile, a bit taller on md+
                                                        minHeight: 64,
                                                        padding: 8,
                                                    }}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className={`text-sm font-medium ${inMonth ? "text-black dark:text-white" : "text-gray-400"}`}>
                                                            {day.getDate()}
                                                        </div>
                                                    </div>

                                                    {info ? (
                                                        <div className="mt-2 text-right">
                                                            <div className="flex items-center justify-end gap-1 text-[12px]">
                                                                <span className="text-sm">{info.trades}</span>
                                                                <BiTransfer />
                                                            </div>

                                                            <div className="mt-1 text-sm font-semibold">
                                                                <span className={info.pnl < 0 ? "text-rose-500" : "text-emerald-500"}>
                                                                    {info.pnl < 0 ? `-$${Math.abs(info.pnl).toLocaleString()}` : `+$${info.pnl.toLocaleString()}`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2 text-xs text-gray-400">No trades</div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* weekly summary */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="rounded-lg border bg-white dark:bg-[#041826] border-gray-200 dark:border-gray-800 p-4">
                        <h3 className="text-lg font-semibold">Weekly Summary</h3>
                        <div className="text-xs text-gray-400 mb-3">Grouped by week (Mon - Sun)</div>

                        <div className="space-y-2">
                            {weeks.map((week, i) => {
                                let total = 0, days = 0;
                                for (const day of week) {
                                    const ymd = formatYMD(day);
                                    if (aggregated[ymd]) { total += aggregated[ymd].pnl; days++; }
                                }
                                const labelStart = week[0];
                                const labelEnd = week[6];
                                const label = `${labelStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${labelEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
                                return (
                                    <div key={i} className="rounded-md p-3 border flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Week {i + 1}</div>
                                            <div className="text-xs text-gray-400">{label}</div>
                                        </div>

                                        <div className="text-right">
                                            {days ? (
                                                <>
                                                    <div className={`${total < 0 ? "text-rose-500" : "text-emerald-500"} font-semibold`}>
                                                        {total < 0 ? `-$${Math.abs(total).toLocaleString()}` : `+$${total.toLocaleString()}`}
                                                    </div>
                                                    <div className="text-xs text-gray-400">{days} days</div>
                                                </>
                                            ) : (
                                                <div className="text-xs text-gray-400">No trades</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 text-xs text-gray-400">Tip: Weeks with negative PnL are highlighted red.</div>
                    </div>
                </div>
            </div>

            {/* modal */}
            {selectedDay && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedDay(null)}>
                    <div onClick={(e) => e.stopPropagation()} className="max-w-xl w-full bg-white dark:bg-[#071522] rounded-xl shadow-xl p-5 max-h-[85vh] overflow-auto">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold">Day Details — {selectedDay}</h4>
                            <button onClick={() => setSelectedDay(null)} className="text-sm text-gray-400">Close</button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {(aggregated[selectedDay]?.items || []).map((it, i) => (
                                <div key={i} className="p-3 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <div>{it.symbol}</div>
                                        <div className={`font-semibold ${it.pnl < 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                            {it.pnl < 0 ? `-$${Math.abs(it.pnl)}` : `+$${it.pnl}`}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!aggregated[selectedDay] && <div className="text-sm text-gray-400">No trades for this day</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}