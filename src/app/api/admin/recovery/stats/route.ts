import { NextResponse } from 'next/server';
import { MOCK_RECOVERY_CAMPAIGNS } from '@/lib/mock-data';

// GET /api/admin/recovery/stats?period=30d
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') ?? '30d';

  // Calculate stats from recovery campaigns
  const campaigns = MOCK_RECOVERY_CAMPAIGNS;
  const totalSent = campaigns.length;
  const totalOpened = campaigns.filter((c) => c.emailOpenedAt !== null).length;
  const totalClicked = campaigns.filter((c) => c.linkClickedAt !== null).length;
  const totalConverted = campaigns.filter((c) => c.convertedAt !== null).length;

  const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
  const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
  const conversionRate = totalSent > 0 ? (totalConverted / totalSent) * 100 : 0;

  // Breakdown by campaign type
  const designCampaigns = campaigns.filter(
    (c) => c.campaignType === 'design_abandoned',
  );
  const cartCampaigns = campaigns.filter(
    (c) => c.campaignType === 'cart_abandoned',
  );

  return NextResponse.json({
    data: {
      overall: {
        totalSent,
        totalOpened,
        totalClicked,
        totalConverted,
        openRate: Math.round(openRate * 10) / 10,
        clickRate: Math.round(clickRate * 10) / 10,
        conversionRate: Math.round(conversionRate * 10) / 10,
      },
      byType: {
        design_abandoned: {
          sent: designCampaigns.length,
          opened: designCampaigns.filter((c) => c.emailOpenedAt !== null).length,
          clicked: designCampaigns.filter((c) => c.linkClickedAt !== null).length,
          converted: designCampaigns.filter((c) => c.convertedAt !== null).length,
        },
        cart_abandoned: {
          sent: cartCampaigns.length,
          opened: cartCampaigns.filter((c) => c.emailOpenedAt !== null).length,
          clicked: cartCampaigns.filter((c) => c.linkClickedAt !== null).length,
          converted: cartCampaigns.filter((c) => c.convertedAt !== null).length,
        },
      },
    },
    meta: { period },
  });
}
