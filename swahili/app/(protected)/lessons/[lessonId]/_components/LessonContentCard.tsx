import type { LucideIcon } from "lucide-react";
import { BookOpen, Lightbulb, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SketchCard } from "@/components/shared/SketchCard";
import { SketchStar } from "@/components/shared/HandDrawnIcons";
import { FloatingShapes } from "@/components/shared/DecorativeElements";
import { HandDrawnBorder, CornerSquiggle, DoodleStarburst } from "@/components/shared/Doodle";
import type { LessonStep } from "./types";

type LessonTypeConfig = {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  border: string;
};

interface LessonContentCardProps {
  currentLesson: LessonStep;
  typeConfig: LessonTypeConfig;
  isAnimating: boolean;
  currentStep: number;
  onPlayPronunciation: (text: string) => void;
  ttsLoading: boolean;
}

export function LessonContentCard({
  currentLesson,
  typeConfig,
  isAnimating,
  currentStep,
  onPlayPronunciation,
  ttsLoading,
}: LessonContentCardProps) {
  const TypeIcon = typeConfig.icon;

  return (
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

              <button
                onClick={() => onPlayPronunciation(currentLesson.content.swahili)}
                disabled={ttsLoading}
                aria-label="Play pronunciation"
                className={cn(
                  "mt-6 p-4 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 hover:border-accent/50 hover:from-accent/30 hover:to-accent/10 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-accent/10",
                  ttsLoading && "opacity-60 cursor-not-allowed hover:shadow-none"
                )}
              >
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
                  &quot;{currentLesson.content.example.swahili}&quot;
                </p>
                <p className="font-hand-secondary text-base text-muted-foreground">
                  &quot;{currentLesson.content.example.english}&quot;
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
  );
}
