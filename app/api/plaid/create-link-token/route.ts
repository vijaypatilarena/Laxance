import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { plaidClient, PLAID_PRODUCTS, PLAID_COUNTRY_CODES } from '@/lib/plaid';

// POST /api/plaid/create-link-token
// Creates a Plaid Link token so the frontend can open the bank connection UI.
export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: userId },
            client_name: 'Laxance Finance',
            products: PLAID_PRODUCTS,
            country_codes: PLAID_COUNTRY_CODES,
            language: 'en',
        });

        return NextResponse.json({ link_token: response.data.link_token });
    } catch (error: any) {
        console.error('Plaid Link Token Error:', error?.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 });
    }
}
