'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  calculateNextStage,
  filterDueWords,
  masteryLevelToStage,
  stageToMasteryLevel,
  TeachingResponse,
  VocabularyWord,
} from '@/lib/agents/teaching-shared';
import { useAuth } from './useAuth';

interface TeachingApiRequest {
  action: 'introduce' | 'review' | 'practice' | 'get_due_words' | 'update_progress';
  wordId?: string;
  words?: VocabularyWord[];
  performance?: 'perfect' | 'good' | 'struggled' | 'forgot';
  context?: string;
}

export function useTeaching() {
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callTeachingApi = useCallback(
    async (payload: TeachingApiRequest): Promise<TeachingResponse> => {
      if (!session?.access_token) {
        return { success: false, action: payload.action, error: 'Not authenticated' };
      }

      const response = await fetch('/api/agents/teaching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        return { success: false, action: payload.action, error: message || 'Teaching API error' };
      }

      return response.json();
    },
    [session?.access_token]
  );

  const fetchVocabulary = useCallback(async (): Promise<VocabularyWord[]> => {
    if (!user?.id) return [];

    const { data: words, error: wordsError } = await (supabase
      .from('vocabulary_words' as never)
      .select('*')
      .order('created_at', { ascending: false }) as unknown as Promise<{
      data: Array<{
        id: string;
        swahili: string;
        english: string;
        category?: string | null;
        stage?: string | null;
        created_at: string;
      }> | null;
      error: Error | null;
    }>);

    if (wordsError) {
      const message = (wordsError as { message?: string })?.message ?? String(wordsError);
      if (message.includes('AbortError')) {
        return [];
      }
      console.error('Error fetching vocabulary:', message);
      return [];
    }

    const { data: progress, error: progressError } = await (supabase
      .from('user_word_progress' as never)
      .select('word_id, is_favorite, last_practiced, times_practiced, mastery_level')
      .eq('user_id', user.id) as unknown as Promise<{
      data: Array<{
        word_id: string;
        is_favorite: boolean | null;
        last_practiced: string | null;
        times_practiced: number | null;
        mastery_level: number | null;
      }> | null;
      error: Error | null;
    }>);

    if (progressError) {
      const message = (progressError as { message?: string })?.message ?? String(progressError);
      if (!message.includes('AbortError')) {
        console.error('Error fetching progress:', message);
      }
    }

    const progressByWordId = new Map(
      (progress ?? []).map(item => [item.word_id, item])
    );

    return (words ?? [])
      .filter(row => progressByWordId.has(row.id))
      .map(row => {
        const progressRow = progressByWordId.get(row.id);
        const masteryLevel = progressRow?.mastery_level ?? 0;
        return {
          id: row.id,
          swahili: row.swahili,
          english: row.english,
          category: row.category ?? null,
          mastery_level: masteryLevel,
          stage: masteryLevelToStage(masteryLevel),
          is_favorite: progressRow?.is_favorite ?? false,
          last_practiced: progressRow?.last_practiced ?? null,
          times_practiced: progressRow?.times_practiced ?? 0,
          created_at: row.created_at,
        };
      });
  }, [user?.id]);

  const fetchVocabularyCount = useCallback(async (): Promise<number> => {
    const { count, error } = await (supabase
      .from('vocabulary_words' as never)
      .select('*', { count: 'exact', head: true }) as unknown as Promise<{
      count: number | null;
      error: Error | null;
    }>);

    if (error) {
      const message = (error as { message?: string })?.message ?? String(error);
      if (!message.includes('AbortError')) {
        console.error('Error fetching total word count:', message);
      }
      return 0;
    }

    return count ?? 0;
  }, []);

  const addWord = useCallback(
    async (swahili: string, english: string): Promise<VocabularyWord | null> => {
      if (!user?.id) {
        setError('Must be logged in to add words');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await (supabase
          .from('vocabulary_words' as never)
          .insert({
            swahili,
            english,
          } as never)
          .select()
          .single() as unknown as Promise<{
          data: { id: string; swahili: string; english: string; category?: string | null; created_at: string } | null;
          error: Error | null;
        }>);

        if (error) throw error;
        if (!data) return null;

        await (supabase
          .from('user_word_progress' as never)
          .upsert({
            user_id: user.id,
            word_id: data.id,
            is_favorite: false,
            times_practiced: 0,
            mastery_level: 0,
          } as never, { onConflict: "user_id,word_id" }) as unknown as Promise<unknown>);

        return {
          id: data.id,
          swahili: data.swahili,
          english: data.english,
          category: (data as { category?: string | null }).category ?? null,
          mastery_level: 0,
          stage: 'seed',
          is_favorite: false,
          last_practiced: null,
          times_practiced: 0,
          created_at: data.created_at,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add word';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  const introduceWord = useCallback(
    async (word: VocabularyWord): Promise<TeachingResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await callTeachingApi({
          action: 'introduce',
          words: [word],
        });

        if (!response.success) {
          setError(response.error || 'Introduction failed');
        }

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [callTeachingApi]
  );

  const reviewWord = useCallback(
    async (
      word: VocabularyWord,
      performance: 'perfect' | 'good' | 'struggled' | 'forgot'
    ): Promise<TeachingResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // Get AI feedback
        const response = await callTeachingApi({
          action: 'review',
          words: [word],
          performance,
        });

        if (response.success && response.nextStage && user?.id) {
          const nextMastery = stageToMasteryLevel(response.nextStage);
          await (supabase
            .from('user_word_progress' as never)
            .upsert({
              user_id: user.id,
              word_id: word.id,
              mastery_level: nextMastery,
              last_practiced: new Date().toISOString(),
              times_practiced: (word.times_practiced ?? 0) + 1,
            } as never, { onConflict: "user_id,word_id" }) as unknown as Promise<unknown>);
        }

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [callTeachingApi]
  );

  const startPractice = useCallback(async (): Promise<TeachingResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const words = await fetchVocabulary();

      return callTeachingApi({
        action: 'practice',
        words,
      });
    } finally {
      setIsLoading(false);
    }
  }, [callTeachingApi, fetchVocabulary]);

  const getDueWords = useCallback(async (): Promise<VocabularyWord[]> => {
    const words = await fetchVocabulary();
    return filterDueWords(words);
  }, [fetchVocabulary]);

  const toggleFavorite = useCallback(
    async (wordId: string): Promise<boolean> => {
      if (!user?.id) return false;

      const { data: progress } = await (supabase
        .from('user_word_progress' as never)
        .select('is_favorite')
        .eq('user_id', user.id)
        .eq('word_id', wordId)
        .single() as unknown as Promise<{ data: { is_favorite: boolean } | null }>);

      if (!progress) return false;

      const { error } = await (supabase
        .from('user_word_progress' as never)
        .upsert({
          user_id: user.id,
          word_id: wordId,
          is_favorite: !progress.is_favorite,
        } as never, { onConflict: "user_id,word_id" }) as unknown as Promise<{ error: Error | null }>);

      return !error;
    },
    [user?.id]
  );

  return {
    isLoading,
    error,
    fetchVocabulary,
    fetchVocabularyCount,
    addWord,
    introduceWord,
    reviewWord,
    startPractice,
    getDueWords,
    toggleFavorite,
    calculateNextStage,
    filterDueWords,
  };
}
