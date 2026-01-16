'use client';

import { cn } from "@/lib/utils";

interface LevelProgressProps {
  level: number;
  currentXP: number;
  requiredXP: number;
  className?: string;
}

export function LevelProgress({ level, currentXP, requiredXP, className }: LevelProgressProps) {
  const progress = Math.min((currentXP / requiredXP) * 100, 100);

  const levelTitles: Record<number, string> = {
    1: "Mwanafunzi", // Student
    2: "Mcheza", // Player
    3: "Msomi", // Learner
    4: "Mjuzi", // Knowledgeable
    5: "Mzungumzaji", // Speaker
    6: "Mtaalamu", // Expert
    7: "Bingwa", // Champion
    8: "Mwalimu", // Teacher
    9: "Mkuu", // Master
    10: "Kiongozi", // Leader
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 sketch-border bg-accent text-accent-foreground flex items-center justify-center font-hand text-xl font-bold">
            {level}
          </div>
          <div>
            <p className="font-hand-secondary text-sm text-muted-foreground">Level {level}</p>
            <p className="font-hand text-lg">{levelTitles[level] || "Mwanafunzi"}</p>
          </div>
        </div>
        <span className="font-hand-secondary text-sm text-muted-foreground">
          {currentXP} / {requiredXP} XP
        </span>
      </div>
      
      <div className="h-3 bg-muted sketch-border overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
