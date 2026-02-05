import { NextRequest, NextResponse } from 'next/server';
import { logTrace } from '@/lib/opik';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      agentName,
      input,
      output,
      latencyMs,
      success,
      metadata,
      sessionId,
    } = body ?? {};

    if (!agentName) {
      return NextResponse.json({ error: 'agentName is required' }, { status: 400 });
    }

    const actionTag =
      metadata && typeof metadata.action === 'string' ? metadata.action : undefined;
    const tags = ['quiz-agent', actionTag].filter(Boolean) as string[];

    const traceResult = await logTrace({
      userId,
      agentName,
      input: String(input ?? ''),
      output: String(output ?? ''),
      sessionId,
      latencyMs: typeof latencyMs === 'number' ? latencyMs : undefined,
      metadata: {
        ...(metadata ?? {}),
        success: Boolean(success),
      },
      tags,
    });

    return NextResponse.json({ success: true, trace: traceResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
