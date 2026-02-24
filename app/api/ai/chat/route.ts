import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getAIChatResponse } from '@/lib/ai';
import { convertValue, fetchLatestRates } from '@/lib/currency';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const currency = (user.publicMetadata as any)?.currency || "GBP (£)";

        // Fetch live rates
        await fetchLatestRates();

        const body = await req.json();
        const { message } = body;

        // Fetch context for AI
        const { data: transactions } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId);

        const { data: goals } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId);

        let totalIncome = 0;
        let totalExpenses = 0;
        transactions?.forEach(tx => {
            const amt = Number(tx.amount);
            if (tx.type === 'income') totalIncome += amt;
            else totalExpenses += amt;
        });

        if (totalIncome === 0 && goals?.[0]) {
            totalIncome = Number(goals[0].monthly_income);
            totalExpenses = Number(goals[0].monthly_expenses);
        }

        // Convert to User Currency
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

        const response = await getAIChatResponse(message, {
            income: convertedIncome,
            expenses: convertedExpenses,
            transactions: convertedTransactions,
            goals: convertedGoals,
            currency: currency
        });

        return NextResponse.json({ response });
    } catch (err: any) {
        console.error('AI Chat Route Error:', err);
        return NextResponse.json({
            response: "I'm having trouble processing that right now. Could you try asking again? (Error: Internal Service Issue)",
            error: err.message
        }, { status: 500 });
    }
}
