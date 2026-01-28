import { NextRequest, NextResponse } from 'next/server';
import { chatWithRafiki } from '@/lib/agents/conversation';
import { getUserFromRequest } from '../../../../lib/auth-supabase';

export async function POST(req: NextRequest) {
    // 1. Auth Check
    const user = await getUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Parse Body
        const { message, history, sessionId } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 3. Run Agent
        const reply = await chatWithRafiki(message, history || [], user.id, sessionId);

        // 4. Response
        return NextResponse.json({
            role: 'assistant',
            content: reply
        });

    } catch (error) {
        console.error("Conversation API Error:", error);
        return NextResponse.json({ error: 'Failed to chat with Rafiki' }, { status: 500 });
    }
}
