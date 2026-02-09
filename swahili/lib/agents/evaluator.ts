import { callLLM } from '@/lib/llm';
import { logTrace } from '@/lib/opik';
import { TEMPLATES, SYSTEM_PROMPTS, formatPrompt } from '@/lib/prompts';

export async function evaluateResponse(
    input: string,
    output: string,
    context?: string
) {
    const template = TEMPLATES.EVALUATE_RESPONSE;
    const userPrompt = formatPrompt(template.prompt, {
        context: context || 'General conversation',
        input: input,
        output: output
    });

    const response = await callLLM(SYSTEM_PROMPTS.EVALUATOR.prompt, userPrompt);

    if (!response) return null;

    try {
        const result = JSON.parse(response);

        // Log this evaluation itself (meta-monitoring)
        await logTrace({
            agentName: 'evaluator',
            input: `Eval request for: ${input.substring(0, 20)}...`,
            output: JSON.stringify(result),
            metadata: {
                evaluated_output: output,
                prompt_name: template.name,
                prompt_version: template.version
            },
        });

        return result;
    } catch (e) {
        console.error("Evaluator JSON parse error", e);
        return { score: 0, reason: "Evaluation failed" };
    }
}
