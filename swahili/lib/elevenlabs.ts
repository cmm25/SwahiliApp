import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function generateSpeech(text: string, voiceId = "u0TsaWvt0v8migutHM3M") {
    try {
        const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
            text,
            modelId: "eleven_multilingual_v2",
            outputFormat: "mp3_44100_128",
            voiceSettings: {
                stability: 0.5,
                similarityBoost: 0.75,
            },
        });

        return audioStream;
    } catch (error) {
        console.error("ElevenLabs TTS Error:", error);
        return null;
    }
}
