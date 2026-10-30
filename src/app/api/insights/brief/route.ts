import { type NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ActionBrief } from '@/lib/types';

export async function GET(
  _req: NextRequest,
): Promise<NextResponse<ApiResponse<ActionBrief | null>>> {
  return NextResponse.json({ ok: true, data: null });
}

export async function POST(
  _req: NextRequest,
): Promise<NextResponse<ApiResponse<ActionBrief>>> {
  return NextResponse.json(
    { ok: false, error: 'Not implemented yet — Phase 4' },
    { status: 501 },
  );
}
