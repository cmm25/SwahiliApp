import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useLessonProgress } from './useLessonProgress';
import { useStreak } from './useStreak';
import { supabase } from '@/integrations/supabase/client';
import {
  QuizAgent,
  QuizSession,
  QuizQuestion,
  QuizAnswer,
  VocabWord,
  checkAnswer,
} from '@/lib/agents/quiz';

// Lesson to vocabulary mapping (based on Lessons.tsx structure)
const LESSON_VOCAB_MAP: Record<number, { category: string; minWords: number }> = {
  1: { category: 'greetings', minWords: 8 },
  2: { category: 'numbers', minWords: 10 },
  3: { category: 'colors', minWords: 8 },
  4: { category: 'family', minWords: 10 },
  5: { category: 'food', minWords: 12 },
  6: { category: 'travel', minWords: 12 },
};

export type QuizState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'error';

interface UseQuizReturn {
  // State
  state: QuizState;
  session: QuizSession | null;
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  error: string | null;
  feedback: string | null;

  // Actions
  startQuiz: (lessonId?: number) => Promise<void>;
  beginQuiz: () => void;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;

  // Computed
  progress: number;
  correctCount: number;
  isLastQuestion: boolean;
}

export function useQuiz(): UseQuizReturn {
  const { user } = useAuth();
  const { progress: lessonProgress, isLessonCompleted } = useLessonProgress();
  const { addXp } = useStreak();

  const [state, setState] = useState<QuizState>('idle');
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  /**
   * Get the current/last completed lesson ID
   */
  const getCurrentLessonId = useCallback((): number => {
    // Find the most recent lesson the user is working on
    const completedLessons = lessonProgress
      .filter(p => p.completed)
      .map(p => p.lesson_id);

    if (completedLessons.length === 0) return 1;

    // Return the highest completed lesson, or next one if available
    const maxCompleted = Math.max(...completedLessons);
    const maxAvailable = Math.max(...Object.keys(LESSON_VOCAB_MAP).map(Number));

    return Math.min(maxCompleted + 1, maxAvailable);
  }, [lessonProgress]);

  /**
   * Fetch vocabulary words for quiz generation
   */
  const fetchVocabularyForQuiz = useCallback(async (lessonId: number): Promise<VocabWord[]> => {
    const lessonConfig = LESSON_VOCAB_MAP[lessonId];
    if (!lessonConfig) {
      throw new Error(`No vocabulary configuration for lesson ${lessonId}`);
    }

    // Get all completed lesson categories up to and including current
    const categories: string[] = [];
    for (let i = 1; i <= lessonId; i++) {
      if (LESSON_VOCAB_MAP[i] && (isLessonCompleted(i) || i === lessonId)) {
        categories.push(LESSON_VOCAB_MAP[i].category);
      }
    }

    // Fetch words from vocabulary_words table
    const { data: words, error: fetchError } = await (supabase
      .from('vocabulary_words' as never)
      .select('id, swahili, english, category')
      .in('category', categories) as unknown as Promise<{
        data: VocabWord[] | null;
        error: Error | null;
      }>);

    if (fetchError) {
      console.error('Error fetching vocabulary:', fetchError);
      throw fetchError;
    }

    if (!words || words.length < 4) {
      throw new Error('Not enough vocabulary words available for quiz');
    }

    return words;
  }, [isLessonCompleted]);

  /**
   * Start a new quiz session
   */
  const startQuiz = useCallback(async (lessonId?: number) => {
    if (!user) {
      setError('Please log in to take a quiz');
      setState('error');
      return;
    }

    setState('loading');
    setError(null);
    setFeedback(null);
    setCurrentIndex(0);

    try {
      const targetLessonId = lessonId ?? getCurrentLessonId();
      const words = await fetchVocabularyForQuiz(targetLessonId);

      const result = await QuizAgent.generateQuiz({
        userId: user.id,
        lessonId: targetLessonId,
        words,
        config: {
          questionCount: 10,
          includeHints: true,
          difficultyBias: 'balanced',
        },
      });

      if (!result.success || !result.session) {
        throw new Error(result.error || 'Failed to generate quiz');
      }

      setSession(result.session);
      setState('ready');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start quiz';
      setError(message);
      setState('error');
    }
  }, [user, getCurrentLessonId, fetchVocabularyForQuiz]);

  /**
   * Begin the quiz (transition from ready to in_progress)
   */
  const beginQuiz = useCallback(() => {
    if (state === 'ready' && session) {
      setState('in_progress');
    }
  }, [state, session]);

  /**
   * Submit answer for current question
   */
  const submitAnswer = useCallback((userAnswer: string) => {
    if (!session || state !== 'in_progress') return;

    const question = session.questions[currentIndex];
    if (!question) return;

    const isCorrect = checkAnswer(userAnswer, question.correctAnswer);

    const answer: QuizAnswer = {
      questionId: question.id,
      userAnswer,
      isCorrect,
      timeTakenMs: Date.now() - session.startedAt.getTime(),
    };

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        answers: [...prev.answers, answer],
      };
    });

    setState('submitted');
  }, [session, state, currentIndex]);

  /**
   * Move to next question
   */
  const nextQuestion = useCallback(() => {
    if (!session) return;

    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setState('in_progress');
    } else {
      // Last question - ready to finish
      setState('submitted');
    }
  }, [session, currentIndex]);

  /**
   * Finish and grade the quiz
   */
  const finishQuiz = useCallback(async () => {
    if (!session || !user) return;

    setState('loading');

    try {
      const result = await QuizAgent.gradeQuiz({
        userId: user.id,
        session,
      });

      if (!result.success || !result.session) {
        throw new Error(result.error || 'Failed to grade quiz');
      }

      const gradedSession = result.session;
      setSession(gradedSession);
      setFeedback(result.feedback || null);

      // Award XP
      if (gradedSession.xpEarned > 0) {
        await addXp(gradedSession.xpEarned);
      }

      // Save quiz session to database
      await saveQuizSession(gradedSession);

      setState('completed');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete quiz';
      setError(message);
      setState('error');
    }
  }, [session, user, addXp]);

  /**
   * Save quiz session to database
   */
  const saveQuizSession = async (session: QuizSession) => {
    try {
      await (supabase
        .from('quiz_sessions' as never)
        .insert({
          user_id: session.userId,
          lesson_id: session.lessonId,
          questions: session.questions,
          answers: session.answers,
          score: session.score,
          total_questions: session.totalQuestions,
          xp_earned: session.xpEarned,
          completed_at: session.completedAt?.toISOString(),
        } as never) as unknown as Promise<{ error: Error | null }>);
    } catch (err) {
      console.error('Failed to save quiz session:', err);
      // Non-blocking - quiz still completes
    }
  };

  /**
   * Reset quiz to initial state
   */
  const resetQuiz = useCallback(() => {
    setState('idle');
    setSession(null);
    setCurrentIndex(0);
    setError(null);
    setFeedback(null);
  }, []);

  // Computed values
  const currentQuestion = session?.questions[currentIndex] ?? null;
  const progress = session
    ? ((currentIndex + 1) / session.questions.length) * 100
    : 0;
  const correctCount = session?.answers.filter(a => a.isCorrect).length ?? 0;
  const isLastQuestion = session
    ? currentIndex === session.questions.length - 1
    : false;

  return {
    state,
    session,
    currentQuestion,
    currentIndex,
    error,
    feedback,
    startQuiz,
    beginQuiz,
    submitAnswer,
    nextQuestion,
    finishQuiz,
    resetQuiz,
    progress,
    correctCount,
    isLastQuestion,
  };
}