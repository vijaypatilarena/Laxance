import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getAIAnalysis } from '@/lib/ai';
import { convertValue, fetchLatestRates } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log("[API] Starting Data Insights API (Public/Diagnostics Mode)...");
    try {
        const { userId } = await auth();
        if (!userId) {
            console.warn("[API] Unauthorized access attempt to Intelligence Data");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let client;
        try {
            client = await clerkClient();
        } catch (clerkErr) {
            console.error("[API] Clerk Client Error:", clerkErr);
            throw new Error("Clerk initialization failed");
        }

        const user = await client.users.getUser(userId).catch(() => null);
        const currency = (user?.publicMetadata as any)?.currency || "GBP (£)";
        const frequency = (user?.publicMetadata as any)?.frequency || "Daily";

        console.log(`[API] Fetching real data for user: ${userId}`);

        // 1. Fetch Rates (with 5s timeout from currency.ts)
        await fetchLatestRates().catch(err => console.error("[API] Rates Fetch Error:", err));

        // 2. Fetch Transactions & Goals in parallel
        const [transactionsRes, goalsRes] = await Promise.all([
            supabase.from('transactions').select('*').eq('user_id', userId),
            supabase.from('goals').select('*').eq('user_id', userId)
        ]);

        const transactions = transactionsRes.data || [];
        const goals = goalsRes.data || [];

        // 3. Totals
        let totalIncome = 0;
        let totalExpenses = 0;
        transactions.forEach(tx => {
            const amt = Number(tx.amount);
            if (tx.type === 'income') totalIncome += amt;
            else totalExpenses += amt;
        });

        if (totalIncome === 0 && goals?.[0]) {
            totalIncome = Number(goals[0].monthly_income);
            totalExpenses = Number(goals[0].monthly_expenses);
        }

        // 4. Converted data
        const convertedIncome = convertValue(totalIncome, "GBP (£)", currency);
        const convertedExpenses = convertValue(totalExpenses, "GBP (£)", currency);
        const convertedTransactions = transactions.map(tx => ({
            ...tx,
            amount: convertValue(Number(tx.amount), "GBP (£)", currency)
        }));
        const convertedGoals = goals.map(g => ({
            ...g,
            amount: convertValue(Number(g.amount), "GBP (£)", currency),
            current_savings: convertValue(Number(g.current_savings), "GBP (£)", currency),
            monthly_income: convertValue(Number(g.monthly_income), "GBP (£)", currency),
            monthly_expenses: convertValue(Number(g.monthly_expenses), "GBP (£)", currency)
        }));

        console.log("[API] Requesting AI Analysis from Gemini...");
        const analysis = await getAIAnalysis({
            income: convertedIncome,
            expenses: convertedExpenses,
            transactions: convertedTransactions,
            goals: convertedGoals,
            currency: currency,
            frequency: frequency
        });

        console.log("[API] AI Analysis successfully generated.");
        return NextResponse.json(analysis);

    } catch (err: any) {
        console.error('Data Insights Route Critical Error:', err);
        return NextResponse.json({
            error: 'Failed to generate financial analysis',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }, { status: 500 });
    }
}
