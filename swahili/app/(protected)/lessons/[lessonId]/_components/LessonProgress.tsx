import { Sparkles } from "lucide-react";
import { SketchFlame } from "@/components/shared/HandDrawnIcons";
import { WobblyProgress } from "@/components/shared/Doodle";

interface LessonProgressProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function LessonProgress({ currentStep, totalSteps, progress }: LessonProgressProps) {
  return (
    <div className="relative z-10 mb-8 px-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SketchFlame size={18} className="text-accent" />
          <span className="font-hand text-lg">
            Step <span className="text-accent">{currentStep + 1}</span> of {totalSteps}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
          <Sparkles size={14} className="text-accent" />
          <span className="font-hand-secondary text-sm text-accent">{Math.round(progress)}%</span>
        </div>
      </div>

      <WobblyProgress progress={progress} colorClass="stroke-accent" className="h-3" />
    </div>
  );
}
