import { Droplets, Target, ChevronRight } from "lucide-react";
import { SketchCard } from "@/components/shared/SketchCard";
import { SketchButton } from "@/components/shared/SketchButton";
import { GrowthVisualization } from "@/components/vocabulary/GrowthVisualization";
import type { GrowthStage } from "@/lib/agents/teaching-shared";

interface GrowthOverviewProps {
  learnedCount: number;
  masteredCount: number;
  totalVocabulary: number;
  distribution: Record<GrowthStage, number>;
  totalWords: number;
  onQuickReview: () => void;
  onTakeQuiz: () => void;
  quizLoading: boolean;
}

export function GrowthOverview({
  learnedCount,
  masteredCount,
  totalVocabulary,
  distribution,
  totalWords,
  onQuickReview,
  onTakeQuiz,
  quizLoading,
}: GrowthOverviewProps) {
  return (
    <section className="mb-8">
      <SketchCard className="bg-gradient-to-br from-success/5 via-card to-warning/5 border-success/20 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-hand text-2xl flex items-center gap-2">
              🌱 Your Garden is Thriving!
            </h2>
            <p className="font-hand-secondary text-muted-foreground">
              <span className="text-accent font-medium">{learnedCount} learned</span> •
              <span className="text-warning font-medium"> {masteredCount} mastered</span> •
              <span className="text-muted-foreground"> {totalVocabulary} total words</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <SketchButton variant="default" onClick={onQuickReview} className="group">
              <Droplets size={16} className="group-hover:animate-bounce" />
              Quick Review
            </SketchButton>

            <SketchButton
              variant="accent"
              onClick={onTakeQuiz}
              className="group"
              disabled={quizLoading}
            >
              <Target size={16} className="group-hover:scale-110 transition-transform" />
              Take Quiz
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </SketchButton>
          </div>
        </div>

        <GrowthVisualization distribution={distribution} totalWords={totalWords} />
      </SketchCard>
    </section>
  );
}
