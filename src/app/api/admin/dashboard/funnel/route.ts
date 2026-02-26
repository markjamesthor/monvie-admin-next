import { NextResponse } from 'next/server';
import { MOCK_FUNNEL_STEPS, MOCK_FUNNEL_STEPS_30D } from '@/lib/mock-data';

// GET /api/admin/dashboard/funnel?period=7d&theme=all
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') ?? '7d';
  const theme = searchParams.get('theme') ?? 'all';

  // Select data based on period
  const steps = period === '30d' ? MOCK_FUNNEL_STEPS_30D : MOCK_FUNNEL_STEPS;

  return NextResponse.json({
    data: steps,
    meta: { period, theme },
  });
}
