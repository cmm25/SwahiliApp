import { callLLM } from '@/lib/llm';
import { logTrace, logDelayedFeedback } from '@/lib/opik';
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
    history: ChatMessage[] = [],
    userId?: string
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
    const traceResult = await logTrace({
        agentName: 'conversation-rafiki',
        input: message,
        output: response,
        userId: userId,
        metadata: {
            historyLength: history.length,
            latencyMs: latency,
            topic: 'general',
            timestamp: new Date().toISOString()
        }
    });

    console.log('🔍 Trace result:', traceResult);

    // 3. Self-Evaluation Loop (Async)
    // We don't await this so the user gets the response fast
    if (traceResult && (traceResult.opikTraceId || traceResult.id)) {
        // Get the actual trace ID - could be from Opik or Supabase
        const opikTraceId = traceResult.opikTraceId;
        const supabaseTraceId = traceResult.id;

        console.log('🔍 Starting async evaluation for trace:', { opikTraceId, supabaseTraceId });

        // Run evaluation asynchronously
        evaluateResponse(message, response, "Swahili learning conversation")
            .then(async (evaluation) => {
                if (evaluation && evaluation.score !== undefined) {
                    console.log(`[Opik] Evaluation completed: Score ${evaluation.score}`);

                    // Create trace data for delayed feedback
                    const traceDataForFeedback = {
                        agentName: 'conversation-rafiki',
                        input: message,
                        output: response,
                        userId: userId,
                        metadata: {
                            originalTraceId: opikTraceId,
                            evaluationScore: evaluation.score,
                            evaluationType: 'auto-evaluation'
                        }
                    };

                    try {
                        // Log delayed feedback to Opik
                        await logDelayedFeedback(
                            traceDataForFeedback,
                            evaluation.score,
                            'auto_evaluation_score'
                        );
                        console.log(`[Opik] Auto-evaluated Rafiki response: Score ${evaluation.score}`);
                    } catch (feedbackError) {
                        console.error("[Opik] Failed to log delayed feedback:", feedbackError);
                    }
                } else {
                    console.warn("[Opik] Evaluation returned no score");
                }
            })
            .catch(err => {
                console.error("[Opik] Auto-evaluation failed:", err);
            });
    } else {
        console.warn("[Opik] No trace ID available for evaluation");
    }

    return response;
}

// Helper function to get user ID from request context if available
export function extractUserId(request?: { user?: { id?: string } }): string | undefined {
    // Add your user ID extraction logic here
    // For example, from JWT token, session, etc.
    return request?.user?.id || undefined;
}

// Enhanced version with better error handling
export async function chatWithRafikiEnhanced(
    message: string,
    history: ChatMessage[] = [],
    userId?: string,
    options?: {
        skipEvaluation?: boolean;
        customMetadata?: Record<string, unknown>;
    }
) {
    try {
        const recentHistory = history.slice(-10);

        const conversationPrompt = `
      Conversation History:
      ${recentHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
      
      User: "${message}"
      Rafiki:
      `;

        // 1. Call LLM with timing
        const startTime = Date.now();
        const response = await callLLM(RAFIKI_SYSTEM_PROMPT, conversationPrompt);
        const latency = Date.now() - startTime;

        if (!response) {
            throw new Error("Failed to generate response from Rafiki");
        }

        // 2. Log Trace with enhanced metadata
        const traceResult = await logTrace({
            agentName: 'conversation-rafiki',
            input: message,
            output: response,
            userId: userId,
            metadata: {
                historyLength: history.length,
                latencyMs: latency,
                topic: 'general',
                timestamp: new Date().toISOString(),
                version: '1.0',
                ...options?.customMetadata
            }
        });

        // 3. Async evaluation (if not skipped)
        if (!options?.skipEvaluation && traceResult?.opikTraceId) {
            setImmediate(async () => {
                try {
                    const evaluation = await evaluateResponse(
                        message,
                        response,
                        "Swahili learning conversation"
                    );

                    if (evaluation?.score !== undefined) {
                        await logDelayedFeedback(
                            {
                                agentName: 'conversation-rafiki',
                                input: message,
                                output: response,
                                userId: userId,
                                metadata: {
                                    originalTraceId: traceResult.opikTraceId,
                                    evaluationScore: evaluation.score
                                }
                            },
                            evaluation.score,
                            'auto_evaluation_score'
                        );
                        console.log(`[Opik] Auto-evaluated Rafiki response: Score ${evaluation.score}`);
                    }
                } catch (evalError) {
                    console.error("[Opik] Auto-evaluation pipeline failed:", evalError);
                }
            });
        }

        return {
            response,
            traceId: traceResult?.opikTraceId,
            metadata: {
                latency,
                historyLength: history.length
            }
        };

    } catch (error) {
        console.error("[Rafiki] Chat failed:", error);

        // Log error trace
        await logTrace({
            agentName: 'conversation-rafiki-error',
            input: message,
            output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            userId: userId,
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            }
        });

        throw error;
    }
}
