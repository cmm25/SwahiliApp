'use client';

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SketchCard } from "@/components/shared/SketchCard";
import { SketchButton } from "@/components/shared/SketchButton";
import { CategoryIcon, SketchStar, SketchFlame } from "@/components/shared/HandDrawnIcons";
import { HighlightMarker, FloatingShapes } from "@/components/shared/DecorativeElements";
import { WobblyProgress, DoodleStarburst, HandDrawnBorder, CornerSquiggle } from "@/components/shared/Doodle";
import { ArrowLeft, ArrowRight, Volume2, Lightbulb, Target, Sparkles, Zap, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type LessonMeta = {
  title: string;
  subtitle: string;
  category: string;
  xp: number;
  totalWords: number;
};

type LessonStep = {
  id: number;
  type: "intro" | "vocab" | "practice" | "quiz";
  title: string;
  content: {
    swahili: string;
    english: string;
    pronunciation?: string;
    example?: { swahili: string; english: string };
    tip?: string;
  };
};

type VocabularyCategoryRow = {
  category: string | null;
};

type FloatingParticleSpec = {
  delay: number;
  size: number;
  color: string;
  left: number;
  top: number;
  duration: number;
};

function FloatingParticle({ delay, size, color, left, top, duration }: FloatingParticleSpec) {
  return (
    <div
      className={cn("absolute rounded-full opacity-60 animate-float", color)}
      style={{
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        left: `${left}%`,
        top: `${top}%`,
      }}
    />
  );
}

function LessonBackground({ particles }: { particles: FloatingParticleSpec[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
      <div
        className="absolute -bottom-20 -left-20 w-48 h-48 bg-warning/10 rounded-full blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      {particles.map((particle, i) => (
        <FloatingParticle
          key={i}
          {...particle}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}

export default function LessonDetail() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lessonSteps, setLessonSteps] = useState<LessonStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonMeta, setLessonMeta] = useState<LessonMeta | null>(null);
  const [particles, setParticles] = useState<FloatingParticleSpec[]>([]);

  const lessonId = Number(params?.lessonId ?? 0);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
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
    setParticles(generated);
  }, []);

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

      const { data: categoryRows, error: categoryError } = await (supabase as any)
        .from("vocabulary_words")
        .select("category");

      if (!isMounted) return;

      if (categoryError) {
        console.error("Failed to load lesson categories:", categoryError.message);
        setLessonSteps([]);
        setIsLoading(false);
        return;
      }

      const categoryCounts = (categoryRows as VocabularyCategoryRow[] | null ?? [])
        .reduce<Record<string, number>>((acc, row) => {
          if (!row.category) return acc;
          acc[row.category] = (acc[row.category] ?? 0) + 1;
          return acc;
        }, {});

      const categories = Object.keys(categoryCounts).sort((a, b) => a.localeCompare(b));
      const selectedCategory = categories[lessonId - 1];

      if (!selectedCategory) {
        setLessonSteps([]);
        setIsLoading(false);
        return;
      }

      const totalWords = categoryCounts[selectedCategory] ?? 0;
      const title = selectedCategory.replace(/[-_]/g, " ");
      const subtitle = title.charAt(0).toUpperCase() + title.slice(1);
      const xp = Math.min(150, Math.max(50, totalWords * 5));

      setLessonMeta({
        title: subtitle,
        subtitle,
        category: selectedCategory,
        xp,
        totalWords,
      });

      const { data: words, error } = await (supabase as any)
        .from("vocabulary_words")
        .select("id, swahili, english, category, created_at")
        .eq("category", selectedCategory);

      if (!isMounted) return;

      if (error) {
        console.error("Failed to load lesson words:", error.message);
        setLessonSteps([]);
        setIsLoading(false);
        return;
      }

      const sortedWords = (words ?? []).slice(0, 20);
      const steps: LessonStep[] = sortedWords.map((word, index) => ({
        id: index + 1,
        type: "vocab",
        title: word.swahili,
        content: {
          swahili: word.swahili,
          english: word.english,
        },
      }));

      setLessonSteps(steps);
      setCurrentStep(0);
      setCompletedSteps([]);
      setIsLoading(false);
    }

    loadLesson();

    return () => {
      isMounted = false;
    };
  }, [lessonId, user?.id]);

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

  const handleComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
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

  if (!lessonMeta) {
    return (
      <AppLayout>
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
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto relative">
          <LessonBackground particles={particles} />
          <div className="relative z-10 text-center py-20">
            <p className="font-hand text-xl text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!currentLesson) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto relative">
          <LessonBackground particles={particles} />
          <div className="relative z-10 text-center py-20">
            <p className="font-hand text-xl text-muted-foreground">
              No vocabulary found for this lesson yet.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const TypeIcon = typeConfig.icon;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto relative">
        <LessonBackground particles={particles} />

        <div className="relative z-10 mb-8">
          <SketchCard className="!p-4 backdrop-blur-sm bg-card/80">
            <div className="flex items-center gap-4">
              <Link
                href="/lessons"
                className="p-2.5 rounded-xl border-2 border-border/40 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group"
              >
                <ArrowLeft size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </Link>

              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl border-2 border-accent/30 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center shadow-lg">
                    <CategoryIcon category={lessonMeta.category} size={28} />
                  </div>
                  <div className="absolute -top-1 -right-1 animate-spin [animation-duration:8s]">
                    <DoodleStarburst size={16} className="text-warning" />
                  </div>
                </div>
                <div>
                  <h1 className="font-hand text-2xl leading-tight">
                    <HighlightMarker color="accent">{lessonMeta.title}</HighlightMarker>
                  </h1>
                  <p className="font-hand-secondary text-sm text-muted-foreground">{lessonMeta.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-warning/20 to-warning/5 border-2 border-warning/30 rounded-xl shadow-sm">
                <SketchStar size={18} filled className="text-warning animate-pulse" />
                <span className="font-hand text-lg text-warning">{lessonMeta.xp}</span>
                <span className="font-hand-secondary text-xs text-warning/70">XP</span>
              </div>
            </div>
          </SketchCard>
        </div>

        <div className="relative z-10 mb-8 px-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <SketchFlame size={18} className="text-accent" />
              <span className="font-hand text-lg">
                Step <span className="text-accent">{currentStep + 1}</span> of {lessonSteps.length}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
              <Sparkles size={14} className="text-accent" />
              <span className="font-hand-secondary text-sm text-accent">{Math.round(progress)}%</span>
            </div>
          </div>

          <WobblyProgress progress={progress} colorClass="stroke-accent" className="h-3" />
        </div>

        <div className="relative z-10 mb-8">
          <SketchCard variant="accent" className="relative overflow-hidden">
            <HandDrawnBorder variant="accent" className="rounded-2xl" />
            <div
              className={cn(
                "relative p-6 md:p-8 transition-all duration-500",
                isAnimating && "opacity-0 translate-y-4"
              )}
              key={currentStep}
            >
              <FloatingShapes className="opacity-10" />
              <CornerSquiggle position="top-right" className="text-accent/30" />
              <CornerSquiggle position="bottom-left" className="text-warning/30" />

              <div className="flex items-center gap-3 mb-6">
                <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border-2", typeConfig.bg, typeConfig.border)}>
                  <TypeIcon size={18} className={typeConfig.color} />
                  <span className={cn("font-hand-secondary text-sm", typeConfig.color)}>{typeConfig.label}</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
              </div>

              <h2 className="font-hand text-2xl mb-8 flex items-center gap-3">
                <span>{currentLesson.title}</span>
                <DoodleStarburst size={24} className="text-warning/60" />
              </h2>

              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-warning/10 rounded-2xl blur-xl" />
                <div className="relative text-center py-10 px-6 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-2 border-accent/20 rounded-2xl shadow-xl">
                  <div className="absolute top-4 left-4">
                    <SketchStar size={20} className="text-warning/40" />
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <SketchStar size={16} className="text-accent/40" />
                  </div>

                  <p className="font-hand text-5xl md:text-6xl lg:text-7xl text-accent mb-4 animate-fade-in-up tracking-wide">
                    {currentLesson.content.swahili}
                  </p>

                  {currentLesson.content.pronunciation && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="font-hand-secondary text-base text-muted-foreground/80 italic">
                        /{currentLesson.content.pronunciation}/
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-4 my-4">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-border/50" />
                    <div className="w-2 h-2 rounded-full bg-accent/50" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-border/50" />
                  </div>

                  <p className="font-hand-secondary text-xl text-foreground/80">{currentLesson.content.english}</p>

                  <button className="mt-6 p-4 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 hover:border-accent/50 hover:from-accent/30 hover:to-accent/10 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-accent/10">
                    <Volume2 size={28} className="text-accent group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {currentLesson.content.example && (
                <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-accent/70" />
                    <span className="font-hand-secondary text-sm text-accent/70 uppercase tracking-wider">Example</span>
                  </div>
                  <div className="relative p-5 bg-gradient-to-br from-secondary/50 to-secondary/20 border-2 border-border/30 rounded-xl">
                    <div className="absolute top-0 left-4 -translate-y-1/2 px-2 bg-card">
                      <span className="text-xs font-hand-secondary text-muted-foreground">Mfano</span>
                    </div>
                    <p className="font-hand text-xl text-foreground mb-2">
                      "{currentLesson.content.example.swahili}"
                    </p>
                    <p className="font-hand-secondary text-base text-muted-foreground">
                      "{currentLesson.content.example.english}"
                    </p>
                  </div>
                </div>
              )}

              {currentLesson.content.tip && (
                <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <div className="flex gap-4 p-5 bg-gradient-to-br from-warning/15 to-warning/5 border-2 border-warning/30 rounded-xl shadow-sm">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-warning/20 border border-warning/30 flex items-center justify-center">
                      <Lightbulb size={20} className="text-warning" />
                    </div>
                    <div>
                      <p className="font-hand text-sm text-warning mb-1">Pro Tip</p>
                      <p className="font-hand-secondary text-sm text-foreground/80 leading-relaxed">
                        {currentLesson.content.tip}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SketchCard>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <SketchButton
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={cn("flex-1", currentStep === 0 && "opacity-40 cursor-not-allowed")}
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Previous</span>
          </SketchButton>

          {isLastStep ? (
            <SketchButton
              size="lg"
              onClick={handleComplete}
              className="flex-[2] bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 border-success/50 shadow-lg shadow-success/20"
            >
              <Trophy size={18} />
              Complete Lesson
              <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-white/20 rounded-full">
                <SketchStar size={12} filled className="text-warning" />
                <span className="text-xs">+{lessonMeta.xp}</span>
              </div>
            </SketchButton>
          ) : (
            <SketchButton size="lg" onClick={handleNext} className="flex-[2] shadow-lg shadow-accent/20">
              Continue
              <ArrowRight size={18} />
            </SketchButton>
          )}

          <SketchButton
            variant="outline"
            size="lg"
            onClick={handleNext}
            disabled={isLastStep}
            className={cn("flex-1", isLastStep && "opacity-40 cursor-not-allowed")}
          >
            <span className="hidden sm:inline">Skip</span>
            <ArrowRight size={18} />
          </SketchButton>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-3 h-3 rounded-full",
                    i % 5 === 0 ? "bg-accent" :
                    i % 5 === 1 ? "bg-warning" :
                    i % 5 === 2 ? "bg-success" :
                    i % 5 === 3 ? "bg-primary" : "bg-secondary"
                  )}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10%`,
                    animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <SketchCard className="max-w-md text-center p-8 md:p-10 relative animate-scale-in shadow-2xl">
              <CornerSquiggle position="top-left" className="text-warning/50" />
              <CornerSquiggle position="bottom-right" className="text-accent/50" />

              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-warning/30 to-warning/10 border-4 border-warning/40 flex items-center justify-center shadow-xl shadow-warning/20">
                  <Trophy size={48} className="text-warning animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 animate-spin [animation-duration:4s]">
                  <DoodleStarburst size={32} className="text-accent" />
                </div>
              </div>

              <h2 className="font-hand text-4xl mb-3">
                <HighlightMarker color="success">Hongera!</HighlightMarker>
              </h2>
              <p className="font-hand-secondary text-lg text-muted-foreground mb-6">
                Congratulations! You've mastered <span className="text-accent font-hand">{lessonMeta.title}</span>!
              </p>

              <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-gradient-to-r from-warning/20 via-warning/10 to-warning/20 rounded-xl border-2 border-warning/30">
                <SketchStar size={32} filled className="text-warning animate-pulse" />
                <span className="font-hand text-4xl text-warning">+{lessonMeta.xp}</span>
                <span className="font-hand-secondary text-lg text-warning/70">XP</span>
              </div>

              <div className="flex flex-col gap-3">
                <SketchButton
                  onClick={() => router.push("/lessons")}
                  size="lg"
                  className="w-full shadow-lg"
                >
                  <Sparkles size={18} />
                  Continue Learning
                </SketchButton>
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    setCurrentStep(0);
                    setCompletedSteps([]);
                  }}
                  className="font-hand-secondary text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Practice Again
                </button>
              </div>
            </SketchCard>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </AppLayout>
  );
}
