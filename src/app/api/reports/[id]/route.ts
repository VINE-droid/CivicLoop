import { type NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, ReportDetail } from '@/lib/types';

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(
  _req: NextRequest,
  { params }: Ctx,
): Promise<NextResponse<ApiResponse<ReportDetail>>> {
  const { id } = await params;
  return NextResponse.json(
    { ok: false, error: `Report ${id} — not implemented yet (Phase 3)` },
    { status: 501 },
  );
}
