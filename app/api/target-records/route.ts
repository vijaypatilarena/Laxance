

import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/goals — fetch all goals for the logged-in user
export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

// POST /api/goals — create or update a goal
export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, title, amount, timeline, current_savings, monthly_income, monthly_expenses, risk_tolerance } = body;

    // Get user plan from Clerk metadata
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const plan = (user.publicMetadata as any).plan || 'free';

    // Check limits
    const { count } = await supabase
        .from('goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const limit = plan === 'pro' ? 10 : 1;

    if (!id && (count || 0) >= limit) {
        return NextResponse.json({
            error: `Goal limit reached for ${plan} plan. Upgrade to Pro for more goals.`,
            limitReached: true
        }, { status: 403 });
    }

    let result;
    if (id) {
        // Update existing goal if id is provided
        result = await supabase
            .from('goals')
            .update({ title, amount, timeline, current_savings, monthly_income, monthly_expenses, risk_tolerance })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
    } else {
        // Insert new goal
        result = await supabase
            .from('goals')
            .insert({ user_id: userId, title, amount, timeline, current_savings, monthly_income, monthly_expenses, risk_tolerance })
            .select()
            .single();
    }

    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
    return NextResponse.json(result.data, { status: 201 });
}

// DELETE /api/goals?id=... — delete a specific goal
export async function DELETE(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const query = supabase.from('goals').delete().eq('user_id', userId);

    if (id) {
        query.eq('id', id);
    }

    const { error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
