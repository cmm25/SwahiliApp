'use client';

import { PageHeader } from "@/components/shared/PageHeader";
import { Sparkles } from "lucide-react";
import { lessonLevels } from "@/lib/lesson-structure";
import { useStreak } from "@/hooks/useStreak";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { LessonLevel } from "./_components/LessonLevel";

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
        {lessonLevels.map((level, levelIndex) => (
          <LessonLevel 
            key={level.id}
            level={level}
            levelIndex={levelIndex}
            xp={xp}
            xpLoading={xpLoading}
            isLessonCompleted={isLessonCompleted}
          />
        ))}
      </div>
    </>
  );
}
