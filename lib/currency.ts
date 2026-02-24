export let CURRENCY_RATES: Record<string, number> = {
    "GBP (£)": 1,
    "USD ($)": 1.25,
    "EUR (€)": 1.18,
    "INR (₹)": 108.0,
    "CHF (Fr.)": 1.12,
    "NOK (kr)": 13.5,
    "CAD ($)": 1.7,
    "AUD ($)": 1.9,
    "JPY (¥)": 190.0,
};

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_RATES);

export const CURRENCY_SYMBOLS: Record<string, string> = {
    "GBP (£)": "£",
    "USD ($)": "$",
    "EUR (€)": "€",
    "INR (₹)": "₹",
    "CHF (Fr.)": "CHF ",
    "NOK (kr)": "kr ",
    "CAD ($)": "CA$",
    "AUD ($)": "A$",
    "JPY (¥)": "¥",
};

export const CURRENCY_MAPPING: Record<string, string> = {
    "GBP (£)": "GBP",
    "USD ($)": "USD",
    "EUR (€)": "EUR",
    "INR (₹)": "INR",
    "CHF (Fr.)": "CHF",
    "NOK (kr)": "NOK",
    "CAD ($)": "CAD",
    "AUD ($)": "AUD",
    "JPY (¥)": "JPY",
};

let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function fetchLatestRates() {
    const now = Date.now();
    if (now - lastFetchTime < CACHE_DURATION) return CURRENCY_RATES;

    try {
        const res = await fetch('https://open.er-api.com/v6/latest/GBP');
        const data = await res.json();

        if (data && data.rates) {
            CURRENCY_RATES = {
                "GBP (£)": 1,
                "USD ($)": data.rates.USD || 1.25,
                "EUR (€)": data.rates.EUR || 1.18,
                "INR (₹)": data.rates.INR || 108.0,
                "CHF (Fr.)": data.rates.CHF || 1.12,
                "NOK (kr)": data.rates.NOK || 13.5,
                "CAD ($)": data.rates.CAD || 1.7,
                "AUD ($)": data.rates.AUD || 1.9,
                "JPY (¥)": data.rates.JPY || 190.0,
            };
            lastFetchTime = now;
        }
    } catch (err) {
        console.error("Failed to fetch exchange rates:", err);
    }
    return CURRENCY_RATES;
}

export function convertValue(value: number, from: string, to: string, customRates?: Record<string, number>): number {
    if (from === to) return value;

    const rates = customRates || CURRENCY_RATES;
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;

    // Convert to GBP first (base), then to Target
    const valueInGBP = value / fromRate;
    return valueInGBP * toRate;
}

export function convertToBase(value: number, from: string, customRates?: Record<string, number>): number {
    const rates = customRates || CURRENCY_RATES;
    const fromRate = rates[from] || 1;
    return value / fromRate;
}

export function formatCurrency(value: number, currency: string): string {
    const symbol = CURRENCY_SYMBOLS[currency] || "£";
    return `${symbol}${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
