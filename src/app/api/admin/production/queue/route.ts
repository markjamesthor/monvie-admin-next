import { NextResponse } from 'next/server';
import { MOCK_ORDERS } from '@/lib/mock-data';
import type { ProductionStatus } from '@/types';

// Production pipeline statuses (orders that are actively in production)
const PRODUCTION_PIPELINE_STATUSES = [
  'preparing',
  'in_production',
  'quality_check',
  'packing',
] as const;

// GET /api/admin/production/queue?status=pending|printing|binding|quality_check|done
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') as ProductionStatus | null;

  // Get orders in the production pipeline
  const productionOrders = MOCK_ORDERS.filter((o) =>
    (PRODUCTION_PIPELINE_STATUSES as readonly string[]).includes(o.status),
  );

  // Extract order items with order context
  const queueItems = productionOrders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      estimatedDeliveryAt: order.estimatedDeliveryAt,
      orderCreatedAt: order.createdAt,
    })),
  );

  // Filter by production status if specified
  const filtered = statusFilter
    ? queueItems.filter((item) => item.productionStatus === statusFilter)
    : queueItems;

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      byStatus: {
        pending: queueItems.filter((i) => i.productionStatus === 'pending').length,
        printing: queueItems.filter((i) => i.productionStatus === 'printing').length,
        binding: queueItems.filter((i) => i.productionStatus === 'binding').length,
        quality_check: queueItems.filter((i) => i.productionStatus === 'quality_check').length,
        done: queueItems.filter((i) => i.productionStatus === 'done').length,
      },
    },
  });
}
