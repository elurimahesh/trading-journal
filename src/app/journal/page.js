'use client';
import React, { useEffect, useState } from "react";
import Loader from "../loading";
import TradeModal from "./modal";
import { IoEyeOutline, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { useAccounts } from "@/context/AccountsContext";
import moment from 'moment';

export default function Journal() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const [journal, setJournal] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [updateData, setUpdateData] = useState();
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [apiRecall, setApiRecall] = useState("");
  const [expandedId, setExpandedId] = useState(null); // mobile expand state

  const orderJournalData = journal.slice().sort((a, b) => b.tradeId - a.tradeId);
  const isLoading = accountsLoading || loadings;

  useEffect(() => {
    async function loadJournal() {
      try {
        const res = await fetch("/api/journal");
        if (!res.ok) throw new Error("Failed to fetch journal");
        const data = await res.json();
        setJournal(data.journal || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJournal();
  }, [apiRecall]);

  const handleView = (id) => {
    const record = journal.find((item) => item.id === id);
    setUpdateData(record);
    setViewModal(true);
  };

  const handleUpdate = (id) => {
    const record = journal.find((item) => item.id === id);
    setUpdateData(record);
    setUpdateModal(true);
  };

  const handleAdd = () => {
    setUpdateData();
    setAddModal(true);
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main container — no sidenav handling here (layout does it) */}
      <main className="w-full p-4 md:p-6 2xl:p-10 h-[calc(100vh-104px)] overflow-auto">
        <div className="p-2 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Trade Journal</h1>
            <button
              onClick={handleAdd}
              className="flex items-center cursor-pointer bg-[#5750F1] text-white font-semibold px-4 py-2 rounded hover:bg-[#5750F1]"
            >
              <IoAddCircleOutline size={22} /> &nbsp; Add
            </button>
          </div>

          {/* ===== MOBILE: Compact cards with expand (shown on md and below) ===== */}
          <section className="space-y-3 md:hidden">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse rounded-md border bg-gray-50 dark:bg-dark-3 p-3">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded" />
                    <div className="h-8 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            ) : orderJournalData.length === 0 ? (
              <div className="text-center text-gray-500 py-6">No journal records found.</div>
            ) : (
              orderJournalData.map(item => {
                const isBuy = item.position === 'buy';
                const profitPositive = Number(item.netPL) > 0;
                const accentColor = isBuy ? 'bg-[#16a34a]' : 'bg-[#ef4444]';
                const profitTextClass = profitPositive ? 'text-[#16a34a]' : 'text-[#ef4444]';

                return (
                  <div key={item.id} className="rounded-lg border overflow-hidden bg-white bg-dark-2 shadow-sm">
                    <div className="flex">
                      <div className={`w-1 ${accentColor}`}></div>

                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.symbol}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-300">{moment(item.date).format('Do MMM YY')}</span>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${isBuy ? 'bg-[#ECFDF5] text-[#16a34a]' : 'bg-[#FEF2F2] text-[#ef4444]'}`}>
                                {isBuy ? 'Buy' : 'Sell'}
                              </span>

                              <span className="text-xs text-gray-600 dark:text-gray-300">Lot: {item.lotSize}</span>

                              <span className={`ml-2 text-xs font-medium ${profitTextClass}`}>
                                {(Number.isFinite(Number(item.netPL)) ? Number(item.netPL).toFixed(2) : '-')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <IoEyeOutline size={18} className="cursor-pointer text-default" onClick={() => handleView(item.id)} />
                            <MdOutlineModeEdit size={18} className="cursor-pointer text-default" onClick={() => handleUpdate(item.id)} />
                            <button
                              onClick={() => toggleExpand(item.id)}
                              aria-expanded={expandedId === item.id}
                              className="ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-dark-3"
                              title="Toggle details"
                            >
                              {expandedId === item.id ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className={`mt-3 transition-all ${expandedId === item.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">Entry</span>
                              <span>{item.entryPrice ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Exit</span>
                              <span>{item.exitPrice ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">SL</span>
                              <span>{item.stopLoss ?? '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">TP</span>
                              <span>{item.takeProfit ?? '-'}</span>
                            </div>
                            {item.notes ? (
                              <div className="pt-2">
                                <div className="font-medium">Notes</div>
                                <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">{item.notes}</div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          {/* ===== DESKTOP/TABLET: Wide table (md and up) ===== */}
          <section className="mt-4 hidden md:block">
            <div className="relative w-full">
              <div className="overflow-x-auto rounded-md">
                <table className="w-full min-w-[900px] table-auto text-sm caption-bottom">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-none bg-[#F7F9FC] bg-dark-2">
                      <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Pair</th>
                      <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Date</th>
                      <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Position</th>
                      <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Lot Size</th>
                      <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Profit</th>
                      <th className="text-[white] h-12 px-4 text-middle align-middle font-bold min-w-[155px] xl:pl-7.5 py-4 w-60">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr className="border-b transition-colors hover:bg-dark-2 border-dark-3">
                        <td className="p-4 align-middle">
                          <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse"></div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="h-5 w-24 rounded-full bg-gray-200 animate-pulse"></div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="h-5 w-28 rounded-full bg-gray-200 animate-pulse"></div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="h-5 w-28 rounded-full bg-gray-200 animate-pulse"></div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="h-5 w-28 rounded-full bg-gray-200 animate-pulse"></div>
                        </td>
                      </tr>
                    ) : orderJournalData.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-6 text-gray-500">No journal records found.</td></tr>
                    ) : (
                      orderJournalData.map((item) => (
                        <tr key={item.id} className="border-b transition-colors hover:bg-dark-2 border-dark-3">
                          <td className="p-4 align-middle">{item.symbol}</td>
                          <td className="p-4 align-middle">{moment(item.date).format("Do MMM YY")}</td>
                          <td className="p-4 align-middle">
                            <span className={`max-w-fit rounded-full px-3.5 py-1 text-sm font-medium ${item.position === "buy" ? "bg-[#219653]/[0.08] text-[#219653]" : "bg-[#D34053]/[0.08] text-[#D34053]"}`}>
                              {item.position === "buy" ? "Buy" : "Sell"}
                            </span>
                          </td>
                          <td className="p-4 align-middle">{item.lotSize}</td>
                          <td className="p-4 align-middle">
                            <span className={`${item.netPL > 0 ? "text-[#46cd7c]" : "text-[#eb483f]"}`}>
                              {(Number.isFinite(Number(item.netPL)) ? Number(item.netPL).toFixed(2) : '-')}
                            </span>
                          </td>
                          <td className="p-4 align-middle flex items-center justify-center gap-x-3.5">
                            <IoEyeOutline size={20} className="cursor-pointer text-default" onClick={() => handleView(item.id)} />
                            <MdOutlineModeEdit size={20} onClick={() => handleUpdate(item.id)} className="cursor-pointer text-default ml-3" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      <TradeModal
        updateData={updateData}
        accountsData={accounts}
        addShow={addModal}
        updateShow={updateModal}
        viewShow={viewModal}
        onAddHide={() => setAddModal(false)}
        onUpdateHide={() => setUpdateModal(false)}
        onViewHide={() => setViewModal(false)}
        setLoading={(val) => setLoading(val)}
        setApiRecall={(val) => setApiRecall(val)}
      />
    </div>
  );
}