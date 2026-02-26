import { NextResponse } from 'next/server';
import { MOCK_RECOVERY_CAMPAIGNS } from '@/lib/mock-data';

// GET /api/admin/recovery/campaigns?type=design_abandoned|cart_abandoned
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let filtered = MOCK_RECOVERY_CAMPAIGNS;
  if (type) {
    filtered = filtered.filter((c) => c.campaignType === type);
  }

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
      byType: {
        design_abandoned: MOCK_RECOVERY_CAMPAIGNS.filter(
          (c) => c.campaignType === 'design_abandoned',
        ).length,
        cart_abandoned: MOCK_RECOVERY_CAMPAIGNS.filter(
          (c) => c.campaignType === 'cart_abandoned',
        ).length,
      },
    },
  });
}
