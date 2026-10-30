// ── Server-only Supabase client ───────────────────────────
// NEVER import this file from client components.
// The service role key must stay on the server.
// 'server-only' package enforced at build time (installed in package.json).

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  // In build/typecheck context the env vars might not be present.
  // At runtime they are required.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    );
  }
}

// url/key are validated above for production; fall back to '' for dev/build.
export const db = createClient(url ?? '', key ?? '', {
  auth: { persistSession: false },
});
