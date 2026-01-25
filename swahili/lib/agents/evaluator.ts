import { callLLM } from '@/lib/llm';
import { logTrace } from '@/lib/opik';

const EVALUATOR_SYSTEM_PROMPT = `
You are an expert Swahili language evaluator. Your job is to grade the quality of AI tutor responses.
Score the response from 0.0 to 1.0 based on:
1. Accuracy (Grammar/Vocabulary)
2. Cultural Relevance
3. Pedagogical Value (Clear explanation)

Return ONLY a JSON object: { "score": number, "reason": "string" }
`;

export async function evaluateResponse(
    input: string,
    output: string,
    context?: string
) {
    const userPrompt = `
  Context: ${context || 'General conversation'}
  User Input: "${input}"
  AI Response: "${output}"
  
  Evaluate the AI response.
  `;

    const response = await callLLM(EVALUATOR_SYSTEM_PROMPT, userPrompt);

    if (!response) return null;

    try {
        const result = JSON.parse(response);

        // Log this evaluation itself (meta-monitoring)
        await logTrace({
            agentName: 'evaluator',
            input: `Eval request for: ${input.substring(0, 20)}...`,
            output: JSON.stringify(result),
            metadata: { evaluated_output: output },
        });

        return result;
    } catch (e) {
        console.error("Evaluator JSON parse error", e);
        return { score: 0, reason: "Evaluation failed" };
    }
}
