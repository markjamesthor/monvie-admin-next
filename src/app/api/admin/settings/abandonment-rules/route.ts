import { NextResponse } from 'next/server';

// Default abandonment rules configuration
const DEFAULT_RULES = {
  designAbandonment: {
    timeoutMinutes: 60,
    maxRecoveryEmails: 3,
    emailDelayMinutes: [60, 1440, 4320], // 1h, 24h, 72h
    includeDiscountOnAttempt: 2,
    discountPercent: 10,
  },
  cartAbandonment: {
    timeoutMinutes: 30,
    maxRecoveryEmails: 2,
    emailDelayMinutes: [60, 1440], // 1h, 24h
    includeDiscountOnAttempt: 2,
    discountAmount: 5000, // KRW
  },
  global: {
    enableRecoveryEmails: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    timezone: 'Asia/Seoul',
    maxEmailsPerCustomerPerDay: 1,
  },
};

// In-memory store for mock mode
let currentRules = { ...DEFAULT_RULES };

// GET /api/admin/settings/abandonment-rules
export async function GET() {
  return NextResponse.json({
    data: currentRules,
  });
}

// PUT /api/admin/settings/abandonment-rules
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Merge with current rules (shallow merge per section)
    currentRules = {
      designAbandonment: {
        ...currentRules.designAbandonment,
        ...(body.designAbandonment ?? {}),
      },
      cartAbandonment: {
        ...currentRules.cartAbandonment,
        ...(body.cartAbandonment ?? {}),
      },
      global: {
        ...currentRules.global,
        ...(body.global ?? {}),
      },
    };

    return NextResponse.json({
      success: true,
      data: currentRules,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }
}
