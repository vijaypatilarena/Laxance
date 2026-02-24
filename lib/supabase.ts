import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client — uses the service role key for full access.
// Only use this in API routes (never expose to the browser).
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
