import { supabase } from '@/integrations/supabase/client';

export interface AgentTraceInput {
  userId: string;
  agentName: string;
  input: string;
  output: string;
  latencyMs: number;
  success: boolean;
  metadata?: Record<string, unknown>;
  evaluationScore?: number;
  sessionId?: string | null;
  opikTraceId?: string | null;
}

/**
 * Log an agent trace to the database
 */
export async function logAgentTrace(trace: AgentTraceInput): Promise<void> {
  try {
    const { error } = await (supabase.from('agent_traces' as never).insert({
      user_id: trace.userId,
      agent_name: trace.agentName,
      input: trace.input,
      output: trace.output,
      duration_ms: trace.latencyMs,
      feedback_score: trace.evaluationScore,
      session_id: trace.sessionId ?? null,
      opik_trace_id: trace.opikTraceId ?? null,
      metadata: {
        ...trace.metadata,
        success: trace.success,
      },
    } as never) as unknown as Promise<{ error: Error | null }>);

    if (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: unknown }).message ?? '')
          : '';
      if (message) {
        console.warn('Failed to log agent trace:', message);
      }
    }
  } catch (err) {
    // Don't throw - logging should never break the main flow
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : '';
    if (message) {
      console.warn('Agent logging error:', message);
    }
  }
}
