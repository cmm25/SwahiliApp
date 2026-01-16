import { cn } from "@/lib/utils";
import { Droplets, Flame, Trophy, Sparkles, Target } from "lucide-react";

interface GardenStatsProps {
  totalWords: number;
  masteredWords: number;
  streakDays: number;
  todayXP: number;
  waterProgress: number;
}

export function GardenStats({ 
  totalWords, 
  masteredWords, 
  streakDays, 
  todayXP,
  waterProgress 
}: GardenStatsProps) {
  const masteryPercentage = Math.round((masteredWords / totalWords) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Streak counter */}
      <div className="relative overflow-hidden rounded-xl border border-warning/30 bg-gradient-to-br from-warning/10 to-card p-4 group hover:scale-[1.02] transition-transform">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-warning/20 rounded-full blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-warning/20">
              <Flame size={18} className="text-warning animate-fire-flicker" />
            </div>
            <span className="font-hand-secondary text-xs text-muted-foreground">Streak</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-hand text-3xl text-warning">{streakDays}</span>
            <span className="font-hand-secondary text-sm text-muted-foreground">days</span>
          </div>
        </div>
      </div>

      {/* Today's XP */}
      <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-card p-4 group hover:scale-[1.02] transition-transform">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-accent/20">
              <Sparkles size={18} className="text-accent" />
            </div>
            <span className="font-hand-secondary text-xs text-muted-foreground">Today's XP</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-hand text-3xl text-accent">+{todayXP}</span>
            <span className="font-hand-secondary text-sm text-muted-foreground">XP</span>
          </div>
        </div>
      </div>

      {/* Mastery progress */}
      <div className="relative overflow-hidden rounded-xl border border-success/30 bg-gradient-to-br from-success/10 to-card p-4 group hover:scale-[1.02] transition-transform">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-success/20 rounded-full blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-success/20">
              <Trophy size={18} className="text-success" />
            </div>
            <span className="font-hand-secondary text-xs text-muted-foreground">Mastered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-hand text-3xl text-success">{masteredWords}</span>
            <div className="flex-1">
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-success to-success/70 rounded-full transition-all duration-1000"
                  style={{ width: `${masteryPercentage}%` }}
                />
              </div>
              <span className="font-hand-secondary text-xs text-muted-foreground">{masteryPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily goal */}
      <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-muted/30 to-card p-4 group hover:scale-[1.02] transition-transform">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Target size={18} className="text-primary" />
            </div>
            <span className="font-hand-secondary text-xs text-muted-foreground">Daily Goal</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Circular progress */}
            <div className="relative w-12 h-12">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="hsl(var(--muted) / 0.3)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="hsl(var(--accent))"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${waterProgress * 1.26} 126`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplets size={16} className="text-accent" />
              </div>
            </div>
            <div>
              <span className="font-hand text-2xl">{waterProgress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
