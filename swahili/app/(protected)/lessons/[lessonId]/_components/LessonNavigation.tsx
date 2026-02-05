import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { SketchButton } from "@/components/shared/SketchButton";
import { SketchStar } from "@/components/shared/HandDrawnIcons";

interface LessonNavigationProps {
  currentStep: number;
  isLastStep: boolean;
  rewardXp: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export function LessonNavigation({
  currentStep,
  isLastStep,
  rewardXp,
  onPrevious,
  onNext,
  onComplete,
}: LessonNavigationProps) {
  return (
    <div className="relative z-10 flex items-center gap-4">
      <SketchButton
        variant="outline"
        size="lg"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={cn("flex-1", currentStep === 0 && "opacity-40 cursor-not-allowed")}
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Previous</span>
      </SketchButton>

      {isLastStep ? (
        <SketchButton
          size="lg"
          onClick={onComplete}
          className="flex-[2] bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 border-success/50 shadow-lg shadow-success/20"
        >
          <Trophy size={18} />
          Complete Lesson
          {rewardXp > 0 && (
            <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-white/20 rounded-full">
              <SketchStar size={12} filled className="text-warning" />
              <span className="text-xs">+{rewardXp}</span>
            </div>
          )}
        </SketchButton>
      ) : (
        <SketchButton size="lg" onClick={onNext} className="flex-[2] shadow-lg shadow-accent/20">
          Continue
          <ArrowRight size={18} />
        </SketchButton>
      )}

      <SketchButton
        variant="outline"
        size="lg"
        onClick={onNext}
        disabled={isLastStep}
        className={cn("flex-1", isLastStep && "opacity-40 cursor-not-allowed")}
      >
        <span className="hidden sm:inline">Skip</span>
        <ArrowRight size={18} />
      </SketchButton>
    </div>
  );
}
