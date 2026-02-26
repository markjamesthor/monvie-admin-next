import { NextResponse } from 'next/server';
import {
  MOCK_DAILY_REVENUE,
  MOCK_WEEKLY_REVENUE,
  MOCK_MONTHLY_REVENUE,
} from '@/lib/mock-data';

// GET /api/admin/dashboard/revenue?period=30d&groupBy=day|week|month
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') ?? '30d';
  const groupBy = searchParams.get('groupBy') ?? 'day';

  let data;
  switch (groupBy) {
    case 'week':
      data = MOCK_WEEKLY_REVENUE;
      break;
    case 'month':
      data = MOCK_MONTHLY_REVENUE;
      break;
    case 'day':
    default:
      data = MOCK_DAILY_REVENUE;
      break;
  }

  return NextResponse.json({
    data,
    meta: { period, groupBy },
  });
}
