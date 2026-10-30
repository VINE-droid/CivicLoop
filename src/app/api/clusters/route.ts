import { type NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, Cluster } from '@/lib/types';

export async function GET(
  _req: NextRequest,
): Promise<NextResponse<ApiResponse<Cluster[]>>> {
  return NextResponse.json({ ok: true, data: [] });
}
