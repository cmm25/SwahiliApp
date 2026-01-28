import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface LessonProgressRecord {
  id: string;
  user_id: string;
  lesson_id: number;
  completed: boolean;
  completed_at: string | null;
  review_count: number;
  xp_earned: number;
  created_at: string;
  updated_at: string;
}

interface UseLessonProgressReturn {
  progress: LessonProgressRecord[];
  isLoading: boolean;
  error: Error | null;
  isLessonCompleted: (lessonId: number) => boolean;
  getLessonProgress: (lessonId: number) => LessonProgressRecord | undefined;
  markLessonComplete: (lessonId: number, xpEarned: number) => Promise<{ error: Error | null }>;
  incrementReviewCount: (lessonId: number) => Promise<{ error: Error | null }>;
  refetch: () => Promise<void>;
}

// Helper to get untyped supabase client for tables not yet in generated types
const getUntypedClient = () => supabase as any;

export function useLessonProgress(): UseLessonProgressReturn {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LessonProgressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await getUntypedClient()
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id);

      if (fetchError) {
        throw fetchError;
      }

      setProgress(data || []);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching lesson progress:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const isLessonCompleted = (lessonId: number): boolean => {
    const record = progress.find(p => p.lesson_id === lessonId);
    return record?.completed ?? false;
  };

  const getLessonProgress = (lessonId: number): LessonProgressRecord | undefined => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const markLessonComplete = async (lessonId: number, xpEarned: number) => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      const existingRecord = progress.find(p => p.lesson_id === lessonId);

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await getUntypedClient()
          .from("lesson_progress")
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
            xp_earned: existingRecord.xp_earned + xpEarned,
            review_count: existingRecord.review_count + 1,
          })
          .eq("id", existingRecord.id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await getUntypedClient()
          .from("lesson_progress")
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
            xp_earned: xpEarned,
            review_count: 1,
          });

        if (insertError) throw insertError;
      }

      await fetchProgress();
      return { error: null };
    } catch (err) {
      console.error("Error marking lesson complete:", err);
      return { error: err as Error };
    }
  };

  const incrementReviewCount = async (lessonId: number) => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      const existingRecord = progress.find(p => p.lesson_id === lessonId);

      if (existingRecord) {
        const { error: updateError } = await getUntypedClient()
          .from("lesson_progress")
          .update({
            review_count: existingRecord.review_count + 1,
          })
          .eq("id", existingRecord.id);

        if (updateError) throw updateError;
      }

      await fetchProgress();
      return { error: null };
    } catch (err) {
      console.error("Error incrementing review count:", err);
      return { error: err as Error };
    }
  };

  return {
    progress,
    isLoading,
    error,
    isLessonCompleted,
    getLessonProgress,
    markLessonComplete,
    incrementReviewCount,
    refetch: fetchProgress,
  };
}
