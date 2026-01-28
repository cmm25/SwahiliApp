import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-supabase';
import { teach } from '@/lib/agents/teaching';
import { TeachingRequest } from '@/lib/agents/teaching-shared';

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body?.action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    const request: TeachingRequest = {
      userId: user.id,
      action: body.action,
      wordId: body.wordId,
      words: body.words,
      performance: body.performance,
      context: body.context,
      sessionId: body.sessionId,
    };

    const result = await teach(request);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Teaching API Error:', error);
    return NextResponse.json({ error: 'Failed to process teaching request' }, { status: 500 });
  }
}
