'use client';

import React, { useEffect, useState } from "react";
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
  ]

  const stepsData = rawStepsData.map((step) => ({
    ...step,
    balanceNum: Number(String(step.balance).replace(/,/g, "")), //  "1,500" -> 1500
  }));

  function getSafeCurrentBalance(raw) {
    if (typeof raw === "number") return raw;
    if (!raw) return 0;
  
    const cleaned = String(raw).replace(/,/g, "").replace(/[^\d.-]/g, "");
    const num = parseFloat(cleaned);
    return Number.isNaN(num) ? 0 : num;
  }
  
  function getStepsWithStatus(currentBalance) {
    const startBalance = 100;
  
    // Above final target → all done
    if (currentBalance >= stepsData[stepsData.length - 1].balanceNum) {
      return stepsData.map((step) => ({ ...step, status: "done" }));
    }
  
    // Below starting balance → first step "loss", rest "not-started"
    if (currentBalance < startBalance) {
      return stepsData.map((step, index) => ({
        ...step,
        status: index === 0 ? "loss" : "not-started",
      }));
    }
  
    // Find active step = first step where we haven't reached target
    const activeIndex = stepsData.findIndex(
      (step) => currentBalance < step.balanceNum
    );
  
    if (activeIndex === -1) {
      return stepsData.map((step) => ({ ...step, status: "done" }));
    }
  
    return stepsData.map((step, index) => {
      if (index < activeIndex) {
        // completed steps
        return { ...step, status: "done" };
      }
  
      if (index === activeIndex) {
        const previousBalance =
          index === 0 ? startBalance : stepsData[index - 1].balanceNum;
  
        if (currentBalance < previousBalance) {
          return { ...step, status: "loss" };
        }
  
        return { ...step, status: "in-progress" };
      }
  
      // future steps
      return { ...step, status: "not-started" };
    });
  }
  
  function statusBadgeClass(status) {
    switch (status) {
      case "done":
        return "bg-green-500/10 text-green-500";
      case "in-progress":
        return "bg-[#ffe535]/10 text-[#ffe535]";
      case "loss":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  }
  
  function statusBadgeText(status) {
    switch (status) {
      case "done":
        return "Done";
      case "in-progress":
        return "In progress";
      case "loss":
        return "Loss";
      default:
        return "Not started";
    }
  }
  const currentBalance = getSafeCurrentBalance(accounts?.currentBalance);
  const stepsWithStatus = getStepsWithStatus(currentBalance);

  return (
    <div className="mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Challange $1,00,000</h1>
          <h3 className="font-bold text-lg">Initial Balance: 100 usd</h3>
        </div>
        <br />
        <div className="rounded-[10px] p-4 shadow-1 bg-gray-dark shadow-card sm:p-7.5">
          <div className="relative w-full overflow-auto h-140">
            <table className="w-full caption-bottom text-base">
              <thead className="[&_tr]:border-b">
                <tr className="border-none bg-[#F7F9FC] bg-dark-2">
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">
                    steps
                  </th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">
                    Lot Size
                  </th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">
                    Target Pips
                  </th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">
                    Profit Per Trade($)
                  </th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">
                    Balance
                  </th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {
                  stepsWithStatus.map((item) => (
                    <tr className="border-b transition-colors hover:bg-dark-2 border-dark-3" key={item.step}>
                      <td className="p-4 align-middle min-w-[155px] xl:pl-7.5">{item.step}</td>
                      <td className="p-4 align-middle xl:pl-7.5">{item.lot_size}</td>
                      <td className="p-4 align-middle xl:pl-7.5">{item.target_pips}</td>
                      <td className="p-4 align-middle xl:pl-7.5">{item.profit}</td>
                      <td className="p-4 align-middle xl:pl-7.5">{item.balance}</td>
                      <td className="p-4 align-middle xl:pl-7.5"> <span
                        className={`px-3 py-1 rounded-full font-medium ${statusBadgeClass(
                          item.status
                        )}`}
                      >
                        {statusBadgeText(item.status)}
                      </span></td>
                    </tr>
                  ))
                }


              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
