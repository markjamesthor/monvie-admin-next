import { NextResponse } from 'next/server';
import { MOCK_ORDERS } from '@/lib/mock-data';

// GET /api/admin/orders?status=all|paid|preparing|in_production|shipped|delivered&page=1&limit=20
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? 'all';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10)));

  // Filter by status
  let filtered = MOCK_ORDERS;
  if (status !== 'all') {
    filtered = filtered.filter((o) => o.status === status);
  }

  // Paginate
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return NextResponse.json({
    data,
    meta: { total, page, limit, totalPages },
  });
}
