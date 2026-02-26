import { NextResponse } from 'next/server';
import { MOCK_DASHBOARD_KPI } from '@/lib/mock-data';

// GET /api/admin/dashboard/kpi?period=today|7d|30d
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') ?? 'today';

  // In production, compute KPIs based on the period
  // For now, return the same mock KPI regardless of period
  return NextResponse.json({
    data: MOCK_DASHBOARD_KPI,
    meta: { period },
  });
}
