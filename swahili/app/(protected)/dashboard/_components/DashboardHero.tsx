'use client';

import Link from "next/link";
import { Play } from "lucide-react";
import { SketchButton } from "@/components/shared/SketchButton";
import { LionMascot, SketchFlame, SketchStar } from "@/components/shared/HandDrawnIcons";

interface DashboardHeroProps {
  greeting: {
    swahili: string;
    english: string;
    emoji: string;
  };
  userData: {
    name: string;
    streak: number;
    xp: number;
    wordsLearned: number;
  };
  typedText: string;
  showCursor: boolean;
}

export function DashboardHero({ greeting, userData, typedText, showCursor }: DashboardHeroProps) {
  return (
    <section className="relative mb-8">
      {/* Greeting Card with Mascot */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/5 via-warning/5 to-success/5 border border-border/20 p-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-warning/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Mascot with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full scale-75" />
            <LionMascot size={100} className="relative animate-float" />

            {/* Speech bubble */}
            <div className="absolute -top-2 -right-8 bg-card border border-border/30 rounded-2xl rounded-bl-sm px-3 py-1.5 shadow-sm">
              <span className="font-hand text-sm">Karibu!</span>
            </div>
          </div>

          {/* Greeting content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-2xl">{greeting.emoji}</span>
              <span className="font-hand-secondary text-sm uppercase tracking-wider">{greeting.english}</span>
            </div>

            <h1 className="font-hand text-4xl lg:text-5xl text-foreground">
              {greeting.swahili}, <span className="text-accent">{userData.name}</span>!
            </h1>

            <p className="font-hand-secondary text-lg text-muted-foreground">
              {typedText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-accent`}>|</span>
            </p>

            {/* Quick stats row */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <SketchFlame size={28} className="text-destructive animate-fire-flicker" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-card border border-destructive/30 rounded-full flex items-center justify-center">
                    <span className="font-hand text-xs text-destructive">{userData.streak}</span>
                  </div>
                </div>
                <div>
                  <p className="font-hand text-lg leading-none">{userData.streak} days</p>
                  <p className="font-hand-secondary text-xs text-muted-foreground">Streak</p>
                </div>
              </div>

              <div className="w-px h-8 bg-border/50" />

              <div className="flex items-center gap-2">
                <SketchStar size={28} filled className="text-warning" />
                <div>
                  <p className="font-hand text-lg leading-none">{userData.xp.toLocaleString()} XP</p>
                  <p className="font-hand-secondary text-xs text-muted-foreground">Total earned</p>
                </div>
              </div>

              <div className="w-px h-8 bg-border/50" />

              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-hand text-lg leading-none">{userData.wordsLearned} words</p>
                  <p className="font-hand-secondary text-xs text-muted-foreground">Mastered</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/lessons">
              <SketchButton variant="accent" size="lg" className="group">
                <Play size={18} className="group-hover:scale-110 transition-transform" />
                Continue Learning
              </SketchButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
