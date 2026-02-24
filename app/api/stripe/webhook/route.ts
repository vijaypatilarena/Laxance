import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        const userId = session.metadata.userId;
        const client = await clerkClient();

        // Update user's plan to 'pro'
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                plan: 'pro'
            }
        });
    }

    return NextResponse.json({ received: true });
}
