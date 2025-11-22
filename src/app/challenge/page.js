"use client";

import React, { useMemo } from "react";
import Layout from "@/components/Layouts/Layout";
import Loader from "../loading";
import { useAccounts } from "@/context/AccountsContext";

export default function Challenge() {
  const { accounts, loading } = useAccounts();

  const rawStepsData = [
    { step: 1, lot_size: 0.01, target_pips: 60, profit: "6", balance: "106" },
    { step: 2, lot_size: 0.02, target_pips: 60, profit: "12", balance: "118" },
    { step: 3, lot_size: 0.05, target_pips: 60, profit: "30", balance: "148" },
    { step: 4, lot_size: 0.10, target_pips: 60, profit: "60", balance: "208" },
    { step: 5, lot_size: 0.20, target_pips: 60, profit: "120", balance: "328" },
    { step: 6, lot_size: 0.40, target_pips: 60, profit: "240", balance: "568" },
    { step: 7, lot_size: 0.80, target_pips: 60, profit: "480", balance: "1,048" },
    { step: 8, lot_size: 1.50, target_pips: 60, profit: "900", balance: "1,948" },
    { step: 9, lot_size: 2.00, target_pips: 60, profit: "1,200", balance: "3,148" },
    { step: 10, lot_size: 3.00, target_pips: 60, profit: "1,800", balance: "4,948" },
    { step: 11, lot_size: 4.00, target_pips: 60, profit: "2,400", balance: "7,348" },
    { step: 12, lot_size: 6.00, target_pips: 60, profit: "3,600", balance: "10,948" },
    { step: 13, lot_size: 10.00, target_pips: 60, profit: "6,000", balance: "16,948" },
    { step: 14, lot_size: 15.00, target_pips: 60, profit: "9,000", balance: "25,948" },
    { step: 15, lot_size: 20.00, target_pips: 60, profit: "12,000", balance: "37,948" },
    { step: 16, lot_size: 30.00, target_pips: 60, profit: "18,000", balance: "55,948" },
    { step: 17, lot_size: 50.00, target_pips: 60, profit: "30,000", balance: "85,948" },
    { step: 18, lot_size: 60.00, target_pips: 60, profit: "36,000", balance: "1,21,948" }
  ];

  // helper: safe parse money-like strings
  function parseMoneySafe(raw) {
    if (typeof raw === "number") return raw;
    if (!raw) return 0;
    const cleaned = String(raw).replace(/,/g, "").replace(/[^\d.-]/g, "");
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : n;
  }

  // normalize steps with numeric balances
  const stepsData = useMemo(
    () => rawStepsData.map(s => ({ ...s, balanceNum: parseMoneySafe(s.balance) })),
    []
  );

  // keep your original status logic (unchanged)
  function getStepsWithStatus(currentBalance) {
    const startBalance = 100;
    if (currentBalance >= stepsData[stepsData.length - 1].balanceNum) {
      return stepsData.map(s => ({ ...s, status: "done" }));
    }
    if (currentBalance < startBalance) {
      return stepsData.map((s, idx) => ({ ...s, status: idx === 0 ? "loss" : "not-started" }));
    }
    const activeIndex = stepsData.findIndex(s => currentBalance < s.balanceNum);
    if (activeIndex === -1) return stepsData.map(s => ({ ...s, status: "done" }));
    return stepsData.map((s, idx) => {
      if (idx < activeIndex) return { ...s, status: "done" };
      if (idx === activeIndex) {
        const prev = idx === 0 ? startBalance : stepsData[idx - 1].balanceNum;
        if (currentBalance < prev) return { ...s, status: "loss" };
        return { ...s, status: "in-progress" };
      }
      return { ...s, status: "not-started" };
    });
  }

  // format utilities
  const formatMoney = (val) => {
    if (val === undefined || val === null) return "-";
    const n = typeof val === "number" ? val : parseMoneySafe(val);
    return n >= 1000 ? n.toLocaleString() : String(n);
  };

  function statusBadgeClass(status) {
    switch (status) {
      case "done": return "bg-emerald-100 text-emerald-700";
      case "in-progress": return "bg-amber-100 text-amber-700";
      case "loss": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-600";
    }
  }
  function statusBadgeText(status) {
    switch (status) {
      case "done": return "Done";
      case "in-progress": return "In progress";
      case "loss": return "Loss";
      default: return "Not started";
    }
  }

  // current balance safe
  const currentBalance = useMemo(() => parseMoneySafe(accounts?.currentBalance), [accounts]);

  // steps with status and per-step fraction
  const stepsWithProgress = useMemo(() => {
    const steps = getStepsWithStatus(currentBalance);
    return steps.map((s, idx) => {
      const prev = idx === 0 ? 100 : steps[idx - 1].balanceNum || 100;
      const next = s.balanceNum;
      let fraction = 0;
      if (s.status === "done") fraction = 1;
      else if (s.status === "in-progress") {
        fraction = next === prev ? (currentBalance >= next ? 1 : 0) : (currentBalance - prev) / (next - prev);
      } else fraction = 0;
      fraction = Math.max(0, Math.min(1, fraction));
      return { ...s, prev, next, fraction };
    });
  }, [currentBalance]);

  // header totals
  const totals = useMemo(() => {
    const total = stepsWithProgress.length;
    const done = stepsWithProgress.filter(s => s.status === "done").length;
    const inProg = stepsWithProgress.filter(s => s.status === "in-progress").length;
    const remaining = total - done;
    const next = stepsWithProgress.find(s => s.status !== "done");
    const percent = Math.round(((done + inProg * 0.5) / total) * 100);
    return { total, done, inProg, remaining, next, percent };
  }, [stepsWithProgress]);

  if (loading) return <Loader />;

  // Circular ring component (compact)
  function CircleRing({ fraction = 0, status = "not-started", size = 56, stroke = 6 }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - fraction);
    const base = "rgba(255,255,255,0.06)";
    let color = "#94a3b8";
    if (status === "done") color = "#10B981";
    if (status === "in-progress") color = "#F59E0B";
    if (status === "loss") color = "#EF4444";
    return (
      <div className="relative w-[56px] h-[56px] flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} stroke={base} strokeWidth={stroke} fill="none" strokeLinecap="butt" />
          <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="butt"
            transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dashoffset 400ms ease" }} />
        </svg>
        <div className="absolute text-center">
          {status === "done" ? <div className="text-sm font-semibold text-emerald-500">✓</div>
            : status === "loss" ? <div className="text-sm font-semibold text-rose-500">✕</div>
            : <div className="text-sm font-semibold text-white">{Math.round(fraction * 100)}%</div>}
        </div>
      </div>
    );
  }

  return (
      <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10 h-[calc(100vh-104px)] overflow-auto">
        {/* top area */}
        <div className="flex items-start justify-between gap-4 mb-6">
          {/* left: title / initial */}
          <div className="flex items-start gap-4">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">Challenge • $100,000</h1>
              <p className="text-sm text-gray-400 mt-1">Initial Balance: <span className="font-semibold text-white">100 USD</span></p>
              <div className="mt-3 text-xs text-gray-400">
                Completed: <span className="font-semibold text-white">{totals.done}</span> &middot; Remaining: <span className="font-semibold text-white">{totals.remaining}</span>
              </div>
            </div>
          </div>

          {/* right: overall progress */}
          <div className="w-72">
            <div className="text-sm text-gray-400 mb-2">Overall Progress</div>
            <div className="h-3 rounded-full bg-gray-800/40 overflow-hidden">
              <div style={{ width: `${totals.percent}%` }} className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-[#7C3AED]"></div>
            </div>
            <div className="text-right text-xs text-gray-400 mt-2">{totals.percent}%</div>
            <div className="mt-2 text-xs text-gray-400">Next target: <span className="font-semibold text-white">{totals.next ? formatMoney(totals.next.balanceNum) + " USD" : "—"}</span></div>
          </div>
        </div>

        {/* grid blocks: responsive (xl:5, lg:4, md:3, sm:2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {stepsWithProgress.map(item => {
            const ringStatus = item.status === "not-started" ? "not-started" : item.status;
            const border = item.status === "done" ? "border-emerald-700/20" :
              item.status === "in-progress" ? "border-amber-700/20" :
              item.status === "loss" ? "border-rose-700/20" : "border-white/6";

            return (
              <div key={item.step} className={`relative rounded-xl p-4 bg-gradient-to-b from-[#061119] to-[#04101a] border ${border} shadow-sm flex flex-col`}>
                {/* top row: ring + meta */}
                <div className="flex items-center gap-3">
                  <CircleRing fraction={item.fraction} status={ringStatus} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">Step {item.step}</div>
                      <div className="text-xs text-gray-400">• Lot {item.lot_size}</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate">{item.profit} $ / trade • {item.target_pips} pips</div>
                  </div>
                </div>

                {/* middle: numbers */}
                <div className="mt-3 flex items-center justify-between">

                  <div className="text-left">
                    <div className="text-xs text-gray-400">Target Balance</div>
                    <div className="text-sm font-semibold">{formatMoney(item.balance)} USD</div>
                  </div>
                </div>

                {/* bottom: status badge */}
                <div className="mt-3 flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass(item.status)}`}>
                    {statusBadgeText(item.status)}
                  </div>

                  <div className="text-xs text-gray-400">
                    {item.status === "in-progress" ? `${Math.round(item.fraction * 100)}% to target` :
                      item.status === "done" ? "Completed" :
                      item.status === "loss" ? "Marked loss" : "Not started"}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
  );
}