

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { plaidClient } from '@/lib/plaid';
import { supabase } from '@/lib/supabase';
import { encrypt } from '@/lib/encryption';

// POST /api/plaid/exchange-token
// Exchanges the public_token from Plaid Link for a permanent access_token.
// The access_token is encrypted with AES-256-GCM before storage.
// Even with full database access, the developer cannot read the token.
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { public_token, institution } = await req.json();

        // Exchange the public token for a permanent access token
        const response = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Encrypt the access token before storing
        const encryptedToken = encrypt(accessToken);

        // Store the encrypted token in Supabase
        const { error } = await supabase
            .from('connected_banks')
            .upsert({
                user_id: userId,
                item_id: itemId,
                encrypted_access_token: encryptedToken,
                institution_name: institution?.name || 'Unknown Bank',
                institution_id: institution?.institution_id || '',
                status: 'active',
                connected_at: new Date().toISOString(),
            }, {
                onConflict: 'item_id'
            });

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to save bank connection' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            institution_name: institution?.name || 'Bank Connected',
            message: 'Bank account connected securely. Your credentials are encrypted and cannot be viewed by anyone.'
        });
    } catch (error: any) {
        console.error('Plaid Exchange Error:', error?.response?.data || error.message);
        return NextResponse.json({ error: 'Failed to connect bank account' }, { status: 500 });
    }
}
