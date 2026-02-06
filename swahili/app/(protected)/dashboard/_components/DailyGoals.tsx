'use client';

import { SketchCard } from "@/components/shared/SketchCard";
import { CornerSquiggle, WobblyProgress } from "@/components/shared/Doodle";
import { LevelProgress } from "@/components/shared/LevelProgress";

interface DailyGoalsProps {
  userData: {
    lessonsCompletedToday: number;
    dailyGoal: number;
    level: number;
    currentLevelXP: number;
    requiredLevelXP: number;
  };
}

export function DailyGoals({ userData }: DailyGoalsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Today's Goal Progress */}
      <SketchCard className="relative overflow-hidden" doodle>
        <CornerSquiggle position="top-right" className="top-1 right-1 text-accent/30" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-hand text-xl flex items-center gap-2">
                🎯 Lengo la Leo
              </h2>
              <p className="font-hand-secondary text-xs text-muted-foreground">Today&apos;s Goal</p>
            </div>
            <div className="text-right">
              <p className="font-hand text-2xl">
                <span className="text-accent">{userData.lessonsCompletedToday}</span>
                <span className="text-muted-foreground">/{userData.dailyGoal}</span>
              </p>
            </div>
          </div>

          {/* Wobbly progress bar */}
          <WobblyProgress
            progress={(userData.lessonsCompletedToday / userData.dailyGoal) * 100}
            colorClass="text-accent"
            className="mb-3"
          />

          <p className="font-hand-secondary text-xs text-center text-muted-foreground">
            {userData.dailyGoal - userData.lessonsCompletedToday === 0
              ? "🎉 Hongera! Goal reached!"
              : `${userData.dailyGoal - userData.lessonsCompletedToday} more to go!`
            }
          </p>
        </div>
      </SketchCard>

      {/* Level Progress */}
      <SketchCard>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
            <span className="font-hand text-xl text-accent">{userData.level}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-hand text-lg">Level {userData.level} - Msomi</h3>
              <span className="font-hand-secondary text-xs text-muted-foreground">{userData.currentLevelXP}/{userData.requiredLevelXP} XP</span>
            </div>
            <LevelProgress
              level={userData.level}
              currentXP={userData.currentLevelXP}
              requiredXP={userData.requiredLevelXP}
            />
            <p className="font-hand-secondary text-xs text-muted-foreground mt-1">
              {userData.requiredLevelXP - userData.currentLevelXP} XP to Level {userData.level + 1}
            </p>
          </div>
        </div>
      </SketchCard>
    </div>
  );
}
