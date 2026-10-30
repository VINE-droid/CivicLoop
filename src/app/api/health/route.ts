import { type NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

interface HealthData {
  ok: boolean;
  supabase: 'reachable' | 'unreachable' | 'not_configured';
  timestamp: string;
}

export async function GET(_req: NextRequest): Promise<NextResponse<ApiResponse<HealthData>>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let supabase: HealthData['supabase'] = 'not_configured';

  if (url && key) {
    try {
      // Minimal ping: list tables via REST; a 200 or 404 both mean Supabase is reachable
      const res = await fetch(`${url}/rest/v1/reports?select=id&limit=1`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        signal: AbortSignal.timeout(4000),
      });
      supabase = res.ok || res.status === 404 ? 'reachable' : 'unreachable';
    } catch {
      supabase = 'unreachable';
    }
  }

  return NextResponse.json({
    ok: true,
    data: {
      ok: true,
      supabase,
      timestamp: new Date().toISOString(),
    },
  });
}
