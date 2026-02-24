"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  CURRENCY_SYMBOLS, 
  CURRENCY_RATES as INITIAL_RATES,
  convertValue, 
  convertToBase, 
  fetchLatestRates,
  formatCurrency as formatCurrencyLib 
} from '@/lib/currency';

interface CurrencyContextType {
  currency: string;
  symbol: string;
  convert: (value: number) => number;
  convertToGBP: (value: number) => number;
  format: (value: number) => string;     // converts and formats
  formatPlain: (value: number) => string; // only formats
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [rates, setRates] = useState<Record<string, number>>(INITIAL_RATES);
  const [loading, setLoading] = useState(true);

  const userCurrency = (user?.publicMetadata as any)?.currency || "GBP (£)";
  const baseCurrency = "GBP (£)"; // Assuming database values are in GBP

  useEffect(() => {
    async function updateRates() {
      try {
        const latestRates = await fetchLatestRates();
        setRates(latestRates);
      } catch (err) {
        console.error("Currency Provider error:", err);
      } finally {
        setLoading(false);
      }
    }
    updateRates();
  }, []);

  const convert = (value: number) => {
    return convertValue(value, baseCurrency, userCurrency, rates);
  };

  const convertToGBP = (value: number) => {
    return convertToBase(value, userCurrency, rates);
  };

  const format = (value: number) => {
    const converted = convert(value);
    return formatCurrencyLib(converted, userCurrency);
  };

  const formatPlain = (value: number) => {
    return formatCurrencyLib(value, userCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency: userCurrency, 
      symbol: CURRENCY_SYMBOLS[userCurrency] || "£",
      convert,
      convertToGBP,
      format,
      formatPlain,
      loading
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
