import { NextResponse } from 'next/server';
import {
  MOCK_CUSTOMERS,
  MOCK_DESIGN_SESSIONS,
  MOCK_ORDERS,
  MOCK_CART_ITEMS,
} from '@/lib/mock-data';

// GET /api/admin/customers/:id
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);

  if (!customer) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 },
    );
  }

  // Include related data for the customer detail view
  const designSessions = MOCK_DESIGN_SESSIONS.filter(
    (s) => s.customerId === id,
  );
  const orders = MOCK_ORDERS.filter((o) => o.customerId === id);
  const cartItems = MOCK_CART_ITEMS.filter((c) => c.customerId === id);

  return NextResponse.json({
    data: {
      ...customer,
      designSessions,
      orders,
      cartItems,
    },
  });
}
