'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SketchButton } from "@/components/shared/SketchButton";
import { ArrowLeft, Lightbulb, Target, Zap, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { getLessonById } from "@/lib/lesson-structure";
import { useStreak } from "@/hooks/useStreak";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { LessonBackground } from "./_components/LessonBackground";
import { LessonHeaderCard } from "./_components/LessonHeaderCard";
import { LessonProgress } from "./_components/LessonProgress";
import { LessonContentCard } from "./_components/LessonContentCard";
import { LessonNavigation } from "./_components/LessonNavigation";
import { CelebrationModal } from "./_components/CelebrationModal";
import type {
  LessonMeta,
  LessonStep,
  VocabularyWordRow,
  VocabularySupabase,
  FloatingParticleSpec,
  ConfettiSpec,
} from "./_components/types";

export default function LessonDetailPage() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { addXp, logActivity } = useStreak();
  const { isLessonCompleted, markLessonComplete } = useLessonProgress();
  const { speak: playPronunciation, isLoading: ttsLoading } = useTextToSpeech();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lessonSteps, setLessonSteps] = useState<LessonStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonMeta, setLessonMeta] = useState<LessonMeta | null>(null);
  const [hasAwardedXp, setHasAwardedXp] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);
  const [particles, setParticles] = useState<FloatingParticleSpec[]>([]);
  const [confetti, setConfetti] = useState<ConfettiSpec[]>([]);

  const lessonId = Number(params?.lessonId ?? 0);
  const vocabularyClient = useMemo(
    () => supabase as unknown as SupabaseClient<VocabularySupabase>,
    []
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    const startTimer = setTimeout(() => setIsAnimating(true), 0);
    const endTimer = setTimeout(() => setIsAnimating(false), 500);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [currentStep]);

  useEffect(() => {
    const generated = Array.from({ length: 8 }, (_, i) => ({
      delay: i * 0.5,
      size: 4 + Math.random() * 8,
      color: i % 2 === 0 ? "bg-accent/40" : "bg-warning/40",
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
    }));
    const timer = setTimeout(() => setParticles(generated), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showCelebration) {
      const timer = setTimeout(() => setConfetti([]), 0);
      return () => clearTimeout(timer);
    }

    const generated = Array.from({ length: 30 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      color:
        i % 5 === 0 ? "bg-accent" :
        i % 5 === 1 ? "bg-warning" :
        i % 5 === 2 ? "bg-success" :
        i % 5 === 3 ? "bg-primary" : "bg-secondary",
    }));

    const timer = setTimeout(() => setConfetti(generated), 0);
    return () => clearTimeout(timer);
  }, [showCelebration]);

  useEffect(() => {
    let isMounted = true;

    async function loadLesson() {
      setIsLoading(true);
      setLessonMeta(null);

      if (!lessonId) {
        setLessonSteps([]);
        setIsLoading(false);
        return;
      }

      const lessonDefinition = getLessonById(lessonId);

      if (!isMounted) return;

      if (!lessonDefinition) {
        setLessonSteps([]);
        setIsLoading(false);
        return;
      }

      const { data: categoryRows, error: categoryError } = await vocabularyClient
        .from("vocabulary_words")
        .select("category");

      if (!isMounted) return;

      if (categoryError) {
        console.error("Failed to load lesson categories:", categoryError.message);
        setLessonSteps([]);
        setIsLoading(false);
        return;
      }

      const availableCategories = new Set(
        (categoryRows as { category: string | null }[] | null ?? [])
          .map((row) => row.category)
          .filter((category): category is string => Boolean(category))
      );
      const resolvedCategories = lessonDefinition.categories.flatMap((category) => {
        if (availableCategories.has(category)) return [category];
        const normalized = category.replace(/-(basic|advanced)$/u, "");
        if (availableCategories.has(normalized)) return [normalized];
        return [];
      });

      const categoriesForLesson = resolvedCategories.length ? resolvedCategories : lessonDefinition.categories;

      const { data: words, error } = await vocabularyClient
        .from("vocabulary_words")
        .select("id, swahili, english, category, created_at")
        .in("category", categoriesForLesson);

      if (!isMounted) return;

      if (error) {
        console.error("Failed to load lesson words:", error.message);
        setLessonSteps([]);
        setIsLoading(false);
        return;
      }

      const totalWords = (words ?? []).length;
      const xp = Math.min(150, Math.max(50, totalWords * 5));
      const sortedWords = ((words ?? []) as VocabularyWordRow[]).slice(0, 20);
      const steps: LessonStep[] = sortedWords.map((word, index) => ({
        id: index + 1,
        type: "vocab",
        title: word.swahili,
        content: {
          swahili: word.swahili,
          english: word.english,
        },
      }));

      setLessonMeta({
        title: lessonDefinition.title,
        description: lessonDefinition.description,
        emoji: lessonDefinition.emoji,
        categories: lessonDefinition.categories,
        xp,
        totalWords,
      });
      setLessonSteps(steps);
      setCurrentStep(0);
      setCompletedSteps([]);
      setHasAwardedXp(false);
      setAwardedXp(0);
      setIsLoading(false);
    }

    loadLesson();

    return () => {
      isMounted = false;
    };
  }, [lessonId, user?.id, vocabularyClient]);

  const currentLesson = lessonSteps[currentStep];
  const progress = lessonSteps.length ? ((currentStep + 1) / lessonSteps.length) * 100 : 0;
  const isLastStep = currentStep === lessonSteps.length - 1;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (!hasAwardedXp && lessonMeta?.xp) {
      const alreadyCompleted = isLessonCompleted(lessonId);
      const xpToAward = alreadyCompleted ? 0 : lessonMeta.xp;
      setHasAwardedXp(true);
      setAwardedXp(xpToAward);
      await markLessonComplete(lessonId, xpToAward);
      if (xpToAward > 0) {
        await addXp(xpToAward, 'lesson_completion', { lessonId, title: lessonMeta.title });
      }
      await logActivity();
    }
    setShowCelebration(true);
  };

  const typeConfig = useMemo(() => {
    if (!currentLesson) {
      return { icon: BookOpen, label: "Lesson", color: "text-muted-foreground", bg: "bg-muted/10", border: "border-border/30" };
    }

    switch (currentLesson.type) {
      case "intro":
        return { icon: Lightbulb, label: "Introduction", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" };
      case "vocab":
        return { icon: BookOpen, label: "Vocabulary", color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" };
      case "practice":
        return { icon: Target, label: "Practice", color: "text-success", bg: "bg-success/10", border: "border-success/30" };
      case "quiz":
        return { icon: Zap, label: "Quiz", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" };
      default:
        return { icon: BookOpen, label: currentLesson.type, color: "text-muted-foreground", bg: "bg-muted/10", border: "border-border/30" };
    }
  }, [currentLesson]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto relative">
        <LessonBackground particles={particles} />
        <div className="relative z-10 text-center py-20">
          <p className="font-hand text-xl text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lessonMeta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center relative">
        <LessonBackground particles={particles} />
        <div className="relative z-10">
          <div className="text-8xl mb-6 animate-bounce">🦁</div>
          <h1 className="font-hand text-4xl mb-3">Somo Halipatikani</h1>
          <p className="font-hand-secondary text-lg text-muted-foreground mb-8">Lesson not found</p>
          <SketchButton onClick={() => router.push("/lessons")} size="lg">
            <ArrowLeft size={18} />
            Back to Lessons
          </SketchButton>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="max-w-2xl mx-auto relative">
        <LessonBackground particles={particles} />
        <div className="relative z-10 text-center py-20">
          <p className="font-hand text-xl text-muted-foreground">
            No vocabulary found for this lesson yet.
          </p>
        </div>
      </div>
    );
  }

  const rewardXp = isLessonCompleted(lessonId) ? 0 : lessonMeta.xp;

  return (
    <div className="max-w-2xl mx-auto relative">
      <LessonBackground particles={particles} />
      <LessonHeaderCard lessonMeta={lessonMeta} />
      <LessonProgress
        currentStep={currentStep}
        totalSteps={lessonSteps.length}
        progress={progress}
      />
      <LessonContentCard
        currentLesson={currentLesson}
        typeConfig={typeConfig}
        isAnimating={isAnimating}
        currentStep={currentStep}
        onPlayPronunciation={playPronunciation}
        ttsLoading={ttsLoading}
      />
      <LessonNavigation
        currentStep={currentStep}
        isLastStep={isLastStep}
        rewardXp={rewardXp}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onComplete={handleComplete}
      />
      <CelebrationModal
        show={showCelebration}
        confetti={confetti}
        lessonTitle={lessonMeta.title}
        xpAwarded={awardedXp}
        onContinue={() => router.push("/lessons")}
        onPracticeAgain={() => {
          setShowCelebration(false);
          setCurrentStep(0);
          setCompletedSteps([]);
        }}
      />
    </div>
  );
}
