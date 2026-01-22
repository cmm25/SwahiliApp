import { GoogleGenAI } from "@google/genai";
import { Groq } from "groq-sdk";

// Initialize Google GenAI Client
const googleAi = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

// Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: false,
});

export type LLMProvider = 'google' | 'groq';

interface LLMOptions {
    provider?: LLMProvider;
    model?: string;
    temperature?: number;
}

export async function callLLM(
    systemPrompt: string,
    userPrompt: string,
    options: LLMOptions = {}
): Promise<string | null> {
    // Default to Groq (Fast) if not specified
    const provider = options.provider || 'groq';
    const temperature = options.temperature ?? 0.7;

    try {
        switch (provider) {
            case 'groq':
                // Default free/fast model: llama-3.3-70b-versatile
                return await callGroq(systemPrompt, userPrompt, options.model || 'llama-3.3-70b-versatile', temperature);
            case 'google':
                // Default smart/long-context model: gemini-1.5-flash
                return await callGoogle(systemPrompt, userPrompt, options.model || 'gemini-1.5-flash', temperature);
            default:
                // Fallback to Groq
                return await callGroq(systemPrompt, userPrompt, 'llama-3.3-70b-versatile', temperature);
        }
    } catch (error) {
        console.error(`LLM Call Failed (${provider}):`, error);
        throw error;
    }
}

async function callGroq(system: string, user: string, model: string, temp: number) {
    if (!process.env.GROQ_API_KEY) {
        console.warn("Missing GROQ_API_KEY");
        return null;
    }

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        model: model,
        temperature: temp,
    });
    return completion.choices[0]?.message?.content || null;
}

async function callGoogle(system: string, user: string, model: string, temp: number) {
    if (!process.env.GOOGLE_API_KEY) {
        console.warn("Missing GOOGLE_API_KEY");
        return null;
    }

    try {
        const response = await googleAi.models.generateContent({
            model: model,
            contents: [
                {
                    role: 'user',
                    parts: [{ text: user }]
                }
            ],
            config: {
                systemInstruction: system,
                temperature: temp,
            },
        });

        return response.text || null;
    } catch (error) {
        console.error("Google GenAI Error:", error);
        throw error;
    }
}
