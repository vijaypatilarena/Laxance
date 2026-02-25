

import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

// POST /api/terms/accept — Mark the user as having accepted the T&C
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const client = await clerkClient();

        // Store acceptance in Clerk's public metadata
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                termsAcceptedAt: new Date().toISOString(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Terms Accept Error:', error.message);
        return NextResponse.json({ error: 'Failed to accept terms' }, { status: 500 });
    }
}
