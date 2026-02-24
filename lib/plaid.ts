import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments || 'sandbox'],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
            'PLAID-SECRET': process.env.PLAID_SECRET || '',
        },
    },
});

export const plaidClient = new PlaidApi(configuration);

// Supported products and countries
export const PLAID_PRODUCTS = [Products.Transactions];
export const PLAID_COUNTRY_CODES = [CountryCode.Gb, CountryCode.Us];
export const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';
