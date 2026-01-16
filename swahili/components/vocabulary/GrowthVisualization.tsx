'use client';

import { cn } from "@/lib/utils";
import { Droplets, Leaf, Flower2, TreeDeciduous, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type GrowthStage = "seed" | "sprout" | "sapling" | "flower" | "tree";

interface GrowthVisualizationProps {
  distribution: Record<GrowthStage, number>;
  totalWords: number;
}

const stages: { key: GrowthStage; icon: React.ReactNode; label: string; emoji: string; color: string; bgColor: string }[] = [
  { key: "seed", icon: <Droplets size={20} />, label: "Seeds", emoji: "🌰", color: "text-muted-foreground", bgColor: "bg-muted/20" },
  { key: "sprout", icon: <Leaf size={20} />, label: "Sprouts", emoji: "🌱", color: "text-success/60", bgColor: "bg-success/10" },
  { key: "sapling", icon: <Leaf size={22} />, label: "Saplings", emoji: "🌿", color: "text-success", bgColor: "bg-success/20" },
  { key: "flower", icon: <Flower2 size={22} />, label: "Blooming", emoji: "🌸", color: "text-accent", bgColor: "bg-accent/20" },
  { key: "tree", icon: <TreeDeciduous size={24} />, label: "Mastered", emoji: "🌳", color: "text-warning", bgColor: "bg-warning/20" },
];

export function GrowthVisualization({ distribution, totalWords }: GrowthVisualizationProps) {
  const previousDistribution = useRef<Record<GrowthStage, number>>(distribution);
  const [animatingStages, setAnimatingStages] = useState<Set<GrowthStage>>(new Set());
  const [sparklePositions, setSparklePositions] = useState<{ stage: GrowthStage; id: number }[]>([]);

  // Detect when a stage count increases (level up happened)
  useEffect(() => {
    const newAnimating = new Set<GrowthStage>();
    const newSparkles: { stage: GrowthStage; id: number }[] = [];

    stages.forEach(stage => {
      const prev = previousDistribution.current[stage.key];
      const current = distribution[stage.key];
      
      if (current > prev) {
        newAnimating.add(stage.key);
        // Add sparkles for each new word
        for (let i = 0; i < current - prev; i++) {
          newSparkles.push({ stage: stage.key, id: Date.now() + i });
        }
      }
    });

    if (newAnimating.size > 0) {
      setAnimatingStages(newAnimating);
      setSparklePositions(prev => [...prev, ...newSparkles]);

      // Clear animations after they complete
      setTimeout(() => {
        setAnimatingStages(new Set());
      }, 600);

      // Clear sparkles
      setTimeout(() => {
        setSparklePositions(prev => prev.filter(s => !newSparkles.includes(s)));
      }, 800);
    }

    previousDistribution.current = { ...distribution };
  }, [distribution]);

  return (
    <div className="relative">
      {/* Garden path visualization */}
      <div className="flex items-end justify-between gap-2 md:gap-4 py-4">
        {stages.map((stage, index) => {
          const count = distribution[stage.key];
          const percentage = totalWords > 0 ? (count / totalWords) * 100 : 0;
          const height = Math.max(60, 40 + percentage * 1.5);
          const isAnimating = animatingStages.has(stage.key);
          const stageSparkles = sparklePositions.filter(s => s.stage === stage.key);

          return (
            <div key={stage.key} className="flex-1 flex flex-col items-center group relative">
              {/* Floating sparkles when leveling up */}
              {stageSparkles.map((sparkle, i) => (
                <div
                  key={sparkle.id}
                  className="absolute -top-4 animate-float-up pointer-events-none"
                  style={{ left: `${30 + i * 20}%` }}
                >
                  <Sparkles size={16} className="text-warning" />
                </div>
              ))}

              {/* Growing plant visualization */}
              <div 
                className={cn(
                  "relative w-full max-w-[80px] rounded-t-2xl rounded-b-lg transition-all duration-700 flex flex-col items-center justify-end pb-3",
                  stage.bgColor,
                  "border-2 border-b-4",
                  stage.key === "tree" ? "border-warning/30" : 
                  stage.key === "flower" ? "border-accent/30" : 
                  stage.key === "sapling" ? "border-success/40" :
                  stage.key === "sprout" ? "border-success/20" : "border-border/30",
                  "hover:scale-105 cursor-pointer group",
                  isAnimating && "animate-grow-up"
                )}
                style={{ height: `${height}px` }}
              >
                {/* Emoji plant with animation */}
                <div className={cn(
                  "text-3xl md:text-4xl transition-transform duration-300",
                  "group-hover:scale-110",
                  stage.key === "tree" && "animate-wiggle",
                  stage.key === "flower" && "group-hover:animate-bounce-subtle",
                  isAnimating && "animate-sprout"
                )}>
                  {stage.emoji}
                </div>

                {/* Sparkle for mastered */}
                {stage.key === "tree" && count > 0 && (
                  <div className={cn(
                    "absolute -top-1 -right-1",
                    isAnimating && "animate-sparkle-burst"
                  )}>
                    <Sparkles size={14} className="text-warning animate-pulse-glow" />
                  </div>
                )}

                {/* Count badge with pulse on update */}
                <div className={cn(
                  "absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                  "border-2 border-card shadow-sm transition-transform",
                  stage.key === "tree" ? "bg-warning text-warning-foreground" :
                  stage.key === "flower" ? "bg-accent text-accent-foreground" :
                  stage.key === "sapling" || stage.key === "sprout" ? "bg-success text-success-foreground" :
                  "bg-muted text-muted-foreground",
                  isAnimating && "scale-125"
                )}>
                  {count}
                </div>
              </div>


              {/* Label */}
              <p className={cn(
                "font-hand-secondary text-xs md:text-sm mt-3 text-center transition-colors",
                stage.color,
                "group-hover:font-medium"
              )}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
