'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useAccounts } from "@/context/AccountsContext";

export default function Header() {
    const { accounts, loading, error } = useAccounts();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (
        <header
            style={{ backgroundColor: "rgb(18 32 49 / var(--tw-bg-opacity, 1))" }}
            className="sticky top-0 z-30 flex items-center justify-between border-stroke px-4 py-4 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10"
        >
            {/* Left: page title (hidden on very small screens) */}
            <div className="max-xl:hidden">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">Trading Journal</h1>
                <p className="text-sm text-gray-400">Dashboard</p>
            </div>

            {/* Right: balance + avatar */}
            <div className="flex items-center gap-4">
                {/* Balance box */}
                <div className="text-right min-w-[160px]">
                    <p className="text-xs text-gray-400">Balance</p>

                    {/* Avoid rendering dynamic content on SSR to prevent hydration mismatch */}
                    <div className="mt-1">
                        {(!mounted || loading) ? (
                            <div className="inline-block h-6 w-28 rounded-full bg-gray-700/40 animate-pulse" />
                        ) : (
                            <div className="text-lg font-bold" style={{ color: "#ffe535" }}>
                                {`${accounts?.currentBalance} USD`}
                            </div>
                        )}
                    </div>
                </div>

                {/* Small quick stats (optional: uncomment if you want) */}
                {/*
                <div className="hidden sm:flex flex-col text-right">
                  <p className="text-xs text-gray-400">Winrate</p>
                  <div className="font-semibold">62%</div>
                </div>
                */}

            </div>
        </header>
    );
}
