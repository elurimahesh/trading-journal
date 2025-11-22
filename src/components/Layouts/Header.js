'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAccounts } from "@/context/AccountsContext";
import { HiOutlineMenu } from "react-icons/hi";

export default function Header({ onMenuClick }) {
  const { accounts, loading, error } = useAccounts();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const formattedBalance = mounted && accounts?.currentBalance != null
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(accounts.currentBalance))
    : null;

  return (
    <header
      style={{ backgroundColor: "rgb(18 32 49 / var(--tw-bg-opacity, 1))" }}
      className="sticky top-0 z-30 border-stroke dark:border-stroke-dark dark:bg-gray-dark"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 md:px-5 2xl:px-10">
        <div className="flex items-center justify-between gap-3 py-3">
          {/* LEFT: mobile menu (optional) + title */}
          <div className="flex items-center gap-3">
            {/* optional menu button visible on small screens */}
            <button
              type="button"
              onClick={() => onMenuClick?.()}
              aria-label="Open menu"
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#5750F1] md:hidden text-gray-300 hover:bg-white/5"
            >
              <HiOutlineMenu size={20} />
            </button>

            {/* Title: compact on xs/sm, full on md+ */}
            <div>
              <Link href="/dashboard" className="inline-flex flex-col">
                <span className="text-lg font-semibold leading-tight text-white md:text-2xl">Trading Journal</span>
                <span className="text-xs text-gray-400 hidden md:block">Dashboard</span>
              </Link>

              {/* small-screen subtitle (compact) */}
              <div className="text-xs text-gray-400 md:hidden">Journal</div>
            </div>
          </div>

          {/* RIGHT: balance + optional avatar */}
          <div className="flex items-center gap-4">
            {/* Balance box: hides label on small screens */}
            <div className="flex items-center gap-3">
              {/* label hidden on xs/sm to save space */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-gray-400">Balance</span>
                {(!mounted || loading) ? (
                  <div className="mt-1 h-6 w-28 rounded-full bg-gray-700/40 animate-pulse" />
                ) : (
                  <div className="mt-1 text-lg font-bold" style={{ color: "#ffe535" }}>
                    {formattedBalance} USD
                  </div>
                )}
              </div>

              {/* compact balance for very small screens */}
              <div className="flex sm:hidden items-center gap-2">
                {(!mounted || loading) ? (
                  <div className="h-6 w-16 rounded-full bg-gray-700/40 animate-pulse" />
                ) : (
                  <div className="text-sm font-semibold" style={{ color: "#ffe535" }}>
                    {formattedBalance ?? '-'}$
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}