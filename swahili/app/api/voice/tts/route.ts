import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/lib/elevenlabs';
import { getUserFromRequest } from '@/lib/auth-supabase';

export async function POST(req: NextRequest) {
    // 1. Auth Check (Optional: restrict TTS to logged-in users to save credits)
    const user = await getUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { text, voiceId } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const audioStream = await generateSpeech(text, voiceId);

        if (!audioStream) {
            return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
        }

        // Return audio stream
        const headers = new Headers();
        headers.set("Content-Type", "audio/mpeg");

        return new NextResponse(audioStream as any, { headers });

    } catch (error) {
        console.error("TTS API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
