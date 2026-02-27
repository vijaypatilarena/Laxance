

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { plaidClient } from '@/lib/plaid';
import { supabase } from '@/lib/supabase';
import { decrypt } from '@/lib/encryption';

export const dynamic = 'force-dynamic';

// GET /api/plaid/transactions
// Fetches transactions from all connected bank accounts for the authenticated user.
// Decrypts the access token on-the-fly, uses it, and never exposes it.
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get all connected banks for this user
        const { data: banks, error } = await supabase
            .from('connected_banks')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active');

        if (error || !banks || banks.length === 0) {
            return NextResponse.json({ transactions: [], banks: [] });
        }

        const allTransactions: any[] = [];

        // Fetch transactions from each connected bank
        for (const bank of banks) {
            try {
                // Decrypt the access token in memory only
                const accessToken = decrypt(bank.encrypted_access_token);

                // Calculate date range (last 30 days)
                const endDate = new Date().toISOString().split('T')[0];
                const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                const response = await plaidClient.transactionsGet({
                    access_token: accessToken,
                    start_date: startDate,
                    end_date: endDate,
                    options: { count: 100 },
                });

                const transactions = response.data.transactions.map(tx => ({
                    id: tx.transaction_id,
                    date: tx.date,
                    description: tx.name,
                    amount: Math.abs(tx.amount),
                    type: tx.amount < 0 ? 'income' : 'expense', // Plaid uses negative for income
                    category: tx.personal_finance_category?.primary || tx.category?.[0] || 'Other',
                    bank: bank.institution_name,
                    source: 'plaid',
                }));

                allTransactions.push(...transactions);
            } catch (bankError: any) {
                console.error(`Error fetching from ${bank.institution_name}:`, bankError?.message);
                // Continue with other banks even if one fails
            }
        }

        // Sort by date (newest first)
        allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({
            transactions: allTransactions,
            banks: banks.map(b => ({
                institution_name: b.institution_name,
                connected_at: b.connected_at,
                status: b.status,
            }))
        });
    } catch (error: any) {
        console.error('Plaid Transactions Error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}
