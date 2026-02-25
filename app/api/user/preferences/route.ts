

import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { currency, frequency } = await req.json();

        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                currency,
                frequency
            }
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Preferences Update Error:', err);
        return NextResponse.json({ error: 'Failed to update preferences', message: err.message }, { status: 500 });
    }
}
