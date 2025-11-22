// src/context/AccountsContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AccountsContext = createContext(null);

export function AccountsProvider({ children }) {
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataRefresh, setDataRefresh] = useState();

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setLoading(true);
        const res = await fetch("/api/accounts");
        if (!res.ok) throw new Error("Failed to fetch accounts");
        const data = await res.json();
        setAccounts(data.accounts ? data.accounts[0] : {});
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, [dataRefresh]);

  return (
    <AccountsContext.Provider value={{ accounts, loading, error, setDataRefresh }}>
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const ctx = useContext(AccountsContext);
  if (!ctx) {
    throw new Error("useAccounts must be used within AccountsProvider");
  }
  return ctx;
}
