import { callLLM } from '@/lib/llm';
import { logTrace, updateTraceScore } from '@/lib/opik';
import { evaluateResponse } from './evaluator';

const RAFIKI_SYSTEM_PROMPT = `
You are Rafiki, a friendly and patient Swahili tutor.
Your goal is to help the user learn Swahili through conversation.

Guidelines:
1.  **Language**: Reply mostly in Swahili, but provide English translations for difficult phrases in parentheses.
2.  **Correction**: If the user makes a mistake, gently correct them, but keep the conversation flowing.
3.  **Cultural Notes**: Occasionally add a brief fun fact about Swahili culture or East Africa if relevant.
4.  **Tone**: Encouraging, warm, like a helpful friend.
5.  **Length**: Keep responses concise (under 3 sentences) to encourage back-and-forth.

Current User Level: Beginner/Intermediate
Topic: General Conversation
`;

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function chatWithRafiki(
    message: string,
    history: ChatMessage[] = []
) {
    // Construct the conversation history for the LLM
    // We keep the last 10 turns to maintain context without exceeding tokens
    const recentHistory = history.slice(-10);

    const conversationPrompt = `
  Conversation History:
  ${recentHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
  
  User: "${message}"
  Rafiki:
  `;

    // 1. Call LLM
    const startTime = Date.now();
    const response = await callLLM(RAFIKI_SYSTEM_PROMPT, conversationPrompt);
    const latency = Date.now() - startTime;

    if (!response) {
        throw new Error("Failed to generate response from Rafiki");
    }

    // 2. Log Trace to Opik (Observability)
    // We log this *before* returning to the user so we capture the interaction
    const trace = await logTrace({
        agentName: 'conversation-rafiki',
        input: message,
        output: response,
        metadata: {
            history_length: history.length,
            latency_ms: latency,
            topic: 'general' // Could be dynamic later
        }
    });

    // 3. Self-Evaluation Loop (Async)
    // We don't await this so the user gets the response fast
    // The "Judge" (Evaluator Agent) will score this response
    if (trace) {
        evaluateResponse(message, response, "Swahili learning conversation")
            .then(async (evaluation) => {
                if (evaluation) {
                    // 4. Update Trace with Score
                    // We pass the Opik Trace ID if available (attached to the trace object return)
                    await updateTraceScore(trace.id, evaluation.score, (trace as any).opikTraceId);
                    console.log(`[Opik] Auto-evaluated Rafiki response: Score ${evaluation.score}`);
                }
            })
            .catch(err => console.error("[Opik] Auto-evaluation failed:", err));
    }

    return response;
}
