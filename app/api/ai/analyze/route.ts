import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getAIAnalysis } from '@/lib/ai';
import { convertValue } from '@/lib/currency';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const currency = (user.publicMetadata as any)?.currency || "GBP (£)";
        const frequency = (user.publicMetadata as any)?.frequency || "Daily";

        // 1. Fetch Transactions
        const { data: transactions } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId);

        // 2. Fetch Goals
        const { data: goals } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId);

        // 3. Calculate Totals
        let totalIncome = 0;
        let totalExpenses = 0;

        // Using the last 30 days or just all if fewer
        transactions?.forEach(tx => {
            const amt = Number(tx.amount);
            if (tx.type === 'income') totalIncome += amt;
            else totalExpenses += amt;
        });

        // If no transactions, use goal income/expenses as baseline
        if (totalIncome === 0 && goals?.[0]) {
            totalIncome = Number(goals[0].monthly_income);
            totalExpenses = Number(goals[0].monthly_expenses);
        }

        // 4. Convert to User Currency
        const convertedIncome = convertValue(totalIncome, "GBP (£)", currency);
        const convertedExpenses = convertValue(totalExpenses, "GBP (£)", currency);
        const convertedTransactions = (transactions || []).map(tx => ({
            ...tx,
            amount: convertValue(Number(tx.amount), "GBP (£)", currency)
        }));
        const convertedGoals = (goals || []).map(g => ({
            ...g,
            amount: convertValue(Number(g.amount), "GBP (£)", currency),
            current_savings: convertValue(Number(g.current_savings), "GBP (£)", currency),
            monthly_income: convertValue(Number(g.monthly_income), "GBP (£)", currency),
            monthly_expenses: convertValue(Number(g.monthly_expenses), "GBP (£)", currency)
        }));

        // 5. Get AI Analysis
        const analysis = await getAIAnalysis({
            income: convertedIncome,
            expenses: convertedExpenses,
            transactions: convertedTransactions,
            goals: convertedGoals,
            currency: currency,
            frequency: frequency
        });

        return NextResponse.json(analysis);
    } catch (err: any) {
        console.error('AI Analysis Route Error:', err);
        return NextResponse.json({ error: 'Failed to generate financial analysis', message: err.message }, { status: 500 });
    }
}
