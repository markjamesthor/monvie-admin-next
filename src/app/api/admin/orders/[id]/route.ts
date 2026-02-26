import { NextResponse } from 'next/server';
import { MOCK_ORDERS, MOCK_ORDER_TIMELINE } from '@/lib/mock-data';

// GET /api/admin/orders/:id
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = MOCK_ORDERS.find((o) => o.id === id);

  if (!order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 },
    );
  }

  // Include timeline events if available
  const timeline = MOCK_ORDER_TIMELINE[id] ?? [];

  return NextResponse.json({
    data: { ...order, timeline },
  });
}
