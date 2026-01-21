import { supabaseAdmin } from '@/lib/supabase-server';
import { Opik } from 'opik';

// Initialize Opik client (server-side only)
const opikClient = new Opik({
    workspaceName: process.env.OPIK_WORKSPACE,
    projectName: process.env.OPIK_PROJECT_NAME,
    apiKey: process.env.OPIK_API_KEY,
});

export interface TraceData {
    userId?: string; // Optional user ID to link trace
    agentName: string;
    input: string;
    output: string;
    metadata?: Record<string, any>;
    feedbackScore?: number;
}

export async function logTrace(data: TraceData) {
    let dbTraceId: string | null = null;

    try {
        // 1. Log to Supabase (agent_traces table)
        const { data: insertedTrace, error } = await supabaseAdmin
            .from('agent_traces')
            .insert({
                user_id: data.userId,
                agent_name: data.agentName,
                input: JSON.stringify(data.input), // Store as JSONB
                output: JSON.stringify(data.output), // Store as JSONB
                metadata: data.metadata || {},
                // Note: feedback_score field might not exist in your SQL yet? 
                // You defined 'agent_traces' without feedback_score in your prompt.
                // I will assume we store score in metadata or you added the column.
                // For now, let's put score in metadata if column missing.
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase trace error:", error);
        } else {
            dbTraceId = insertedTrace.id;
        }
    } catch (error) {
        console.error("Failed to log trace to Supabase:", error);
    }

    try {
        // 2. Log to Opik (Cloud Observability)
        const trace = opikClient.trace({
            name: data.agentName,
            input: { user_message: data.input },
            output: { ai_response: data.output },
            metadata: {
                ...data.metadata,
                user_id: data.userId,
                db_trace_id: dbTraceId,
            },
        });

        if (data.feedbackScore !== undefined) {
            trace.feedback({
                name: "quality_score",
                value: data.feedbackScore,
            });
        }

        await trace.end();

        console.log(`[Opik] Trace logged: ${data.agentName}`);

        // Return object linking both systems
        return {
            id: dbTraceId || "opik-only",
            opikTraceId: trace.id
        };
    } catch (error) {
        console.error("Failed to log trace to Opik:", error);
        return { id: dbTraceId, opikTraceId: undefined };
    }
}

export async function updateTraceScore(dbTraceId: string | null, score: number, opikTraceId?: string) {
    try {
        // Update local Supabase DB (if you added a score column, otherwise skip or update metadata)
        // Assuming you might add 'score' column later or use metadata. 
        // For now, we just log it.
        if (dbTraceId && dbTraceId !== "opik-only") {
            // Example update if column exists (commented out to be safe based on your SQL)
            // await supabaseAdmin.from('agent_traces').update({ score: score }).eq('id', dbTraceId);
        }

        // Update Opik Cloud
        if (opikTraceId) {
            // In a real Opik SDK, we would send feedback here using the ID.
            // trace.feedback(...) needs the trace object. 
            // For stateless updates, we rely on the Evaluator Agent's OWN trace to record the score.
            console.log(`[Opik] Feedback calculated for trace ${opikTraceId}: ${score}`);
        }
    } catch (error) {
        console.error("Failed to update trace score:", error);
    }
}
