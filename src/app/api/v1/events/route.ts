import { NextResponse } from 'next/server';

// POST /api/v1/events - Receives events from the customer frontend
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, sessionId, customerId, metadata } = body;

    // Validate required fields
    if (!eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 },
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 },
      );
    }

    // In production, persist to database here
    const eventId = crypto.randomUUID();

    return NextResponse.json({
      success: true,
      eventId,
      received: {
        eventType,
        sessionId,
        customerId: customerId ?? null,
        metadata: metadata ?? {},
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }
}
