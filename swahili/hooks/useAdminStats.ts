import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from './useIsAdmin';

// Type definitions for admin stats
export interface LearningStats {
  total_xp_earned: number;
  total_lessons_completed: number;
  total_words_learned: number;
  average_streak: number;
  max_streak: number;
  average_level: number;
}

export interface TraceStats {
  total_traces: number;
  traces_with_output: number;
  traces_with_feedback: number;
  average_feedback_score: number;
  unique_users: number;
  unique_sessions: number;
  traces_by_agent: Record<string, number>;
  traces_today: number;
  traces_this_week: number;
  traces_this_month: number;
}

export interface FeedbackStats {
  total_feedback: number;
  average_rating: number;
  feedback_by_type: Record<string, number>;
}

export interface SessionStats {
  total_sessions: number;
  total_xp_from_sessions: number;
  total_words_practiced: number;
  average_accuracy: number;
  sessions_by_type: Record<string, number>;
}

export interface TraceBreakdown {
  agent_name: string;
  trace_count: number;
  successful_traces: number;
  avg_feedback: number | null;
  unique_users: number;
}

export interface AdminStats {
  userCount: number | null;
  activeUsers: number | null;
  usersToday: number | null;
  usersThisWeek: number | null;
  learningStats: LearningStats | null;
  traceStats: TraceStats | null;
  feedbackStats: FeedbackStats | null;
  sessionStats: SessionStats | null;
  traceBreakdown: TraceBreakdown[] | null;
  opikAnalytics: OpikAnalytics | null;
}

export interface OpikAnalytics {
  timestamp: string;
  overview: {
    total_interactions: number;
    breakdown: Record<string, number>;
  };
  performance: {
    teaching_success: number;
    quiz_average: number;
    conversation_turns: number;
  };
}

interface AdminStatsState {
  stats: AdminStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAdminStats(): AdminStatsState {
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    userCount: null,
    activeUsers: null,
    usersToday: null,
    usersThisWeek: null,
    learningStats: null,
    traceStats: null,
    feedbackStats: null,
    sessionStats: null,
    traceBreakdown: null,
    opikAnalytics: null,
  });

  const fetchStats = useCallback(async () => {
    if (!isAdmin || adminLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Helper to call RPC with proper typing
      const rpc = async <T>(fn: string, args?: Record<string, unknown>): Promise<T | null> => {
        const { data, error } = await (supabase.rpc(fn as never, args as never) as unknown as Promise<{
          data: T | null;
          error: Error | null;
        }>);
        if (error) {
          console.warn(`RPC ${fn} failed:`, error);
          return null;
        }
        return data;
      };

      // Fetch all stats in parallel
      const [
        userCount,
        activeUsers,
        usersToday,
        usersThisWeek,
        learningStats,
        traceStats,
        feedbackStats,
        sessionStats,
        traceBreakdown,
        opikAnalytics
      ] = await Promise.all([
        rpc<number>('admin_get_user_count'),
        rpc<number>('admin_get_active_users', { days_ago: 7 }),
        rpc<number>('admin_get_users_created_between', {
          start_date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
          end_date: new Date().toISOString(),
        }),
        rpc<number>('admin_get_users_created_between', {
          start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString(),
        }),
        rpc<LearningStats>('admin_get_learning_stats'),
        rpc<TraceStats>('admin_get_trace_stats'),
        rpc<FeedbackStats>('admin_get_feedback_stats'),
        rpc<SessionStats>('admin_get_session_stats'),
        rpc<TraceBreakdown[]>('admin_get_trace_breakdown', { days_back: 7 }),
        // Fetch from internal proxy API gracefully
        fetch('/api/admin/analytics').then(res => res.ok ? res.json() : null).catch(() => null) as Promise<OpikAnalytics | null>
      ]);

      setStats({
        userCount,
        activeUsers,
        usersToday,
        usersThisWeek,
        learningStats,
        traceStats,
        feedbackStats,
        sessionStats,
        traceBreakdown,
        opikAnalytics,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch admin stats';
      setError(message);
      console.error('Admin stats error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, adminLoading]);

  return {
    stats,
    isLoading: isLoading || adminLoading,
    error,
    refetch: fetchStats,
  };
}
