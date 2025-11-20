'use client';
import React, { useEffect, useState } from "react";

import { useAccounts } from "@/context/AccountsContext";

export default function Header() {
    const { accounts, loading, error } = useAccounts();
    return (
        <header style={{ backgroundColor: "rgb(18 32 49/var(--tw-bg-opacity,1))" }} className="sticky top-0 z-30 flex items-center justify-between border-stroke px-4 py-5 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
            <div className="max-xl:hidden">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="font-medium">Trading Journal</p>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
                <div className="relative w-full max-w-[300px]">
                    <p className="font-medium">Balance</p>
                    <h1
                        style={{ color: "#ffe535" }}
                        className="text-xl font-bold"
                    >
                        {loading ? (
                            <span className="inline-block h-5 w-20 rounded-full bg-gray-200 animate-pulse" />
                        ) : (

                            `${accounts?.currentBalance} usd`

                        )}
                    </h1>

                </div>


            </div>
        </header>
    );
}
