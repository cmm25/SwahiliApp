import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface StreakData {
  currentStreak: number;
  lastActivityDate: string | null;
  totalXp: number;
  level: number;
}

interface UseStreakReturn {
  streak: number;
  xp: number;
  level: number;
  isLoading: boolean;
  error: Error | null;
  logActivity: () => Promise<{ error: Error | null }>;
  addXp: (amount: number, source?: string, metadata?: Record<string, any>) => Promise<{ error: Error | null }>;
  refetch: () => Promise<void>;
}

// Helper to get untyped supabase client for tables not yet in generated types
const getUntypedClient = () => supabase as any;


export function useStreak(): UseStreakReturn {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastActivityDate: null,
    totalXp: 0,
    level: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStreak = useCallback(async () => {
    if (!user) {
      setStreakData({ currentStreak: 0, lastActivityDate: null, totalXp: 0, level: 1 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use the learning_progress table (matches existing schema)
      const { data, error: fetchError } = await getUntypedClient()
        .from("learning_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // Check if streak should be reset (missed a day)
        const lastActivity = data.last_activity_date ? new Date(data.last_activity_date) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let currentStreak = data.streak_days || 0;

        if (lastActivity) {
          const lastActivityDay = new Date(lastActivity);
          lastActivityDay.setHours(0, 0, 0, 0);

          const diffDays = Math.floor(
            (today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24)
          );

          // If more than 1 day has passed, streak is broken (but we don't update DB here, just show 0)
          if (diffDays > 1) {
            currentStreak = 0;
          }
        }

        let totalXp = data.xp || 0;
        let level = data.level || 1;

        if (totalXp === 0) {
          const { data: lessonRows, error: lessonError } = await getUntypedClient()
            .from("lesson_progress")
            .select("xp_earned")
            .eq("user_id", user.id);

          if (!lessonError && lessonRows?.length) {
            const lessonXp = lessonRows.reduce(
              (sum: number, row: { xp_earned?: number | null }) => sum + (row.xp_earned || 0),
              0
            );
            if (lessonXp > 0) {
              const mergedXp = Math.max(totalXp, lessonXp);
              const newLevel = Math.floor(mergedXp / 500) + 1;

              const { error: updateError } = await getUntypedClient()
                .from("learning_progress")
                .upsert(
                  { user_id: user.id, xp: mergedXp, level: newLevel },
                  { onConflict: "user_id" }
                );

              if (!updateError) {
                totalXp = mergedXp;
                level = newLevel;
              }
            }
          }
        }

        setStreakData({
          currentStreak,
          lastActivityDate: data.last_activity_date ?? null,
          totalXp,
          level,
        });
      } else {
        // No progress record exists yet
        const { data: lessonRows } = await getUntypedClient()
          .from("lesson_progress")
          .select("xp_earned")
          .eq("user_id", user.id);

        const lessonXp = (lessonRows ?? []).reduce(
          (sum: number, row: { xp_earned?: number | null }) => sum + (row.xp_earned || 0),
          0
        );

        const mergedXp = lessonXp;
        const newLevel = Math.floor(mergedXp / 500) + 1;

        if (mergedXp > 0) {
          await getUntypedClient()
            .from("learning_progress")
            .upsert(
              { user_id: user.id, xp: mergedXp, level: newLevel },
              { onConflict: "user_id" }
            );
        }

        setStreakData({
          currentStreak: 0,
          lastActivityDate: null,
          totalXp: mergedXp,
          level: newLevel,
        });
      }
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching streak:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const logActivity = async () => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

      // Get current progress
      const { data: currentData } = await getUntypedClient()
        .from("learning_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    const lastActivity = currentData?.last_activity_date ?? null;
    let newStreak = currentData?.streak_days || 0;

    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      lastDate.setHours(0, 0, 0, 0);
      todayDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        // Consecutive day - increment streak
        newStreak = newStreak + 1;
      } else if (diffDays > 1) {
        // Missed a day - reset streak
        newStreak = 1;
      }
      // diffDays === 0 means same day, don't change streak
    } else {
      // First activity ever
      newStreak = 1;
    }

    const { error: updateError } = await getUntypedClient()
      .from("learning_progress")
      .upsert(
        {
          user_id: user.id,
          streak_days: newStreak,
          last_activity_date: today,
        },
        { onConflict: "user_id" }
      );

    if (updateError) throw updateError;

      // Refetch streak data to get updated values
      await fetchStreak();

      return { error: null };
    } catch (err) {
      console.error("Error logging activity:", err);
      return { error: err as Error };
    }
  };

  const addXp = async (amount: number, source: string = 'unknown', metadata: Record<string, any> = {}) => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      // 1. Insert into history log
      await getUntypedClient()
        .from("xp_history")
        .insert({
          user_id: user.id,
          amount,
          source,
          metadata,
          created_at: new Date().toISOString()
        });

      // 2. Update global total
      const { data: currentData } = await getUntypedClient()
      .from("learning_progress")
      .select("xp, level")
      .eq("user_id", user.id)
      .maybeSingle();

    const newXp = ((currentData?.xp as number | null) || 0) + amount;
    const newLevel = Math.floor(newXp / 500) + 1;

    // Use upsert instead of update to handle missing rows
    const { error: updateError } = await getUntypedClient()
      .from("learning_progress")
      .upsert(
        {
          user_id: user.id,
          xp: newXp,
          level: newLevel,
          updated_at: new Date().toISOString() // Ensure updated_at is set if column exists
        },
        { onConflict: "user_id" }
      );

      if (updateError) throw updateError;

      // Refetch to get updated XP
      await fetchStreak();

      return { error: null };
    } catch (err) {
      console.error("Error adding XP:", err);
      return { error: err as Error };
    }
  };

  return {
    streak: streakData.currentStreak,
    xp: streakData.totalXp,
    level: streakData.level,
    isLoading,
    error,
    logActivity,
    addXp,
    refetch: fetchStreak,
  };
}
