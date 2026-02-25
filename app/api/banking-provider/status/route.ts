

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

// GET /api/plaid/status — Get connected banks for the user
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: banks } = await supabase
            .from('connected_banks')
            .select('institution_name, connected_at, status')
            .eq('user_id', userId)
            .eq('status', 'active');

        return NextResponse.json({ banks: banks || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/plaid/status — Disconnect a bank
export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { institution_name } = await req.json();

        // Soft-delete: mark as disconnected, don't delete the row 
        const { error } = await supabase
            .from('connected_banks')
            .update({ status: 'disconnected' })
            .eq('user_id', userId)
            .eq('institution_name', institution_name);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
