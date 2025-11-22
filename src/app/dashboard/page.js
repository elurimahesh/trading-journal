'use client';
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layouts/Layout";
import { BsBarChartLineFill } from "react-icons/bs";
import { RiMoneyRupeeCircleFill, RiDiscountPercentFill } from "react-icons/ri";
import Loader from "../loading";
import { useAccounts } from "@/context/AccountsContext";
import DashboardPerformanceCard from "./components/Card1Performance";
import BehavioralBiasCard from "./components/BehaviourCard";
import TradingDayPerformanceCard from "./components/TradingDayPerformanceCard";
import ProfitabilityCard from "./components/ProfitabilityCard";
import StepChallengeCard from "./components/StepChallangeCard";
import CalendarDailySummary from "./components/CalanderView";


export default function Dashboard() {
  const { accounts, loading, error } = useAccounts();
  const [journal, setJournal] = useState([]);
  const [loadings, setLoading] = useState(true);

  console.log("accounts", accounts);

  useEffect(() => {

    async function loadJournal() {
      try {
        const res = await fetch("/api/journal");
        if (!res.ok) throw new Error("Failed to fetch journal");

        const data = await res.json();
        console.log("journal", data);
        setJournal(data.journal || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    loadJournal();
  }, []);

  return (
    <div>
      <div className="mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10 h-[calc(100vh-104px)] overflow-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5">
          <div className="rounded-[10px] p-7 shadow-1 bg-gray-dark">

            <DashboardPerformanceCard journal={journal} accounts={accounts}/>


          </div>

          <div className="rounded-[10px] shadow-1 bg-gray-dark">
            <BehavioralBiasCard journal={journal} accounts={accounts}/>

          </div>

          <div className="rounded-[10px] p-7 shadow-1 bg-gray-dark">

            <TradingDayPerformanceCard journal={journal} accounts={accounts}/>

          </div>
        </div>
        <div className="mt-10">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[10px] p-7 shadow-1 bg-gray-dark">
              <StepChallengeCard journal={journal} accounts={accounts}/>
            </div>
            <div className="rounded-[10px] p-7 shadow-1 bg-gray-dark">
              <ProfitabilityCard journal={journal} accounts={accounts}/>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="grid gap-4 md:grid-cols-1">
            <div className="rounded-[10px] p-7 shadow-1 bg-gray-dark">
              <CalendarDailySummary journal={journal} accounts={accounts}/>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
