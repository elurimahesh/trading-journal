'use client';
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layouts/Layout";
import { BsBarChartLineFill } from "react-icons/bs";
import { RiMoneyRupeeCircleFill, RiDiscountPercentFill } from "react-icons/ri";
import Loader from "../loading";
import { useAccounts } from "@/context/AccountsContext";


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

  const profitPercent = accounts ? (((accounts?.currentBalance - accounts?.initialBalance) / accounts?.initialBalance) * 100).toFixed(2) : 0
  return (
    <div>
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5">
          <div className="rounded-[10px] p-10 shadow-1 bg-gray-dark">

            <BsBarChartLineFill className="text-blue-600" size={32} />

            <h4 className="mb-2 mt-5 text-lg c-color font-medium">Total Trades</h4>
            {
              loadings || loading ? <div className="h-5 w-60 rounded-full bg-gray-200 animate-pulse"></div> :

                <h3 className="mb-2 text-heading-6 text-2xl font-bold text-dark dark:text-white">{journal.length}</h3>
            }



          </div>

          <div className="rounded-[10px] p-10 shadow-1 bg-gray-dark">

            <RiMoneyRupeeCircleFill className="text-green-600" size={32} />

            <h4 className="mb-2 mt-5 text-lg c-color font-medium">Total Profit</h4>
            {
              loadings || loading ? <div className="h-5 w-60 rounded-full bg-gray-200 animate-pulse"></div> :
                <h3 className="mb-2 text-heading-6 text-2xl font-bold text-dark dark:text-white">{accounts?.currentBalance} usd</h3>
            }

          </div>

          <div className="rounded-[10px] p-10 shadow-1 bg-gray-dark">

            <RiDiscountPercentFill className="text-yellow-500" size={32} />

            <h4 className="mb-2 mt-5 text-lg c-color font-medium">Win Ratio</h4>
            {
              loadings || loading ? <div className="h-5 w-60 rounded-full bg-gray-200 animate-pulse"></div> :
                <h3 className={`mb-2 text-heading-6 text-2xl font-bold ${profitPercent >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                  {profitPercent}%
                </h3>
            }

          </div>
        </div>
      </div>
    </div>
  );
}
