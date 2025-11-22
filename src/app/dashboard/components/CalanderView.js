"use client";

import { useMemo, useState } from "react";
import { BiTransfer } from "react-icons/bi";

/**
 * CalendarDailySummary.jsx
 * - Calendar (70%) + Weekly Summary (30%)
 * - Month navigation (< month, month, > month)
 * - Hardcoded sample data (replace with your data)
 * - Download snapshot uses your uploaded path (system will convert to URL):
 *   /mnt/data/Screenshot 2025-11-21 at 3.09.38 AM.png
 *
 * Paste into src/components/dashboard/CalendarDailySummary.jsx
 */

const SAMPLE_TRADES = [
    { date: "2025-11-02", pnl: -1200, symbol: "XAUUSD" },
    { date: "2025-11-03", pnl: -2300, symbol: "GBPUSD" },
    { date: "2025-11-07", pnl: 3, symbol: "XAUUSD" },
    { date: "2025-11-10", pnl: 50, symbol: "EURUSD" },
    { date: "2025-11-10", pnl: -20, symbol: "GBPUSD" },
];


function formatYMD(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
}

// returns weeks array where each week is array of Date objects (Mon..Sun)
function getCalendarWeeks(year, monthIndex) {
    const first = new Date(year, monthIndex, 1);
    const last = new Date(year, monthIndex + 1, 0);

    // find Monday on or before the 1st
    const firstMonday = (() => {
        const d = new Date(first);
        const day = d.getDay(); // 0 Sun .. 6 Sat
        if (day === 1) return d;
        const diff = day === 0 ? -6 : 1 - day;
        d.setDate(d.getDate() + diff);
        d.setHours(0, 0, 0, 0);
        return d;
    })();

    const weeks = [];
    let cursor = new Date(firstMonday);
    // ensure at least 6 rows shown (some months span 6 weeks)
    for (let wk = 0; wk < 6; wk++) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }
        weeks.push(week);
        // stop early if we've passed last day and already shown at least 4 weeks
        if (cursor > last && weeks.length >= 4) {
            // but still ensure total 6 weeks for consistent grid
            // we'll keep iterating to 6
        }
    }

    return weeks;
}

export default function CalendarDailySummary({
    trades = SAMPLE_TRADES,
    initialYear = 2025,
    initialMonthIndex = 10, // 0=Jan, 10=Nov
}) {
    const [year, setYear] = useState(initialYear);
    const [monthIndex, setMonthIndex] = useState(initialMonthIndex);
    const [selectedDay, setSelectedDay] = useState(null);
    const todayYMD = formatYMD(new Date());

    // aggregate trades by YYYY-MM-DD
    const aggregated = useMemo(() => {
        const m = {};
        for (const t of trades) {
            m[t.date] = m[t.date] || { pnl: 0, trades: 0, items: [] };
            m[t.date].pnl += t.pnl;
            m[t.date].trades += 1;
            m[t.date].items.push(t);
        }
        return m;
    }, [trades]);

    // calendar weeks for current month
    const weeks = useMemo(() => getCalendarWeeks(year, monthIndex), [year, monthIndex]);

    // month label and summary
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

    // weekly summary array (matching weeks shown)
    const weeklySummary = useMemo(() => {
        return weeks.map((week, i) => {
            let total = 0;
            let days = 0;
            const labelStart = week[0];
            const labelEnd = week[6];
            // compute totals for days that belong to this month only for display
            for (const day of week) {
                const ymd = formatYMD(day);
                if (aggregated[ymd]) {
                    total += aggregated[ymd].pnl;
                    days++;
                }
            }
            const label = `${labelStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${labelEnd.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
            return { index: i + 1, start: labelStart, end: labelEnd, total, days, label };
        });
    }, [weeks, aggregated]);

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

    // cell styling helper
    const cellClass = (dateObj) => {
        const ymd = formatYMD(dateObj);
        const info = aggregated[ymd];
        if (!info) return "bg-transparent";
        if (info.pnl > 0) return "bg-emerald-50 text-emerald-700";
        if (info.pnl < 0) return "bg-rose-50 text-rose-700";
        return "bg-gray-50";
    };
    return (
        <div className="max-w-7xl mx-auto">
            {/* header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Daily Summary</h2>
                    <div className="text-sm text-gray-500">
                        <button
                            onClick={gotoPrevMonth}
                            className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
                        >
                            &lt;
                        </button>

                        <button
                            onClick={() => { /* noop - keep for style */ }}
                            className="px-4 py-1 rounded font-medium border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                            {monthLabel}
                        </button>

                        <button
                            onClick={gotoNextMonth}
                            className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ml-2"
                        >
                            &gt;
                        </button>

                        <button onClick={handleToday} className="ml-4 text-xs text-gray-400">Today</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">
                        PnL: <span className={`${monthTotals.total < 0 ? "text-rose-500" : "text-emerald-500"} font-semibold`}>${monthTotals.total.toLocaleString()}</span>.
                        Days: <span className="font-semibold">{monthTotals.activeDays}</span>
                    </div>

                </div>
            </div>

            {/* main layout: calendar 70% + weekly 30% */}
            <div className="grid grid-cols-12 gap-6">
                {/* calendar: spans 8/12 = 66.6% ~ 70% */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="rounded-lg border bg-white dark:bg-[#041826] border-gray-200 dark:border-gray-800 p-4">
                        {/* weekday headers */}
                        <div className="grid grid-cols-7 text-xs text-gray-500 mb-3">
                            <div className="text-center">Mon</div>
                            <div className="text-center">Tue</div>
                            <div className="text-center">Wed</div>
                            <div className="text-center">Thu</div>
                            <div className="text-center">Fri</div>
                            <div className="text-center">Sat</div>
                            <div className="text-center">Sun</div>
                        </div>

                        {/* calendar grid */}
                        <div className="grid grid-cols-7 gap-0.5">
                            {weeks.map((week, wi) =>
                                week.map((day, di) => {
                                    const ymd = formatYMD(day);
                                    const inMonth = day.getMonth() === monthIndex;
                                    const info = aggregated[ymd];
                                    const bgClass =
                                        info?.pnl < 0
                                            ? "bg-cal-loss-20"
                                            : info?.pnl > 0
                                                ? "bg-cal-win-20"
                                                : inMonth
                                                    ? "bg-white dark:bg-[#051827]"
                                                    : "bg-gray-50 dark:bg-[#021018]/40";
                                    return (
                                        <div
                                            key={`${wi}-${di}`}
                                            onClick={() => setSelectedDay(ymd)}
                                            className={`min-h-[100px] p-3 rounded-lg border
                                                ${inMonth ? "border-gray-200 dark:border-gray-800 cursor-pointer" : "border-transparent"} 
                                                ${bgClass}
                                                ${ymd === todayYMD ? "ring-2 ring-[#5750F1] shadow-lg" : ""}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className={`text-sm font-medium ${inMonth ? "" : "text-gray-400"}`}>{day.getDate()}</div>
                                                <div className="text-xs text-gray-400">{/* placeholder for anything */}</div>
                                            </div>

                                            {/* content */}
                                            {info ? (
                                                <div className="mt-3 text-right">
                                                    <div className="flex items-center justify-end text-[14px]">
                                                        {info.trades} <BiTransfer />
                                                    </div>

                                                    <div className="mt-2 text-sm font-semibold">
                                                        <span className={info.pnl < 0 ? "text-rose-500" : "text-emerald-500"}>
                                                            {info.pnl < 0 ? `-$${Math.abs(info.pnl).toLocaleString()}.00` : `+$${info.pnl.toLocaleString()}.00`}
                                                        </span>
                                                    </div>

                                                </div>
                                            ) : (
                                                <div className="mt-4 text-xs text-gray-400">No trades</div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* weekly summary: 4/12 = 33.3% ~ 30% */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="rounded-lg border bg-white dark:bg-[#041826] border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3">
                        <h3 className="text-lg font-semibold">Weekly Summary</h3>
                        <div className="text-xs text-gray-400">Grouped by week (Mon - Sun)</div>

                        <div className="mt-3 space-y-2">
                            {weeklySummary.map((w) => (
                                <div key={w.index} className="rounded-md p-3 border bg-transparent flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Week {w.index}</div>
                                        <div className="text-xs text-gray-400">{w.label}</div>
                                    </div>

                                    <div className="text-right">
                                        {w.days ? (
                                            <>
                                                <div className={`${w.total < 0 ? "text-rose-500" : "text-emerald-500"} font-semibold`}>
                                                    {w.total < 0 ? `-$${Math.abs(w.total).toLocaleString()}` : `+$${w.total.toLocaleString()}`}
                                                </div>
                                                <div className="text-xs text-gray-400">{w.days} days</div>
                                            </>
                                        ) : (
                                            <div className="text-xs text-gray-400">No trades</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto text-xs text-gray-400">
                            Tip: Weeks with negative PnL are red — click a day for details.
                        </div>
                    </div>
                </div>
            </div>

            {/* selected day modal */}
            {selectedDay && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedDay(null)}
                >
                    <div
                        className="max-w-xl w-full bg-white dark:bg-[#071522] rounded-xl shadow-xl p-5 overflow-auto max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold">Day Details — {selectedDay}</h4>
                            <button className="text-sm text-gray-500" onClick={() => setSelectedDay(null)}>Close</button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {(aggregated[selectedDay]?.items || []).map((it, i) => (
                                <div key={i} className="p-3 rounded-lg border">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">{it.symbol}</div>
                                        <div className={`${it.pnl < 0 ? "text-rose-500" : "text-emerald-500"} font-semibold`}>{it.pnl < 0 ? `-$${Math.abs(it.pnl)}` : `+$${it.pnl}`}</div>
                                    </div>
                                </div>
                            ))}

                            {(!aggregated[selectedDay] || aggregated[selectedDay].items.length === 0) && (
                                <div className="text-sm text-gray-400">No trades for this day</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}