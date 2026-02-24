import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getAIChatResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

        const response = await getAIChatResponse(message, {
            income: totalIncome,
            expenses: totalExpenses,
            transactions: transactions || [],
            goals: goals || []
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
