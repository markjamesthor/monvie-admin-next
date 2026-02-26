import { NextResponse } from 'next/server';
import type { OrderStatus } from '@/types';

const VALID_STATUSES: OrderStatus[] = [
  'paid',
  'preparing',
  'in_production',
  'quality_check',
  'packing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

// PATCH /api/admin/orders/:id/status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 },
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // In production, update the order status in the database
    // For mock mode, just return success
    return NextResponse.json({
      success: true,
      data: {
        orderId: id,
        previousStatus: 'unknown', // Would come from DB in production
        newStatus: status,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }
}
