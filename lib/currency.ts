export const CURRENCY_RATES: Record<string, number> = {
    "GBP (£)": 1,
    "USD ($)": 1.25,
    "EUR (€)": 1.18,
    "INR (₹)": 123,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
    "GBP (£)": "£",
    "USD ($)": "$",
    "EUR (€)": "€",
    "INR (₹)": "₹",
};

export function convertValue(value: number, from: string, to: string): number {
    if (from === to) return value;

    const fromRate = CURRENCY_RATES[from] || 1;
    const toRate = CURRENCY_RATES[to] || 1;

    // Convert to GBP first (base), then to Target
    const valueInGBP = value / fromRate;
    return valueInGBP * toRate;
}

export function convertToBase(value: number, from: string): number {
    const fromRate = CURRENCY_RATES[from] || 1;
    return value / fromRate;
}

export function formatCurrency(value: number, currency: string): string {
    const symbol = CURRENCY_SYMBOLS[currency] || "£";
    return `${symbol}${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
