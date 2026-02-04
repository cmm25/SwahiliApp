'use client';

import { SketchCard } from "@/components/shared/SketchCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { JourneyPath } from "@/components/shared/HandDrawnIcons";
import { HighlightMarker } from "@/components/shared/DecorativeElements";
import { Lock, CheckCircle, Star, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { lessonLevels } from "@/lib/lesson-structure";
import { useStreak } from "@/hooks/useStreak";
import { useLessonProgress } from "@/hooks/useLessonProgress";

export default function Lessons() {
  const { xp, isLoading: xpLoading } = useStreak();
  const { isLessonCompleted } = useLessonProgress();

  return (
    <>
      <PageHeader 
        title="Jifunze" 
        subtitle="Learn Swahili step by step"
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full">
            <Sparkles size={14} className="text-warning/70" />
            <span className="font-hand-secondary text-sm">2/6 units complete</span>
          </div>
        }
      />
      
      <div className="space-y-12">
        {lessonLevels.map((level, levelIndex) => {
          const isLevelLocked = !xpLoading && level.requiredXp !== undefined && xp < level.requiredXp;
          return (
          <div key={level.id} className="animate-fade-in-up" style={{ animationDelay: `${levelIndex * 0.2}s` }}>
            {/* Level Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="px-4 py-2 border border-border/30 bg-card/50 rounded-sm">
                <h2 className="font-hand text-xl">{level.title}</h2>
              </div>
              <span className="font-hand-secondary text-sm text-muted-foreground">({level.subtitle})</span>
              {level.requiredXp !== undefined && (
                <div className="flex items-center gap-2 px-3 py-1 bg-warning/10 border border-warning/20 rounded-full">
                  <Sparkles size={12} className="text-warning/70" />
                  <span className="font-hand-secondary text-xs text-warning/80">
                    {isLevelLocked ? `Requires ${level.requiredXp} XP` : "Unlocked"}
                  </span>
                </div>
              )}
              <div className="flex-1 opacity-30">
                <JourneyPath className="text-border" />
              </div>
            </div>
            
            {/* Units Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {level.units.map((unit, unitIndex) => {
                const isUnitLocked = Boolean(unit.locked) || isLevelLocked;
                const isCurrent = Boolean(unit.current) && !isUnitLocked;
                const isCompleted = isLessonCompleted(unit.id);
                return (
                <Link 
                  key={unit.id} 
                  href={isUnitLocked ? "#" : `/lessons/${unit.id}`}
                  className={cn(isUnitLocked && "pointer-events-none")}
                >
                  <SketchCard
                    hover={!isUnitLocked}
                    variant={isCurrent ? "accent" : "default"}
                    className={cn(
                      "relative overflow-hidden transition-all",
                      isUnitLocked && "opacity-40",
                      isCompleted && !isUnitLocked && "border-success/30"
                    )}
                    style={{ animationDelay: `${(levelIndex * 4 + unitIndex) * 0.1}s` }}
                  >
                    {/* Completion badge */}
                    {isCompleted && !isUnitLocked && (
                      <div className="absolute top-3 right-3">
                        <div className="w-7 h-7 bg-success/20 border border-success/30 rounded-full flex items-center justify-center text-success">
                          <CheckCircle size={16} />
                        </div>
                      </div>
                    )}
                    
                    {/* Current indicator */}
                    {isCurrent && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-accent/20 text-accent border border-accent/30 rounded-full text-xs font-hand-secondary">
                        Continue →
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                    <div className={cn(
                      "w-14 h-14 border border-border/30 rounded-sm flex items-center justify-center",
                      isCompleted ? "bg-success/10" :
                      isCurrent ? "bg-accent/10" :
                      isUnitLocked ? "bg-muted/30" : "bg-secondary/30"
                    )}>
                      {isUnitLocked ? (
                          <Lock size={20} className="text-muted-foreground/50" />
                        ) : (
                        <span className="text-2xl">{unit.emoji}</span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-hand text-xl mb-1">
                          {unit.current ? (
                            <HighlightMarker color="accent">{unit.title}</HighlightMarker>
                          ) : unit.title}
                        </h3>
                        <p className="font-hand-secondary text-sm text-muted-foreground">{unit.description}</p>
                        
                        {/* Progress bar for current */}
                        {isCurrent && unit.progress !== undefined && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs font-hand-secondary mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-accent">{unit.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-muted/30 border border-border/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-accent/60 transition-all"
                                style={{ width: `${unit.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* XP reward */}
                        <div className="flex items-center gap-2 mt-3">
                          <Star size={12} className="text-warning/70" fill="currentColor" />
                          <span className="font-hand-secondary text-xs text-warning/70">{unit.xp} XP</span>
                          
                          {!isUnitLocked && !unit.completed && (
                            <span className="ml-auto flex items-center gap-1 text-accent/70 font-hand-secondary text-xs">
                              Start <ChevronRight size={12} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </SketchCard>
                </Link>
              );
              })}
            </div>
          </div>
          );
        })}
      </div>
    </>
  );
}
