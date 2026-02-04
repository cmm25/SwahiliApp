'use client';

/**
 * AgentTraceChart - Visual breakdown of traces by agent
 */

import { SketchCard } from '@/components/shared/SketchCard';
import { TraceBreakdown } from '@/hooks/useAdminStats';

interface AgentTraceChartProps {
  data: TraceBreakdown[] | null;
  isLoading?: boolean;
}

// Agent name to friendly display name
const agentLabels: Record<string, string> = {
  teaching: 'Teaching',
  grammar: 'Grammar',
  culture: 'Culture',
  conversation: 'Conversation',
  article: 'Article',
  evaluator: 'Evaluator',
};

// Agent colors
const agentColors: Record<string, string> = {
  teaching: 'bg-accent',
  grammar: 'bg-success',
  culture: 'bg-warning',
  conversation: 'bg-primary',
  article: 'bg-destructive',
  evaluator: 'bg-muted-foreground',
};

export function AgentTraceChart({ data, isLoading }: AgentTraceChartProps) {
  if (isLoading) {
    return (
      <SketchCard>
        <h4 className="font-hand text-lg mb-4">Agent Activity (7 days)</h4>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-1" />
              <div className="h-6 bg-muted rounded" />
            </div>
          ))}
        </div>
      </SketchCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SketchCard>
        <h4 className="font-hand text-lg mb-4">Agent Activity (7 days)</h4>
        <p className="font-hand-secondary text-sm text-muted-foreground">
          No agent traces recorded yet.
        </p>
      </SketchCard>
    );
  }

  // Calculate max for relative bar widths
  const maxCount = Math.max(...data.map((d) => d.trace_count));

  return (
    <SketchCard>
      <h4 className="font-hand text-lg mb-4">Agent Activity (7 days)</h4>
      <div className="space-y-3">
        {data.map((agent) => {
          const percentage = maxCount > 0 ? (agent.trace_count / maxCount) * 100 : 0;
          const label = agentLabels[agent.agent_name] || agent.agent_name;
          const colorClass = agentColors[agent.agent_name] || 'bg-primary';

          return (
            <div key={agent.agent_name}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-hand-secondary text-sm">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-hand text-sm">{agent.trace_count}</span>
                  {agent.avg_feedback !== null && (
                    <span className="font-hand-secondary text-xs text-muted-foreground">
                      ({(agent.avg_feedback * 100).toFixed(0)}% quality)
                    </span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="font-hand-secondary text-xs text-muted-foreground mt-0.5">
                {agent.unique_users} unique user{agent.unique_users !== 1 ? 's' : ''}
              </p>
            </div>
          );
        })}
      </div>
    </SketchCard>
  );
}
