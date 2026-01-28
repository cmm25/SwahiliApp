'use client';

import Link from "next/link";
import {
  BookOpen,
  MessageCircle,
  Flower2,
  ChevronRight,
  Play,
  Volume2,
  Heart,
  Leaf,
  TreeDeciduous
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SketchCard } from "@/components/shared/SketchCard";
import { SketchButton } from "@/components/shared/SketchButton";
import { LevelProgress } from "@/components/shared/LevelProgress";
import { BadgeType } from "@/components/shared/AchievementBadge";
import { LionMascot, SketchFlame, SketchStar } from "@/components/shared/HandDrawnIcons";
import { DoodleArrow, SquigglyUnderline, WobblyProgress, CornerSquiggle } from "@/components/shared/Doodle";
import { DailyArticleFeature } from "@/components/article";
import { useState, useEffect } from "react";
import { useStreak } from "@/hooks/useStreak";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Dashboard() {
  const { streak, xp } = useStreak();
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { swahili: "Habari ya asubuhi", english: "Good morning", emoji: "🌅", period: "morning" };
    if (hour < 17) return { swahili: "Habari ya mchana", english: "Good afternoon", emoji: "☀️", period: "afternoon" };
    return { swahili: "Habari ya jioni", english: "Good evening", emoji: "🌙", period: "evening" };
  };

  const greeting = getGreeting();

  // Calculate level from XP (100 XP per level)
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXP = xp % 500;
  const requiredLevelXP = 500;

  const userData = {
    name: "Mwanafunzi",
    streak,
    xp,
    level,
    currentLevelXP,
    requiredLevelXP,
    lessonsCompletedToday: 2,
    dailyGoal: 3,
    rank: 4,
    wordsLearned: 156,
    minutesToday: 23,
    recentBadges: ["first_lesson", "streak_7", "words_100"] as BadgeType[],
  };

  // Word of the day
  const wordOfDay = {
    swahili: "Upendo",
    english: "Love",
    pronunciation: "oo-PEN-doh",
    example: "Upendo ni nguvu kubwa. (Love is a great strength.)",
    category: "Emotions"
  };

  // Rising bubble wisdom quotes - one per day
  const wisdomBubbles = [
    { day: 1, quote: "Mti haupandwi jioni", translation: "A tree is not planted in the evening", meaning: "Start learning now, not later!" },
    { day: 2, quote: "Pole pole ndio mwendo", translation: "Slowly, slowly is the way", meaning: "Consistent practice beats cramming." },
    { day: 3, quote: "Haba na haba hujaza kibaba", translation: "Little by little fills the measure", meaning: "Small daily lessons add up!" },
    { day: 4, quote: "Asiyefunzwa na mamae hufunzwa na ulimwengu", translation: "Who is not taught by mother is taught by the world", meaning: "Every mistake is a lesson." },
    { day: 5, quote: "Mwenye kujua hajui, asiyejua ndo anayejua", translation: "He who knows doesn't know, he who doesn't know, knows", meaning: "Stay curious and humble." },
    { day: 6, quote: "Safari ya maili elfu huanza na hatua moja", translation: "A journey of a thousand miles begins with one step", meaning: "Start your lesson today!" },
    { day: 7, quote: "Kuishi kwingi kuona mengi", translation: "To live long is to see much", meaning: "Keep your streak going!" },
  ];

  // Get today's bubble based on streak (cycling through 7 days, default to first if streak is 0)
  const todaysBubble = wisdomBubbles[streak > 0 ? (streak - 1) % 7 : 0];

  // Typing animation effect
  useEffect(() => {
    const fullText = "Ready to continue your Swahili journey?";
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* ===== HERO SECTION ===== */}
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

        {/* ===== MAIN CONTENT - Compact balanced layout ===== */}
        <div className="space-y-4 lg:space-y-6 mb-20 lg:mb-8">

          {/* Row 1: Goal Progress + Level Progress */}
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

          {/* Row 2: Learning Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="font-hand text-xl">⚡ Endelea Kujifunza</h2>
                <DoodleArrow direction="right" className="text-accent/50" />
              </div>
              <Link href="/lessons" className="font-hand-secondary text-xs text-accent hover:underline flex items-center gap-1">
                See all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Lesson Card */}
              <Link href="/lessons" className="group">
                <SketchCard hover className="h-full bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="text-accent" size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-hand text-lg">Somo la Leo</h3>
                      <p className="font-hand-secondary text-xs text-muted-foreground">Colors (Rangi)</p>
                    </div>
                    <span className="px-2 py-1 bg-accent/10 rounded-full text-xs font-hand-secondary text-accent">+50 XP</span>
                  </div>
                </SketchCard>
              </Link>

              {/* Conversation Card */}
              <Link href="/conversation" className="group">
                <SketchCard hover className="h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="text-success" size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-hand text-lg">Sema na AI</h3>
                      <p className="font-hand-secondary text-xs text-muted-foreground">Practice speaking</p>
                    </div>
                    <span className="px-2 py-1 bg-warning/10 rounded-full text-xs font-hand-secondary text-warning">+30 XP</span>
                  </div>
                </SketchCard>
              </Link>

              {/* Garden Card */}
              <Link href="/vocabulary" className="group">
                <SketchCard hover className="h-full bg-gradient-to-br from-success/5 to-transparent border-success/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Flower2 className="text-success" size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-hand text-lg">Bustani</h3>
                      <p className="font-hand-secondary text-xs text-muted-foreground">5 words need 🌱</p>
                    </div>
                    <span className="px-2 py-1 bg-warning/10 rounded-full text-xs font-hand-secondary text-warning">+10 XP</span>
                  </div>
                </SketchCard>
              </Link>
            </div>
          </div>

          {/* Row 3: Makala ya Leo */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-hand text-xl">📰 Makala ya Leo</h2>
              <span className="font-hand-secondary text-xs text-muted-foreground">— Today&apos;s Article</span>
            </div>
            <DailyArticleFeature />
          </div>

          {/* Row 4: Word of Day + Wisdom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Word of the Day */}
            <SketchCard className="bg-gradient-to-br from-warning/5 to-transparent border-warning/20" doodle>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-hand text-lg flex items-center gap-2">
                  ✨ Neno la Leo
                </h3>
                <span className="font-hand-secondary text-xs text-muted-foreground">Word of Day</span>
              </div>

              <div className="text-center py-3">
                <p className="font-hand text-3xl text-foreground mb-1">{wordOfDay.swahili}</p>
                <div className="inline-block">
                  <p className="font-hand-secondary text-lg text-accent">{wordOfDay.english}</p>
                  <SquigglyUnderline className="text-accent/40 -mt-1" />
                </div>

                <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mt-3 mb-3">
                  <Volume2 size={14} />
                  <span className="font-hand-secondary">{wordOfDay.pronunciation}</span>
                </button>

                <div className="bg-card/50 rounded-lg p-2 border border-border/20">
                  <p className="font-hand-secondary text-xs italic">&quot;{wordOfDay.example}&quot;</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-1 text-accent font-hand-secondary text-sm py-2 hover:bg-accent/5 rounded-lg transition-colors">
                <Heart size={14} /> Save to vocabulary
              </button>
            </SketchCard>

            {/* Daily Wisdom */}
            <SketchCard className="bg-gradient-to-br from-accent/5 via-success/5 to-warning/5 border-accent/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent/10 animate-float" />
              <div className="absolute bottom-6 right-8 w-4 h-4 rounded-full bg-success/10 animate-float" style={{ animationDelay: '0.5s' }} />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-warning/20 flex items-center justify-center">
                    <span className="text-sm">💬</span>
                  </div>
                  <div>
                    <h3 className="font-hand text-lg">Hekima ya Leo</h3>
                    <p className="font-hand-secondary text-xs text-muted-foreground">Day {userData.streak} Wisdom</p>
                  </div>
                </div>

                <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border/20 mb-2">
                  <p className="font-hand text-lg text-center mb-1">&quot;{todaysBubble.quote}&quot;</p>
                  <p className="font-hand-secondary text-sm text-accent text-center italic">
                    {todaysBubble.translation}
                  </p>
                </div>

                <div className="flex items-center gap-2 p-2 bg-success/5 rounded-lg border border-success/20">
                  <span className="text-sm">💡</span>
                  <p className="font-hand-secondary text-xs text-muted-foreground">
                    {todaysBubble.meaning}
                  </p>
                </div>
              </div>
            </SketchCard>
          </div>

          {/* Row 4: Word Garden Preview */}
          <SketchCard className="bg-gradient-to-br from-success/5 to-warning/5 border-success/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-hand text-lg flex items-center gap-2">
                🌱 Bustani ya Maneno
              </h3>
              <Link href="/vocabulary" className="font-hand-secondary text-xs text-accent hover:underline">
                View garden →
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-hand-secondary text-sm text-muted-foreground">
                Your garden is growing beautifully!
              </p>

              {/* Compact growth stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="font-hand text-sm">23</span>
                </div>
                <div className="flex items-center gap-1">
                  <Leaf size={14} className="text-success/60" />
                  <span className="font-hand text-sm">45</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flower2 size={14} className="text-accent" />
                  <span className="font-hand text-sm">32</span>
                </div>
                <div className="flex items-center gap-1">
                  <TreeDeciduous size={14} className="text-warning" />
                  <span className="font-hand text-sm text-warning">18</span>
                </div>
              </div>
            </div>
          </SketchCard>
        </div>


        {/* Mobile CTA */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-40">
          <Link href="/lessons" className="block">
            <SketchButton variant="accent" size="lg" className="w-full shadow-lg">
              <Play size={18} />
              Continue Learning
            </SketchButton>
          </Link>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
