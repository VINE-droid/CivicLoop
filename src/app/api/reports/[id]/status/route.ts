import { type NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  _req: NextRequest,
  { params }: Ctx,
): Promise<NextResponse<ApiResponse<{ updated: true }>>> {
  const { id } = await params;
  return NextResponse.json(
    { ok: false, error: `status patch for ${id} not implemented yet (Phase 3)` },
    { status: 501 },
  );
}
