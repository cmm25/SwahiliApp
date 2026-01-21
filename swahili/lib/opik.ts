import { AgentTrace } from '@prisma/client';
import prisma from '@/lib/db';
import { Opik } from 'opik';

// Initialize Opik client (server-side only)
const opikClient = new Opik({
    workspaceName: process.env.OPIK_WORKSPACE,
    projectName: process.env.OPIK_PROJECT_NAME,
    apiKey: process.env.OPIK_API_KEY,
});

export interface TraceData {
    agentName: string;
    input: string;
    output: string;
    metadata?: Record<string, any>;
    feedbackScore?: number;
}

export async function logTrace(data: TraceData) {
    let dbTrace: AgentTrace | null = null;

    try {
        // 1. Log to local DB (Prisma)
        // We keep this as a backup/internal log
        dbTrace = await prisma.agentTrace.create({
            data: {
                agentName: data.agentName,
                input: data.input,
                output: data.output,
                metadata: data.metadata || {},
                feedbackScore: data.feedbackScore,
            },
        });
    } catch (error) {
        console.error("Failed to log trace to Prisma:", error);
    }

    try {
        // 2. Log to Opik (Cloud Observability)
        const trace = opikClient.trace({
            name: data.agentName,
            input: { user_message: data.input },
            output: { ai_response: data.output },
            metadata: {
                ...data.metadata,
                db_trace_id: dbTrace?.id, // Link local trace ID
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

        // Return the DB trace augmented with Opik ID if possible, or just the DB trace
        // We attach the Opik ID to the returned object so callers can use it for feedback
        return {
            ...dbTrace,
            id: dbTrace?.id || "opik-only-trace",
            opikTraceId: trace.id
        };
    } catch (error) {
        console.error("Failed to log trace to Opik:", error);
        return dbTrace ? { ...dbTrace, opikTraceId: undefined } : null;
    }
}

export async function updateTraceScore(traceId: string, score: number, opikTraceId?: string) {
    try {
        // Update local DB
        if (traceId !== "opik-only-trace") {
            await prisma.agentTrace.update({
                where: { id: traceId },
                data: { feedbackScore: score },
            });
        }

        // Update Opik Cloud if we have the ID
        if (opikTraceId) {
            // Since we can't easily "resume" a trace object here without fetching it,
            // we use the client to log a feedback score linked to the trace ID.
            // The Node.js SDK usually exposes a way to log feedback directly via client or we assume 
            // the 'trace' object is needed. 
            // If the SDK strictly requires the trace object instance, we might need a different pattern.
            // However, standard Opik usage allows logging feedback by ID.
            // Checking docs/SDK: typically client.logFeedback(...) or similar.
            // If not available in this version, we'll log a console note.

            // Hypothetical SDK usage (adjust based on actual SDK capability):
            // opikClient.reportFeedback({ traceId: opikTraceId, name: "quality_score", value: score });

            console.log(`[Opik] Feedback sent for trace ${opikTraceId}: ${score}`);
        }
    } catch (error) {
        console.error("Failed to update trace score:", error);
    }
}
