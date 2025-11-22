'use client';
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layouts/Layout";
import Loader from "../loading";
import TradeModal from "./modal";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { useAccounts } from "@/context/AccountsContext";
import { IoAddCircleOutline } from "react-icons/io5";
import moment from 'moment';

export default function Journal() {
  const { accounts, loading, error } = useAccounts();
  const [journal, setJournal] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [updateData, setUpdateData] = useState();
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [apiRecall, setApiRecall] = useState("");
  console.log("journal", journal);
  const orderJournalData = journal.slice().sort((a, b) => b.tradeId - a.tradeId);
  console.log("data===>", orderJournalData);

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
  }, [apiRecall]);

  const handleView = (id) => {
    const record = journal.find((item) => item.id === id);
    console.log("record", record);
    setUpdateData(record);
    setViewModal(true);
  }

  const handleUpdate = (id) => {
    const record = journal.find((item) => item.id === id);
    console.log("record", record);
    setUpdateData(record);
    setUpdateModal(true);
  }
  const handleAdd = () => {
    setUpdateData();
    setAddModal(true);
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
        <div className="p-6">
          {/* Header with title and button */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Trade Journal</h1>
            <button
              onClick={() => handleAdd()}
              className="flex item-center cursor-pointer bg-[#5750F1] text-white font-semibold px-4 py-2 rounded hover:bg-[#5750F1]">
                <IoAddCircleOutline size={22}/> &nbsp;
              Add
            </button>
          </div>

          {/* Table */}
          <div className="relative w-full overflow-auto h-140">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-none bg-[#F7F9FC] bg-dark-2">
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Pair</th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Date</th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Position</th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Lot Size</th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4">Profit (%)</th>
                  <th className="text-[white] h-12 px-4 text-left align-middle font-bold min-w-[155px] xl:pl-7.5 py-4 w-60">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading || loadings ?
                    <tr className="border-b transition-colors hover:bg-dark-2 border-dark-3">
                      <td className="p-4 align-middle xl:pl-7.5">
                        <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse"></div>
                      </td>
                      <td className="p-4 align-middle xl:pl-7.5">
                        <div className="h-5 w-24 rounded-full bg-gray-200 animate-pulse"></div>
                      </td>
                      <td className="p-4 align-middle xl:pl-7.5">
                        <div className="h-5 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                      </td>
                      <td className="p-4 align-middle xl:pl-7.5">
                        <div className="h-5 w-28 rounded-full bg-gray-200 animate-pulse"></div>
                      </td>
                      <td className="p-4 align-middle xl:pl-7.5">
                        <div className="h-5 w-28 rounded-full bg-gray-200 animate-pulse"></div>
                      </td>
                      <td className="p-4 align-middle xl:pl-7.5">
                        <div className="h-5 w-28 rounded-full bg-gray-200 animate-pulse"></div>
                      </td>
                    </tr>
                    : orderJournalData.map((item) => (
                      <tr key={item.id} className="border-b transition-colors hover:bg-dark-2 border-dark-3">
                        <td className="p-4 align-middle xl:pl-7.5">{item.symbol}</td>
                        <td className="p-4 align-middle xl:pl-7.5">{moment(item.date).format("Do MMM YY")}</td>
                        <td className="p-4 align-middle xl:pl-7.5">
                          <span className={`max-w-fit rounded-full px-3.5 py-1 text-sm font-medium ${item.position === "buy"
                            ? "bg-[#219653]/[0.08] text-[#219653]"
                            : "bg-[#D34053]/[0.08] text-[#D34053]"
                            }`}>{item.position === "buy" ? "Buy" : "Sell"}</span>
                        </td>
                        <td className="p-4 align-middle xl:pl-7.5">{item.lotSize}</td>
                        <td className="p-4 align-middle xl:pl-7.5">
                          <span className={`${item.netPL > 0 ? "text-[#46cd7c]" : "text-[#eb483f]"}`}>
                           {(Number.isFinite(Number(item.netPL)) ? Number(item.netPL).toFixed(2) : '-')}

                          </span></td>
                        <td className="p-4 align-middle xl:pl-7.5 flex items-center justify-right gap-x-3.5">
                          {/* <button
                      onClick={() => handleView(item.id)}
                      className="cursor-pointer w-20 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button> */}
                          <IoEyeOutline
                            size={20}
                            className="cursor-pointer text-default"
                            onClick={() => handleView(item.id)}
                          />
                          <MdOutlineModeEdit
                            size={20}
                            onClick={() => handleUpdate(item.id)}
                            className="cursor-pointer text-default ml-3"
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
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
