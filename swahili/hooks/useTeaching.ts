'use client';

import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  calculateNextStage,
  calculateSM2,
  filterDueWords,
  normalizeGrowthStage,
  performanceToQuality,
  TeachingResponse,
  UserWord,
  UserVocabulary,
  VocabularyWord,
} from '@/lib/agents/teaching-shared';
import { useAuth } from './useAuth';
import { useStreak } from './useStreak';

interface TeachingApiRequest {
  action: 'introduce' | 'review' | 'practice' | 'get_due_words' | 'update_progress';
  wordId?: string;
  words?: UserWord[];
  performance?: 'perfect' | 'good' | 'struggled' | 'forgot';
  context?: string;
  sessionId?: string;
}

type UserVocabularyRow = Omit<UserVocabulary, 'growth_stage'> & {
  growth_stage: string;
};

export function useTeaching() {
  const { user, session } = useAuth();
  const { addXp, logActivity } = useStreak();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const defaultEaseFactor = 2.5;
  const defaultIntervalDays = 1;

  const buildUserWord = (word: VocabularyWord, progress?: UserVocabulary | null): UserWord => {
    const baseStage = normalizeGrowthStage(word.stage);
    const progressStage = progress?.growth_stage
      ? normalizeGrowthStage(progress.growth_stage)
      : baseStage;

    return {
      id: word.id,
      swahili: word.swahili,
      english: word.english,
      category: word.category ?? null,
      stage: word.stage ?? null,
      created_at: word.created_at ?? null,
      userVocabId: progress?.id ?? null,
      growth_stage: progressStage,
      ease_factor: progress?.ease_factor ?? defaultEaseFactor,
      interval_days: progress?.interval_days ?? defaultIntervalDays,
      repetitions: progress?.repetitions ?? 0,
      next_review_at: progress?.next_review_at ?? null,
      last_reviewed_at: progress?.last_reviewed_at ?? null,
      correct_count: progress?.correct_count ?? 0,
      incorrect_count: progress?.incorrect_count ?? 0,
      is_favorite: progress?.is_favorite ?? false,
    };
  };

  if (sessionIdRef.current === null && typeof window !== 'undefined') {
    const storageKey = 'rafiki_session_id';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      sessionIdRef.current = stored;
    } else {
      const newId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(storageKey, newId);
      sessionIdRef.current = newId;
    }
  }

  const callTeachingApi = useCallback(
    async (payload: TeachingApiRequest): Promise<TeachingResponse> => {
      if (!session?.access_token) {
        return { success: false, action: payload.action, error: 'Not authenticated' };
      }

      const requestBody = {
        ...payload,
        sessionId: sessionIdRef.current ?? undefined,
      };

      const response = await fetch('/api/agents/teaching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const message = await response.text();
        return { success: false, action: payload.action, error: message || 'Teaching API error' };
      }

      return response.json();
    },
    [session?.access_token]
  );

  const fetchVocabulary = useCallback(async (): Promise<UserWord[]> => {
    if (!user?.id) return [];

    const { data: words, error: wordsError } = await (supabase
      .from('vocabulary_words' as never)
      .select('id, swahili, english, stage, category, created_at')
      .order('created_at', { ascending: false }) as unknown as Promise<{
      data: VocabularyWord[] | null;
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
      .from('user_vocabulary' as never)
      .select('id, user_id, word_id, growth_stage, ease_factor, interval_days, repetitions, next_review_at, last_reviewed_at, correct_count, incorrect_count, is_favorite')
      .eq('user_id', user.id) as unknown as Promise<{
      data: UserVocabularyRow[] | null;
      error: Error | null;
    }>);

    if (progressError) {
      const message = (progressError as { message?: string })?.message ?? String(progressError);
      if (!message.includes('AbortError')) {
        console.error('Error fetching progress:', message);
      }
    }

    const normalizedProgress: UserVocabulary[] = (progress ?? []).map(item => ({
      ...item,
      growth_stage: normalizeGrowthStage(item.growth_stage),
    }));

    const progressByWordId = new Map(
      normalizedProgress.map(item => [item.word_id, item])
    );

    return (words ?? []).map(row => buildUserWord(row, progressByWordId.get(row.id) ?? null));
  }, [user?.id]);

  const fetchUserWords = useCallback(async (): Promise<UserWord[]> => {
    const words = await fetchVocabulary();
    return words.filter(word => Boolean(word.userVocabId));
  }, [fetchVocabulary]);

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

  const addWordToLearning = useCallback(
    async (wordId: string): Promise<UserWord | null> => {
      if (!user?.id) {
        setError('Must be logged in to add words');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data: word, error: wordError } = await (supabase
          .from('vocabulary_words' as never)
          .select('id, swahili, english, stage, category, created_at')
          .eq('id', wordId)
          .single() as unknown as Promise<{ data: VocabularyWord | null; error: Error | null }>);

        if (wordError || !word) {
          throw wordError ?? new Error('Word not found');
        }

        const { data: existing } = await (supabase
          .from('user_vocabulary' as never)
          .select('id, user_id, word_id, growth_stage, ease_factor, interval_days, repetitions, next_review_at, last_reviewed_at, correct_count, incorrect_count, is_favorite')
          .eq('user_id', user.id)
          .eq('word_id', wordId)
          .maybeSingle() as unknown as Promise<{ data: UserVocabulary | null }>);

        if (existing) {
          setError('Already learning this word');
          return buildUserWord(word, existing);
        }

        const now = new Date().toISOString();
        const { data: inserted, error: insertError } = await (supabase
          .from('user_vocabulary' as never)
          .insert({
            user_id: user.id,
            word_id: wordId,
            growth_stage: 'seed',
            ease_factor: defaultEaseFactor,
            interval_days: defaultIntervalDays,
            repetitions: 0,
            next_review_at: now,
            last_reviewed_at: null,
            correct_count: 0,
            incorrect_count: 0,
            is_favorite: false,
          } as never)
          .select()
          .single() as unknown as Promise<{ data: UserVocabulary | null; error: Error | null }>);

        if (insertError || !inserted) {
          throw insertError ?? new Error('Failed to add word');
        }

        return buildUserWord(word, inserted);
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
    async (word: UserWord): Promise<TeachingResponse> => {
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
      word: UserWord,
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

        if (response.success && user?.id) {
          const currentStage = normalizeGrowthStage(word.growth_stage ?? word.stage);
          const calculatedStage = calculateNextStage(currentStage, performance);
          const nextStage = response.nextStage ?? calculatedStage.nextStage;

          const quality = performanceToQuality(performance);
          const sm2 = calculateSM2(
            word.ease_factor ?? defaultEaseFactor,
            word.interval_days ?? defaultIntervalDays,
            word.repetitions ?? 0,
            quality
          );

          const now = new Date();
          const nextReviewAt = new Date(now);
          nextReviewAt.setDate(now.getDate() + sm2.interval);

          const isCorrect = performance === 'perfect' || performance === 'good';
          const updatedWord: UserWord = {
            ...word,
            growth_stage: nextStage,
            ease_factor: sm2.easeFactor,
            interval_days: sm2.interval,
            repetitions: sm2.repetitions,
            next_review_at: nextReviewAt.toISOString(),
            last_reviewed_at: now.toISOString(),
            correct_count: (word.correct_count ?? 0) + (isCorrect ? 1 : 0),
            incorrect_count: (word.incorrect_count ?? 0) + (!isCorrect ? 1 : 0),
          };

          const { data: saved, error: saveError } = await (supabase
            .from('user_vocabulary' as never)
            .upsert({
              user_id: user.id,
              word_id: word.id,
              growth_stage: nextStage,
              ease_factor: updatedWord.ease_factor,
              interval_days: updatedWord.interval_days,
              repetitions: updatedWord.repetitions,
              next_review_at: updatedWord.next_review_at,
              last_reviewed_at: updatedWord.last_reviewed_at,
              correct_count: updatedWord.correct_count,
              incorrect_count: updatedWord.incorrect_count,
              is_favorite: word.is_favorite ?? false,
            } as never, { onConflict: "user_id,word_id" })
            .select()
            .single() as unknown as Promise<{ data: UserVocabulary | null; error: Error | null }>);

          if (saveError) {
            console.error('Error updating progress:', saveError);
          } else if (saved?.id) {
            updatedWord.userVocabId = saved.id;
            updatedWord.growth_stage = normalizeGrowthStage(saved.growth_stage);
          }

          if (response.xpEarned && response.xpEarned > 0) {
            await addXp(response.xpEarned, 'vocab_practice', {
              wordId: word.id,
              swahili: word.swahili,
              stage: nextStage,
            });
            await logActivity();
          }

          return {
            ...response,
            nextStage,
            words: [updatedWord],
          };
        }

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [callTeachingApi, user?.id, addXp, logActivity]
  );

  const startPractice = useCallback(async (): Promise<TeachingResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch all words first
      const words = await fetchUserWords();
      
      // 2. Filter due words locally (client-side) for speed
      const dueWords = filterDueWords(words).slice(0, 5);

      if (dueWords.length === 0) {
        return {
          success: true,
          action: 'practice',
          content: "🌳 Your garden is thriving! All your words are growing well. Come back later when they're ready for more practice.",
          words: [],
          xpEarned: 0,
        };
      }

      // 3. Return immediately without LLM call for speed
      // We use a static intro instead of waiting for AI generation
      return {
        success: true,
        action: 'practice',
        content: `Ready to water ${dueWords.length} plants? Let's help them grow!`,
        words: dueWords,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start practice';
      setError(message);
      return {
        success: false,
        action: 'practice',
        error: message
      };
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserWords, filterDueWords]);

  const getDueWords = useCallback(async (): Promise<UserWord[]> => {
    const words = await fetchUserWords();
    return filterDueWords(words);
  }, [fetchUserWords]);

  const toggleFavorite = useCallback(
    async (word: UserWord): Promise<UserWord | null> => {
      if (!user?.id) return null;

      const { data: existing, error: existingError } = await (supabase
        .from('user_vocabulary' as never)
        .select('id, user_id, word_id, growth_stage, ease_factor, interval_days, repetitions, next_review_at, last_reviewed_at, correct_count, incorrect_count, is_favorite')
        .eq('user_id', user.id)
        .eq('word_id', word.id)
        .maybeSingle() as unknown as Promise<{ data: UserVocabulary | null; error: Error | null }>);

      if (existingError) {
        console.error('Error loading favorite state:', existingError);
        return null;
      }

      const nextFavorite = !(existing?.is_favorite ?? word.is_favorite ?? false);

      if (existing) {
        const { data: updated, error: updateError } = await (supabase
          .from('user_vocabulary' as never)
          .update({ is_favorite: nextFavorite } as never)
          .eq('id', existing.id)
          .select()
          .single() as unknown as Promise<{ data: UserVocabulary | null; error: Error | null }>);

        if (updateError || !updated) {
          console.error('Error updating favorite:', updateError);
          return null;
        }

        return buildUserWord(word, updated);
      }

      const now = new Date().toISOString();
      const { data: inserted, error: insertError } = await (supabase
        .from('user_vocabulary' as never)
        .insert({
          user_id: user.id,
          word_id: word.id,
          growth_stage: 'seed',
          ease_factor: defaultEaseFactor,
          interval_days: defaultIntervalDays,
          repetitions: 0,
          next_review_at: now,
          last_reviewed_at: null,
          correct_count: 0,
          incorrect_count: 0,
          is_favorite: nextFavorite,
        } as never)
        .select()
        .single() as unknown as Promise<{ data: UserVocabulary | null; error: Error | null }>);

      if (insertError || !inserted) {
        console.error('Error creating favorite:', insertError);
        return null;
      }

      return buildUserWord(word, inserted);
    },
    [user?.id]
  );

  return {
    isLoading,
    error,
    fetchVocabulary,
    fetchUserWords,
    fetchVocabularyCount,
    addWordToLearning,
    introduceWord,
    reviewWord,
    startPractice,
    getDueWords,
    toggleFavorite,
    calculateNextStage,
    filterDueWords,
  };
}
