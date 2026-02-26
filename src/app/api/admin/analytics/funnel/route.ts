import { NextResponse } from 'next/server';
import { MOCK_FUNNEL_STEPS, MOCK_FUNNEL_STEPS_30D } from '@/lib/mock-data';

// GET /api/admin/analytics/funnel?period=30d&theme=all&country=all
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') ?? '30d';
  const theme = searchParams.get('theme') ?? 'all';
  const country = searchParams.get('country') ?? 'all';

  // Select data based on period
  const steps = period === '30d' ? MOCK_FUNNEL_STEPS_30D : MOCK_FUNNEL_STEPS;

  return NextResponse.json({
    data: steps,
    meta: { period, theme, country },
  });
}
