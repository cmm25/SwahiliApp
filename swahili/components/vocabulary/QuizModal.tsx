import { cn } from '@/lib/utils';
import { QuizSession, QuizQuestion } from '@/lib/agents/quiz';
import { QuizState } from '@/hooks/useQuiz';
import { QuizLoading } from './quiz/QuizLoading';
import { QuizError } from './quiz/QuizError';
import { QuizReady } from './quiz/QuizReady';
import { QuizCompleted } from './quiz/QuizCompleted';
import { QuizQuestionView } from './quiz/QuizQuestion';

interface QuizModalProps {
  isOpen: boolean;
  state: QuizState;
  session: QuizSession | null;
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  progress: number;
  correctCount: number;
  isLastQuestion: boolean;
  feedback: string | null;
  error: string | null;
  onStart: () => void;
  onSubmit: (answer: string) => void;
  onNext: () => void;
  onFinish: () => Promise<void>;
  onClose: () => void;
  onRetry: () => void;
}

export function QuizModal({
  isOpen, state, session, currentQuestion, currentIndex,
  progress, correctCount, isLastQuestion, feedback, error,
  onStart, onSubmit, onNext, onFinish, onClose, onRetry,
}: QuizModalProps) {
  if (!isOpen) return null;

  const lastAnswer = session?.answers[session.answers.length - 1];

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={cn(
        "bg-card rounded-2xl border-2 shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-scale relative",
        state === 'completed' ? 'border-success/30' : 'border-accent/30'
      )}>
        {state === 'loading' && <QuizLoading hasSession={!!session} />}

        {state === 'error' && (
          <QuizError error={error} onClose={onClose} onRetry={onRetry} />
        )}

        {state === 'ready' && session && (
          <QuizReady
            totalQuestions={session.totalQuestions}
            onStart={onStart}
            onClose={onClose}
          />
        )}

        {(state === 'in_progress' || state === 'submitted') && currentQuestion && session && (
          <QuizQuestionView
            question={currentQuestion}
            questionIndex={currentIndex}
            totalQuestions={session.totalQuestions}
            correctCount={correctCount}
            progress={progress}
            isSubmitted={state === 'submitted'}
            lastAnswer={lastAnswer}
            isLastQuestion={isLastQuestion}
            onSubmit={onSubmit}
            onNext={onNext}
            onFinish={onFinish}
            onClose={onClose}
          />
        )}

        {state === 'completed' && session && (
          <QuizCompleted
            score={session.score}
            totalQuestions={session.totalQuestions}
            xpEarned={session.xpEarned}
            feedback={feedback}
            onClose={onClose}
            onRetry={onRetry}
          />
        )}
      </div>
    </div>
  );
}