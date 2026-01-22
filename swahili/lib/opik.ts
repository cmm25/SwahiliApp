import { supabaseAdmin } from '@/lib/supabase-server';
import { Opik } from 'opik';

const opikClient = new Opik({
    workspaceName: process.env.OPIK_WORKSPACE!,
    projectName: process.env.OPIK_PROJECT_NAME!,
    apiKey: process.env.OPIK_API_KEY!,
});

export interface TraceData {
    userId?: string;
    agentName: string;
    input: string;
    output: string;
    metadata?: Record<string, any>;
    feedbackScore?: number;
}

export async function logTrace(data: TraceData) {
    const results = await Promise.allSettled([
        logToSupabase(data),
        logToOpik(data)
    ]);

    const [supabaseResult, opikResult] = results;

    return {
        id: supabaseResult.status === 'fulfilled' ? supabaseResult.value : null,
        opikTraceId: opikResult.status === 'fulfilled' ? opikResult.value : undefined,
        errors: results
            .filter(r => r.status === 'rejected')
            .map(r => (r as PromiseRejectedResult).reason)
    };
}

async function logToSupabase(data: TraceData): Promise<string> {
    const { data: insertedTrace, error } = await supabaseAdmin
        .from('agent_traces')
        .insert({
            user_id: data.userId,
            agent_name: data.agentName,
            input: data.input,
            output: data.output,
            metadata: data.metadata || {},
        })
        .select('id')
        .single();

    if (error) throw new Error(`Supabase error: ${error.message}`);
    return insertedTrace.id;
}

async function logToOpik(data: TraceData): Promise<string> {
    // Build feedback scores array if provided - using correct FeedbackScore interface
    const feedbackScores = data.feedbackScore !== undefined ? [
        {
            name: "quality_score",
            value: data.feedbackScore,
            source: "sdk" as const,
        }
    ] : undefined;

    const trace = opikClient.trace({
        name: data.agentName,
        input: { message: data.input },
        output: { response: data.output },
        metadata: {
            ...data.metadata,
            user_id: data.userId,
        },
        feedbackScores: feedbackScores,
    });

    await trace.end();
    return trace.id;
}

export async function updateTraceScore(
    dbTraceId: string,
    score: number,
    metadata?: Record<string, any>
) {
    try {
        await supabaseAdmin
            .from('agent_traces')
            .update({
                metadata: { score, ...metadata }
            })
            .eq('id', dbTraceId);
    } catch (error) {
        console.error("Failed to update trace score:", error);
        throw error;
    }
}

export async function logDelayedFeedback(
    originalTraceData: TraceData,
    feedbackScore: number,
    feedbackName: string = "delayed_feedback"
) {
    try {
        const trace = opikClient.trace({
            name: `${originalTraceData.agentName}_feedback`,
            input: { original_input: originalTraceData.input },
            output: { feedback_provided: true },
            metadata: {
                ...originalTraceData.metadata,
                feedback_type: "delayed",
                user_id: originalTraceData.userId,
            },
            feedbackScores: [{
                name: feedbackName,
                value: feedbackScore,
                source: "sdk" as const,
            }],
        });

        await trace.end();
        return trace.id;
    } catch (error) {
        console.error("Failed to log delayed feedback:", error);
        throw error;
    }
}
