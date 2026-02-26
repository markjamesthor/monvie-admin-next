import { NextResponse } from 'next/server';
import { MOCK_CUSTOMERS } from '@/lib/mock-data';

// GET /api/admin/customers?segment=all|vip|at_risk|new&page=1&limit=20
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const segment = searchParams.get('segment') ?? 'all';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10)));

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter by segment
  let filtered = MOCK_CUSTOMERS;
  switch (segment) {
    case 'vip':
      // VIP: totalOrders >= 3
      filtered = filtered.filter((c) => c.totalOrders >= 3);
      break;
    case 'new':
      // New: created in last 30 days
      filtered = filtered.filter(
        (c) => new Date(c.createdAt) >= thirtyDaysAgo,
      );
      break;
    case 'at_risk':
      // At risk: no activity in 7+ days
      filtered = filtered.filter(
        (c) => new Date(c.lastActivityAt) < sevenDaysAgo,
      );
      break;
    case 'all':
    default:
      break;
  }

  // Paginate
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return NextResponse.json({
    data,
    meta: { total, page, limit, totalPages, segment },
  });
}
