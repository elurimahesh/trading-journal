'use client';
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layouts/Layout";
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from "sweetalert2";

export default function AddUpdate(props) {
    const tradeRecord = props.data.updateData;
    console.log("test", tradeRecord)
    async function updateTradeRecord(data) {
        props.data.setLoading(true);
        try {
            const response = await fetch('/api/journal', {  // replace with your API URL
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                Swal.fire("Done!", "Record Updated Successfully!", "success");
                props.data.setApiRecall("1");
            }
        } catch (error) {
            console.error('API create failed:', error);
            Swal.fire("Done!", error, "error");
        } finally {
            props.data.setLoading(false);
        }
    }
    async function createTradeRecord(data) {
        props.data.setLoading(true);
        try {
            const response = await fetch('/api/journal', {  // replace with your API URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                Swal.fire("Done!", "Record Created Successfully!", "success");
                props.data.setApiRecall("1");
            }
        } catch (error) {
            console.error('API create failed:', error);
            Swal.fire("Done!", error, "error");
        } finally {
            props.data.setLoading(false);
        }
    }
    function calculateDuration(entryTime, exitTime) {
        // Parse HH:mm:ss strings to Date objects on the same day
        const today = new Date().toISOString().split('T')[0]; // get YYYY-MM-DD string

        const entryDate = new Date(`${today}T${entryTime}`);
        const exitDate = new Date(`${today}T${exitTime}`);

        // Calculate difference in milliseconds
        let diffMs = exitDate - entryDate;

        // If exit is before entry (crosses midnight), add 24h
        if (diffMs < 0) {
            diffMs += 24 * 60 * 60 * 1000;
        }

        // Convert milliseconds to h, m, s
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

        // Format duration string (e.g. 2h 30m 15s)
        const durationStr = `${diffHrs}h ${diffMins}m ${diffSecs}s`;

        return durationStr;
    }
    function getSessionFromTime(entryTime) {
        if (!entryTime || typeof entryTime !== "string") return "Asian";
      
        const parts = entryTime.split(":").map(p => parseInt(p, 10));
        if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return "Asian";
      
        const h = parts[0];
        const m = parts[1];
        const minuteOfDay = h * 60 + m;
      
        // session ranges (IST)
        const inRange = (sH, sM, eH, eM) => {
          const s = sH * 60 + sM;
          const e = eH * 60 + eM;
          if (s <= e) return minuteOfDay >= s && minuteOfDay <= e;
          return minuteOfDay >= s || minuteOfDay <= e; // cross-midnight
        };
      
        const isAsian   = inRange(5, 30, 14, 30);
        const isLondon  = inRange(12, 30, 21, 30);
        const isNewYork = inRange(17, 30, 2, 30);
      
        // Overlap priority → NY > London > Asian
        if (isNewYork) return "New York";
        if (isLondon) return "London";
        return "Asian";   // fallback — NO "Other"
      }
      
    const handleSubmitAdd = (data) => {
        const netPlCal = data.profit - data.fee
        const formData = {
            remarks: data.remarks,
            lotSize: data.lotSize,
            entryTime: data.entryTime,
            duration: calculateDuration(data.entryTime, data.exitTime),
            session: getSessionFromTime(data.entryTime),
            outcome: netPlCal > 0 ? "Winner" : netPlCal < 0 ? "Loser" : "Neutral",
            balance: props.data.accountsData.currentBalance + netPlCal,
            fees: data.fee,
            charts: data.chart,
            entryPrice: data.entryPrice,
            symbol: data.pair,
            exitTime: data.exitTime,
            risk: data.risk,
            result: data.netPlCal > 0 ? "Win" : "Loss",
            rR: data.risk ? (Math.abs(data.pL) / data.risk).toFixed(2) : "0",
            exitPrice: data.exitPrice,
            netPL: netPlCal,
            pL: data.pL,
            date: data.date,
            position: data.position,
            emotion: data.emotion,
            mistake: data.mistake
        }
        props.data.onAddHide();
        createTradeRecord(formData);
    }
    const handleSubmitUpdate = (data) => {
        console.log("data", data);
        const netPlCal = data.profit - data.fee
        const formData = {
            remarks: data.remarks,
            lotSize: data.lotSize,
            entryTime: data.entryTime,
            duration: calculateDuration(data.entryTime, data.exitTime),
            session: data.session,
            outcome: data.outcome,
            balance: props.data.accountsData.currentBalance + netPlCal,
            fees: data.fee,
            charts: data.chart,
            entryPrice: data.entryPrice,
            symbol: data.pair,
            exitTime: data.exitTime,
            risk: data.risk,
            result: data.netPlCal > 0 ? "Win" : "Loss",
            rR: data.rR,
            exitPrice: data.exitPrice,
            netPL: netPlCal,
            pL: data.profit,
            date: data.date,
            position: data.position,
            pageId: tradeRecord.id
        }
        console.log("form", formData);
        props.data.onUpdateHide();
        updateTradeRecord(formData);
    }
    console.log("data", props);
    return (
        <div className="fixed left-0 top-0 z-99999 flex h-screen w-full justify-center bg-[#111928]/70 px-4 py-5">
            <div className="max-h-[98vh] w-full max-w-[730px] overflow-clip overflow-y-auto rounded-xl">
                <div className="relative m-auto rounded-xl border border-stroke bg-gray-2 p-4 shadow-3 border-dark-3 bg-gray-dark shadow-card sm:p-8 xl:p-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{props.data.updateData ? "Update Trade" : "Add Trade"}</h2>
                    <div>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                lotSize: tradeRecord?.lotSize || '',
                                date: tradeRecord?.date || '',
                                pair: tradeRecord?.symbol || '',
                                risk: tradeRecord?.risk || '',
                                position: tradeRecord?.position || '',
                                profit: tradeRecord?.pL || '',
                                fee: tradeRecord?.fees || '',
                                entryPrice: tradeRecord?.entryPrice || '',
                                entryTime: tradeRecord?.entryTime || '',
                                exitPrice: tradeRecord?.exitPrice || '',
                                exitTime: tradeRecord?.exitTime || '',
                                remarks: tradeRecord?.remarks || '',
                                chart: tradeRecord?.charts || '',
                                emotion: tradeRecord?.emotion || '',
                                mistake: tradeRecord?.mistake || ''
                            }}
                            validationSchema={Yup.object().shape({
                                pair: Yup.string()
                                    .oneOf(["BTCUSD", "XAUUSD", "GBPUSD"], "Select a valid pair")
                                    .required("Pair is required"),
                                position: Yup.string()
                                    .oneOf(["buy", "sell"], "Select a valid Position")
                                    .required("Position is required"),
                                emotion: Yup.string()
                                    .oneOf(["confident", "neutral", "fear", "angry", "greedy"], "Select a valid Emotion")
                                    .required("Emotion is required"),
                                mistake: Yup.string()
                                    .oneOf(["ear_sl", "move_tp_be", "exit_early", "none"], "Select a valid Mistake")
                                    .required("Mistake is required"),
                                lotSize: Yup.string()
                                    .max(255)
                                    .required('lotSize is required'),
                                risk: Yup.string()
                                    .max(255)
                                    .required('Risk is required'),
                                date: Yup.string()
                                    .max(255)
                                    .required('Date is required'),
                                profit: Yup.string()
                                    .max(255)
                                    .required('Profit is required'),
                                fee: Yup.string()
                                    .max(255)
                                    .required('Fees is required'),
                                entryPrice: Yup.string()
                                    .max(255)
                                    .required('Entry Price is required'),
                                entryTime: Yup.string()
                                    .max(255)
                                    .required('Entry Time is required'),
                                exitPrice: Yup.string()
                                    .max(255)
                                    .required('Exit Price is required'),
                                exitTime: Yup.string()
                                    .max(255)
                                    .required('Exit Time is required'),
                                remarks: Yup.string()
                                    .max(255)
                                    .required('Remark is required'),

                            })}
                            onSubmit={async (
                                values,
                                { setErrors, setStatus, setSubmitting, resetForm }
                            ) => {

                                try {
                                    props.data.updateData ? handleSubmitUpdate(values) : handleSubmitAdd(values)
                                } catch (error) {
                                    const message = error.message || 'Something went wrong';
                                    setStatus({ success: false });
                                    setErrors({ submit: message });
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({
                                errors,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                isSubmitting,
                                touched,
                                values,
                                setFieldValue,
                            }) => (
                                <form onSubmit={handleSubmit} className="mx-auto p-4">

                                    <div className="flex flex-row flex-wrap">
                                        <div className="basis-1/2">
                                            <label htmlFor="pair" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 mt-4">
                                                Pair
                                            </label>
                                            <select
                                                id="pair"
                                                name="pair"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.pair}
                                                disabled={tradeRecord}
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.pair && errors.pair
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            >
                                                <option value="">Select Pair</option>
                                                <option value="BTCUSD">BTC/USD</option>
                                                <option value="XAUUSD">XAU/USD</option>
                                                <option value="GBPUSD">GBP/USD</option>
                                            </select>
                                            {touched.pair && errors.pair && (
                                                <p className="text-red-600 text-sm mt-1">{errors.pair}</p>
                                            )}

                                        </div>
                                        <div className="basis-1/2">
                                            {/* Date Input */}
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 mt-4">
                                                Date
                                            </label>
                                            <input
                                                id="date"
                                                name="date"
                                                type="date"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.date}
                                                disabled={tradeRecord}
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.date && errors.date
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.date && errors.date && (
                                                <p className="text-red-600 text-sm mt-1">{errors.date}</p>
                                            )}
                                        </div>
                                        <div className="basis-1/2">
                                            <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 mt-4">
                                                Position
                                            </label>
                                            <select
                                                id="position"
                                                name="position"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.position}
                                                disabled={tradeRecord}
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.position && errors.position
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            >
                                                <option value="">Select position</option>
                                                <option value="buy">Buy</option>
                                                <option value="sell">Sell</option>

                                            </select>
                                            {touched.position && errors.position && (
                                                <p className="text-red-600 text-sm mt-1">{errors.position}</p>
                                            )}

                                        </div>
                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="lotSize"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                lotSize
                                            </label>
                                            <input
                                                id="lotSize"
                                                name="lotSize"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.lotSize}
                                                disabled={tradeRecord}
                                                placeholder="Enter your lotSize"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.lotSize && errors.lotSize
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.lotSize && errors.lotSize ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.lotSize}</p>
                                            ) : null}

                                        </div>
                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="risk"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Risk
                                            </label>
                                            <input
                                                id="risk"
                                                name="risk"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.risk}
                                                disabled={tradeRecord}
                                                placeholder="Enter your risk"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.risk && errors.risk
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.risk && errors.risk ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.risk}</p>
                                            ) : null}
                                        </div>

                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="profit"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Profit
                                            </label>
                                            <input
                                                id="profit"
                                                name="profit"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.profit}
                                                disabled={tradeRecord}
                                                placeholder="Enter your profit"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.profit && errors.profit
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.profit && errors.profit ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.profit}</p>
                                            ) : null}
                                        </div>

                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="fee"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Fees
                                            </label>
                                            <input
                                                id="fee"
                                                name="fee"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.fee}
                                                disabled={tradeRecord}
                                                placeholder="Enter your Fees"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.fee && errors.fee
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.fee && errors.fee ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.fee}</p>
                                            ) : null}
                                        </div>

                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="entryPrice"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Entry Price
                                            </label>
                                            <input
                                                id="entryPrice"
                                                name="entryPrice"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.entryPrice}
                                                disabled={tradeRecord}
                                                placeholder="Enter your EntryPrice"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.entryPrice && errors.entryPrice
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.entryPrice && errors.entryPrice ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.entryPrice}</p>
                                            ) : null}
                                        </div>

                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="entryTime"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Entry Time
                                            </label>
                                            <input
                                                id="entryTime"
                                                name="entryTime"
                                                type="time"
                                                step="1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.entryTime}
                                                disabled={tradeRecord}
                                                placeholder="Enter your entryTime"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.entryTime && errors.entryTime
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.entryTime && errors.entryTime ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.entryTime}</p>
                                            ) : null}
                                        </div>

                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="exitPrice"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Exit Price
                                            </label>
                                            <input
                                                id="exitPrice"
                                                name="exitPrice"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.exitPrice}
                                                disabled={tradeRecord}
                                                placeholder="Enter your exitPrice"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.exitPrice && errors.exitPrice
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.exitPrice && errors.exitPrice ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.exitPrice}</p>
                                            ) : null}
                                        </div>

                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="exitTime"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Exit Time
                                            </label>
                                            <input
                                                id="exitTime"
                                                name="exitTime"
                                                type="time"
                                                step="1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.exitTime}
                                                disabled={tradeRecord}
                                                placeholder="Enter your exitTime"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.exitTime && errors.exitTime
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            />
                                            {touched.exitTime && errors.exitTime ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.exitTime}</p>
                                            ) : null}
                                        </div>

                                        <div className="basis-1/2">
                                            <label
                                                htmlFor="chart"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Chart Link
                                            </label>
                                            <input
                                                id="chart"
                                                name="chart"
                                                type="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.chart}
                                                placeholder="Enter your chart"
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.chart && errors.chart
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    }`}
                                            />
                                            {touched.chart && errors.chart ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.chart}</p>
                                            ) : null}
                                        </div>
                                        <div className="basis-1/2">
                                            <label htmlFor="emotion" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 mt-4">
                                                Emotion
                                            </label>
                                            <select
                                                id="emotion"
                                                name="emotion"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.emotion}
                                                disabled={tradeRecord}
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.emotion && errors.emotion
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            >
                                                <option value="">Select Emotion</option>
                                                <option value="confident">Confident</option>
                                                <option value="neutral">Neutral</option>
                                                <option value="fear">Fear</option>
                                                <option value="angry">Angry</option>
                                                <option value="greedy">Greedy</option>
                                            </select>
                                            {touched.emotion && errors.emotion && (
                                                <p className="text-red-600 text-sm mt-1">{errors.emotion}</p>
                                            )}

                                        </div>
                                        <div className="basis-1/2">
                                            <label htmlFor="mistake" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 mt-4">
                                                Mistakes
                                            </label>
                                            <select
                                                id="mistake"
                                                name="mistake"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.mistake}
                                                disabled={tradeRecord}
                                                className={`w-[85%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.mistake && errors.mistake
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    } ${tradeRecord && "opacity-50 cursor-not-allowed"}`}
                                            >
                                                <option value="">Select Mistakes</option>
                                                <option value="none">No Mistake</option>
                                                <option value="exit_early">Exited Early (Fear)</option>
                                                <option value="move_tp_be">Moved TP to BE</option>
                                                <option value="fear_sl">Fear of SL Hit</option>
                                            </select>
                                            {touched.mistake && errors.mistake && (
                                                <p className="text-red-600 text-sm mt-1">{errors.mistake}</p>
                                            )}

                                        </div>

                                        <div className="basis-1/1">
                                            <label
                                                htmlFor="remarks"
                                                className="block text-sm font-medium text-white-700 mb-1 mt-4"
                                            >
                                                Remarks
                                            </label>
                                            <textarea
                                                id="remarks"
                                                name="remarks"
                                                rows={5}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.remarks}
                                                placeholder="Enter your remarks"
                                                className={`w-[93%] rounded border px-3 py-2 focus:outline-none focus:ring-2 ${touched.remarks && errors.remarks
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-blue-500"
                                                    }`}
                                            />
                                            {touched.remarks && errors.remarks ? (
                                                <p className="text-red-600 text-sm mt-1">{errors.remarks}</p>
                                            ) : null}
                                        </div>


                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div>

                                        </div>
                                        <div>
                                            <button
                                                onClick={props.data.updateData ? props.data.onUpdateHide : props.data.onAddHide}
                                                className="cursor-pointer mt-2 bg-[#5750F1] font-semibold text-white px-4 py-2 rounded hover:bg-[#5750F1]"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="cursor-pointer mt-2 bg-[#5750F1] font-semibold text-white ml-5 px-4 py-2 rounded hover:bg-[#5750F1]"
                                                type="submit"
                                                name="continue"
                                            >
                                                {props.data.updateData ? "Update" : "Add"}
                                            </button>

                                        </div>


                                    </div>

                                </form>
                            )}
                        </Formik>
                    </div>
                    <button
                        onClick={props.data.updateData ? props.data.onUpdateHide : props.data.onAddHide}
                        className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl font-bold"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>

                </div>

            </div>
        </div>

    );
}
