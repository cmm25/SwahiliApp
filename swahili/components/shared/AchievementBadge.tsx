'use client';

import { cn } from "@/lib/utils";
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  MessageCircle, 
  Star, 
  Target,
  Award,
  Zap,
  Heart,
  Globe
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export type BadgeType = 
  | "first_lesson"
  | "streak_7"
  | "streak_30"
  | "words_100"
  | "words_500"
  | "conversation_10"
  | "perfect_quiz"
  | "daily_goal"
  | "explorer"
  | "champion";

interface AchievementBadgeProps {
  type: BadgeType;
  unlocked?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const badgeConfig: Record<BadgeType, { icon: LucideIcon; label: string; color: string }> = {
  first_lesson: { icon: BookOpen, label: "Somo la Kwanza", color: "text-success" },
  streak_7: { icon: Flame, label: "Wiki Moja", color: "text-accent" },
  streak_30: { icon: Flame, label: "Mwezi Mmoja", color: "text-accent" },
  words_100: { icon: Star, label: "Maneno 100", color: "text-warning" },
  words_500: { icon: Award, label: "Maneno 500", color: "text-warning" },
  conversation_10: { icon: MessageCircle, label: "Mazungumzo 10", color: "text-success" },
  perfect_quiz: { icon: Target, label: "Jaribio Kamili", color: "text-accent" },
  daily_goal: { icon: Zap, label: "Lengo la Leo", color: "text-warning" },
  explorer: { icon: Globe, label: "Mchunguzi", color: "text-success" },
  champion: { icon: Trophy, label: "Bingwa", color: "text-warning" },
};

export function AchievementBadge({ 
  type, 
  unlocked = false, 
  size = "md",
  showLabel = false,
  className 
}: AchievementBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  const sizes = {
    sm: { container: "w-10 h-10", icon: 18 },
    md: { container: "w-14 h-14", icon: 24 },
    lg: { container: "w-20 h-20", icon: 32 },
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div 
        className={cn(
          sizes[size].container,
          "sketch-border flex items-center justify-center transition-all",
          unlocked 
            ? cn("bg-card", config.color, "animate-pulse-glow") 
            : "bg-muted text-muted-foreground opacity-50"
        )}
      >
        <Icon size={sizes[size].icon} />
      </div>
      {showLabel && (
        <span className={cn(
          "font-hand-secondary text-xs text-center",
          unlocked ? "text-foreground" : "text-muted-foreground"
        )}>
          {config.label}
        </span>
      )}
    </div>
  );
}
