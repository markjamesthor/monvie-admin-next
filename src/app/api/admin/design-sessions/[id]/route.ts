import { NextResponse } from 'next/server';
import { MOCK_DESIGN_SESSIONS } from '@/lib/mock-data';

// GET /api/admin/design-sessions/:id
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = MOCK_DESIGN_SESSIONS.find((s) => s.id === id);

  if (!session) {
    return NextResponse.json(
      { error: 'Design session not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: session });
}
