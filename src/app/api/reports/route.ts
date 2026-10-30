import { type NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Report } from '@/lib/types';

// Placeholder — full implementation in Phase 3
export async function GET(
  _req: NextRequest,
): Promise<NextResponse<ApiResponse<Report[]>>> {
  return NextResponse.json({ ok: true, data: [] });
}

export async function POST(
  _req: NextRequest,
): Promise<NextResponse<ApiResponse<Report>>> {
  return NextResponse.json(
    { ok: false, error: 'Not implemented yet — Phase 2' },
    { status: 501 },
  );
}
