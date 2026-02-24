"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { CURRENCY_SYMBOLS, convertValue, convertToBase, formatCurrency as formatCurrencyLib } from '@/lib/currency';

interface CurrencyContextType {
  currency: string;
  symbol: string;
  convert: (value: number) => number;
  convertToGBP: (value: number) => number;
  format: (value: number) => string;     // converts and formats
  formatPlain: (value: number) => string; // only formats
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const userCurrency = (user?.publicMetadata as any)?.currency || "GBP (£)";
  const baseCurrency = "GBP (£)"; // Assuming database values are in GBP

  const convert = (value: number) => {
    return convertValue(value, baseCurrency, userCurrency);
  };

  const convertToGBP = (value: number) => {
    return convertToBase(value, userCurrency);
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
      formatPlain
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
