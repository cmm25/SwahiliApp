import { Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { SketchCard } from "@/components/shared/SketchCard";
import { SketchButton } from "@/components/shared/SketchButton";
import { SketchStar } from "@/components/shared/HandDrawnIcons";
import { HighlightMarker } from "@/components/shared/DecorativeElements";
import { CornerSquiggle, DoodleStarburst } from "@/components/shared/Doodle";
import type { ConfettiSpec } from "./types";

interface CelebrationModalProps {
  show: boolean;
  confetti: ConfettiSpec[];
  lessonTitle: string;
  xpAwarded: number;
  onContinue: () => void;
  onPracticeAgain: () => void;
}

export function CelebrationModal({
  show,
  confetti,
  lessonTitle,
  xpAwarded,
  onContinue,
  onPracticeAgain,
}: CelebrationModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((piece, i) => (
          <div
            key={i}
            className={cn("absolute w-3 h-3 rounded-full", piece.color)}
            style={{
              left: `${piece.left}%`,
              top: `-10%`,
              animation: `fall ${piece.duration}s linear forwards`,
              animationDelay: `${piece.delay}s`,
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
          Congratulations! You&apos;ve mastered <span className="text-accent font-hand">{lessonTitle}</span>!
        </p>

        {xpAwarded > 0 && (
          <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-gradient-to-r from-warning/20 via-warning/10 to-warning/20 rounded-xl border-2 border-warning/30">
            <SketchStar size={32} filled className="text-warning animate-pulse" />
            <span className="font-hand text-4xl text-warning">+{xpAwarded}</span>
            <span className="font-hand-secondary text-lg text-warning/70">XP</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <SketchButton onClick={onContinue} size="lg" className="w-full shadow-lg">
            <Sparkles size={18} />
            Continue Learning
          </SketchButton>
          <button
            onClick={onPracticeAgain}
            className="font-hand-secondary text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            Practice Again
          </button>
        </div>
      </SketchCard>
    </div>
  );
}
