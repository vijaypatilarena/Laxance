

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

// GET /api/stats — compute financial stats from the transactions table
export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch all transactions for the user
    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const txs = transactions || [];

    // Compute totals
    let totalIncome = 0;
    let totalExpenses = 0;
    for (const tx of txs) {
        if (tx.type === 'income') totalIncome += Number(tx.amount);
        else totalExpenses += Number(tx.amount);
    }
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';

    // Compute weekly data (last 7 days) for the chart
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = dayNames[d.getDay()];

        let dayIncome = 0;
        let dayExpense = 0;
        for (const tx of txs) {
            if (tx.date === dateStr) {
                if (tx.type === 'income') dayIncome += Number(tx.amount);
                else dayExpense += Number(tx.amount);
            }
        }

        weeklyData.push({ name: dayName, income: dayIncome, expense: dayExpense });
    }

    return NextResponse.json({
        balance: balance.toFixed(2),
        totalIncome: totalIncome.toFixed(2),
        totalExpenses: totalExpenses.toFixed(2),
        savingsRate,
        weeklyData,
    });
}
