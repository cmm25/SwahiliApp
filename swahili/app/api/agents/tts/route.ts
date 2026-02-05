import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/lib/elevenlabs';
import { getUserFromRequest } from '@/lib/auth-supabase';

const audioCache = new Map<string, ArrayBuffer>();
const MAX_CACHE_ENTRIES = 200;

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

        const cacheKey = `${voiceId || 'default'}::${text.toLowerCase().trim()}`;
        const cached = audioCache.get(cacheKey);

        if (cached) {
            const headers = new Headers();
            headers.set("Content-Type", "audio/mpeg");
            return new NextResponse(cached, { headers });
        }

        const audioStream = await generateSpeech(text, voiceId);

        if (!audioStream) {
            return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
        }

        const arrayBuffer = await new Response(audioStream as unknown as ReadableStream).arrayBuffer();
        const audioBuffer = arrayBuffer;

        audioCache.set(cacheKey, audioBuffer);
        if (audioCache.size > MAX_CACHE_ENTRIES) {
            const firstKey = audioCache.keys().next().value as string | undefined;
            if (firstKey) {
                audioCache.delete(firstKey);
            }
        }

        const headers = new Headers();
        headers.set("Content-Type", "audio/mpeg");

        return new NextResponse(audioBuffer, { headers });

    } catch (error) {
        console.error("TTS API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
