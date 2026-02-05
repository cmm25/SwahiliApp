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
    const response = await fetch('/api/agents/quiz-trace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trace),
    });

    if (!response.ok) {
      const message = await response.text();
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
