import { NextRequest, NextResponse } from 'next/server';
import { evaluateResponse } from '@/lib/agents/evaluator';
import { getUserFromRequest } from '@/lib/auth-supabase';

export async function POST(req: NextRequest) {
  // 1. Auth Check
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Parse Body
    const { input, output, context } = await req.json();

    if (!input || !output) {
      return NextResponse.json({ error: 'Missing input or output' }, { status: 400 });
    }

    // 3. Run Agent
    const evaluation = await evaluateResponse(input, output, context);

    // 4. Response
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Evaluator API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
