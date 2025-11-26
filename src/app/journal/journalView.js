'use client';

import { useState } from "react";
import { RiExternalLinkLine } from "react-icons/ri";
import moment from 'moment';

export default function JournalView(props) {
    const journalData = props.data.updateData;
    console.log("props", journalData);
    const emotionMap = {
        confident: "😎",
        neutral: "🙂",
        fear: "😰",
        angry: "😡",
        greedy: "🤑",
    };
    const mistakeMap = {
        none: "No Mistake",
        exit_early: "Exited Early (Fear)",
        move_tp_be: "Moved TP to Break-Even",
        fear_sl: "Fear of SL Hit",
      };

    const trade = {
        symbol: journalData?.symbol,
        position: journalData?.position === "buy" ? "Buy" : "Sell",
        entryPrice: journalData?.entryPrice,
        exitPrice: journalData?.exitPrice,
        entryTime: moment(journalData?.date).format("Do MMM YY") + " " + journalData?.entryTime,
        exitTime: moment(journalData?.date).format("Do MMM YY") + " " + journalData?.exitTime,
        duration: journalData?.duration,
        lotSize: journalData?.lotSize,
        session: journalData?.session,
        risk: journalData?.risk,
        rR: journalData?.rR,
        grossPL: journalData?.pL,
        netPL: journalData?.netPL,
        balance: journalData?.balance + " USD",
        fees: journalData?.fees + " USD",
        outcome: journalData?.outcome,
        result: journalData?.result,
        remarks: journalData?.remarks,
        snapshotLink: journalData?.charts,
        date: moment(journalData?.date).format("Do MMM YY"),
        // optional mistakes array; keep empty if you don't want it shown
        mistakes: journalData?.mistake,
        emotion: journalData?.emotion
    };


    const positive = trade.netPL.startsWith("");
    /* small subcomponents (kept minimal & non-repetitive) */

    function Badge({ position = "Buy" }) {
        const buy = position.toLowerCase() === "buy";
        return (
            <div className={`px-3 py-1 rounded-md font-semibold text-sm ${buy ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                <svg className="inline w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={buy ? "M12 19V6M5 12l7-6 7 6" : "M12 5v13M19 12l-7 6-7-6"} /></svg>
                {position.toUpperCase()}
            </div>
        );
    }

    function Chip({ label = "", tone = "default" }) {
        const base = "px-3 py-1 rounded-full text-xs font-medium";
        const style = tone === "muted" ? "bg-gray-100 dark:bg-gray-800 text-gray-500" : tone === "danger" ? "bg-rose-100 text-rose-600" : "bg-[#eef2ff] dark:bg-[#043046] text-[#07304a] dark:text-white";
        return <div className={`${base} ${style}`}>{label}</div>;
    }

    function Metric({ title, value, color = "neutral", tone }) {
        const colors = { green: "text-emerald-400", red: "text-rose-400", neutral: "text-gray-200" };
        const bg = "p-3 rounded-lg bg-gray-50 dark:bg-[#021826] border border-gray-100 dark:border-gray-800";
        return (
            <div className={bg}>
                <div className="text-xs text-gray-400">{title}</div>
                <div className={`text-lg font-semibold ${colors[color]}`}>{value}</div>
            </div>
        );
    }

    function Marker({ left = "10%", label = "", color = "sky" }) {
        const colorMap = { sky: "bg-sky-400", indigo: "bg-indigo-400" };
        return (
            <div className="absolute -top-2" style={{ left }}>
                <div className={`w-2 h-6 ${colorMap[color]} rounded-sm`} />
                <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed left-0 top-0 z-99999 flex h-screen w-full items-center justify-center bg-[#111928]/70 px-4 py-5">
                <div className="max-h-[98vh] w-full max-w-6xl overflow-clip overflow-y-auto rounded-xl">
                    <div className="relative m-auto rounded-xl border border-stroke bg-gray-2 p-4 shadow-3 border-dark-3 bg-gray-dark shadow-card sm:p-8 xl:p-10">
                        <div className="max-w-5xl mx-auto p-6 rounded-2xl bg-white dark:bg-[#051622] shadow-lg border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                            {/* header */}
                            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <Badge position={trade.position} />
                                    <div>
                                        <h3 className="text-2xl font-extrabold tracking-tight">{trade.symbol}</h3>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{trade.date} • {trade.session} • {trade.duration}</div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${positive ? "bg-emerald-600/10 text-emerald-300" : "bg-rose-600/10 text-rose-300"}`}>
                                        <span className="text-sm">{trade.netPL > 0 ? "+" : ""}{trade.netPL} usd</span>
                                        <span className="text-xs text-gray-400">Net P/L</span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400">Balance: <span className="font-medium text-gray-800 dark:text-gray-100">{trade.balance}</span></div>
                                </div>
                            </div>

                            {/* main grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                {/* Left: core flow and notes */}
                                <div className="md:col-span-2 rounded-xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-[#061827]">
                                    {/* chips row */}
                                    <div className="flex flex-wrap gap-2">
                                        <Chip label={`Entry ${trade.entryPrice}`} />
                                        <Chip label={`Exit ${trade.exitPrice}`} />
                                        <Chip label={`Lot ${trade.lotSize}`} />
                                        <Chip label={trade.session} tone="muted" />
                                        <Chip label={`Mistakes: ${mistakeMap[trade.mistakes] || "—"}`} tone="danger" />
                                    </div>

                                    {/* compact metrics */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                        <Metric title="R:R" value={trade.rR} />
                                        <Metric title="Gross P/L" value={trade.grossPL > 0 ? `+${trade.grossPL} usd` : `${trade.grossPL} usd`} color={positive ? "green" : "red"} />
                                        <Metric title="Fees" value={trade.fees} tone="muted" />
                                        <Metric title="Outcome" value={trade.outcome} tone="muted" />
                                    </div>

                                    {/* timeline */}
                                    <div className="mt-5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium">Timeline</div>
                                            <div className="text-xs text-gray-400">{trade.entryTime} → {trade.exitTime} • {trade.duration}</div>
                                        </div>

                                        <div className="relative mt-3">
                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                            <Marker left="8%" label="Entry" color="sky" />
                                            <Marker left="68%" label="Exit" color="indigo" />
                                        </div>
                                    </div>

                                    {/* notes */}
                                    <div className="mt-5 p-4 rounded-lg bg-gray-50 dark:bg-[#021826] border border-gray-100 dark:border-gray-800">
                                        <div className="text-xs text-gray-400">Reason / Notes</div>
                                        <div className="mt-2 text-sm">{trade.remarks}</div>
                                    </div>

                                    {/* actions */}
                                    <div className="mt-4 flex items-center gap-3">
                                        <a href={trade.snapshotLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-[#5b4ff0] to-[#2fb1ff] text-white font-semibold">
                                            Chart <RiExternalLinkLine />
                                        </a>


                                    </div>
                                </div>

                                {/* Right: quick overview */}
                                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-[#041826] flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-gray-400">Entry</div>
                                            <div className="text-lg font-semibold">{trade.entryPrice}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Exit</div>
                                            <div className="text-lg font-semibold">{trade.exitPrice}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-gray-400">Lot</div>
                                            <div className="font-semibold">{trade.lotSize}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Risk</div>
                                            <div className="font-semibold">{trade.risk}</div>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                        <div className="text-xs text-gray-400">Net P/L</div>
                                        <div className={`mt-1 text-2xl font-bold ${positive ? "text-emerald-400" : "text-rose-400"}`}>{trade.netPL > 0 ? "+" : ""}{trade.netPL} usd</div>
                                    </div>

                                    <div className="flex items-center justify-center text-[80px]">

                                        {emotionMap[trade.emotion] || "🙂"}


                                    </div>
                                    <div className="mt-auto text-xs text-gray-400">
                                        <div>Recorded: {trade.date}</div>
                                        <div className="mt-1">Status: {trade.result}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={props.data.onViewHide}
                            className="absolute top-3 right-3 cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <div className="flex items-center justify-between mt-2">
                            <div>

                            </div>
                            <button
                                onClick={props.data.onViewHide}
                                className="mt-2 bg-[#5750F1] cursor-pointer text-white font-semibold px-4 py-2 rounded hover:bg-[#5750F1]"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>
            </div>

        </>
    );
}
