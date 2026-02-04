'use client';

/**
 * AdminDashboard - Platform statistics for admins
 */

import { useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Cpu, 
  BookOpen, 
  MessageSquare,
  Star,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { StatCard } from './StatCard';
import { AgentTraceChart } from './AgentTraceChart';
import { SketchCard } from '@/components/shared/SketchCard';
import { SketchButton } from '@/components/shared/SketchButton';

export function AdminDashboard() {
  const { stats, isLoading, error, refetch } = useAdminStats();

  // Fetch stats on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <SketchCard className="border-destructive/50">
        <div className="text-center py-4">
          <p className="font-hand text-lg text-destructive mb-2">
            Failed to load admin stats
          </p>
          <p className="font-hand-secondary text-sm text-muted-foreground mb-4">
            {error}
          </p>
          <SketchButton variant="outline" size="sm" onClick={refetch}>
            <RefreshCw size={14} className="mr-1" />
            Retry
          </SketchButton>
        </div>
      </SketchCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-hand text-xl">Admin Dashboard</h3>
          <p className="font-hand-secondary text-sm text-muted-foreground">
            Platform statistics and AI observability
          </p>
        </div>
        <SketchButton 
          variant="outline" 
          size="sm" 
          onClick={refetch}
          disabled={isLoading}
        >
          <RefreshCw size={14} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </SketchButton>
      </div>

      {/* User Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.userCount}
          icon={Users}
          subtitle={stats.usersToday ? `+${stats.usersToday} today` : undefined}
          valueClassName="text-primary"
        />
        <StatCard
          title="Active (7d)"
          value={stats.activeUsers}
          icon={Activity}
          valueClassName="text-success"
        />
        <StatCard
          title="New This Week"
          value={stats.usersThisWeek}
          icon={TrendingUp}
          valueClassName="text-accent"
        />
        <StatCard
          title="Avg Level"
          value={stats.learningStats?.average_level?.toFixed(1) ?? null}
          icon={Star}
          valueClassName="text-warning"
        />
      </div>

      {/* AI Traces Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Traces"
          value={stats.traceStats?.total_traces ?? null}
          icon={Cpu}
          subtitle={stats.traceStats?.traces_today ? `${stats.traceStats.traces_today} today` : undefined}
        />
        <StatCard
          title="Traces (Week)"
          value={stats.traceStats?.traces_this_week ?? null}
          icon={Activity}
        />
        <StatCard
          title="Unique Sessions"
          value={stats.traceStats?.unique_sessions ?? null}
          icon={MessageSquare}
        />
        <StatCard
          title="Avg Feedback"
          value={
            stats.traceStats?.average_feedback_score
              ? `${(stats.traceStats.average_feedback_score * 100).toFixed(0)}%`
              : null
          }
          icon={Star}
          valueClassName="text-success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Agent Trace Breakdown */}
        <AgentTraceChart 
          data={stats.traceBreakdown} 
          isLoading={isLoading}
        />

        {/* Learning Stats */}
        <SketchCard>
          <h4 className="font-hand text-lg mb-4">Platform Learning Stats</h4>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Total XP Earned</span>
                <span className="font-hand text-lg text-accent">
                  {stats.learningStats?.total_xp_earned?.toLocaleString() ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Lessons Completed</span>
                <span className="font-hand text-lg">
                  {stats.learningStats?.total_lessons_completed?.toLocaleString() ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Words Learned</span>
                <span className="font-hand text-lg text-success">
                  {stats.learningStats?.total_words_learned?.toLocaleString() ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Avg Streak</span>
                <span className="font-hand text-lg text-warning">
                  {stats.learningStats?.average_streak?.toFixed(1) ?? '—'} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Max Streak</span>
                <span className="font-hand text-lg">
                  {stats.learningStats?.max_streak ?? '—'} days
                </span>
              </div>
            </div>
          )}
        </SketchCard>
      </div>

      {/* Session & Feedback Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Session Stats */}
        <SketchCard>
          <h4 className="font-hand text-lg mb-4">Practice Sessions</h4>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Total Sessions</span>
                <span className="font-hand text-lg">
                  {stats.sessionStats?.total_sessions?.toLocaleString() ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Words Practiced</span>
                <span className="font-hand text-lg">
                  {stats.sessionStats?.total_words_practiced?.toLocaleString() ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Avg Accuracy</span>
                <span className="font-hand text-lg text-success">
                  {stats.sessionStats?.average_accuracy?.toFixed(1) ?? '—'}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">XP from Sessions</span>
                <span className="font-hand text-lg text-accent">
                  {stats.sessionStats?.total_xp_from_sessions?.toLocaleString() ?? '—'}
                </span>
              </div>
            </div>
          )}
        </SketchCard>

        {/* Feedback Stats */}
        <SketchCard>
          <h4 className="font-hand text-lg mb-4">User Feedback</h4>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Total Feedback</span>
                <span className="font-hand text-lg">
                  {stats.feedbackStats?.total_feedback ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-hand-secondary text-sm">Avg Rating</span>
                <span className="font-hand text-lg text-warning">
                  {stats.feedbackStats?.average_rating?.toFixed(1) ?? '—'} ⭐
                </span>
              </div>
              {stats.feedbackStats?.feedback_by_type && Object.keys(stats.feedbackStats.feedback_by_type).length > 0 && (
                <div className="pt-2 border-t border-dashed border-border/40">
                  <p className="font-hand-secondary text-xs text-muted-foreground mb-2">By Type:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.feedbackStats.feedback_by_type).map(([type, count]) => (
                      <span 
                        key={type}
                        className="px-2 py-0.5 bg-muted rounded font-hand-secondary text-xs"
                      >
                        {type}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SketchCard>
      </div>
    </div>
  );
}
