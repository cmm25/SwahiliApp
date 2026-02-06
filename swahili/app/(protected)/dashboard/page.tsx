'use client';

import Link from "next/link";
import { Play } from "lucide-react";
import { SketchButton } from "@/components/shared/SketchButton";
import { BadgeType } from "@/components/shared/AchievementBadge";
import { useState, useEffect } from "react";
import { useStreak } from "@/hooks/useStreak";

import { DashboardHero } from "./_components/DashboardHero";
import { DailyGoals } from "./_components/DailyGoals";
import { LearningShortcuts } from "./_components/LearningShortcuts";
import { DailyContent } from "./_components/DailyContent";
import { GardenPreview } from "./_components/GardenPreview";

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

  // Calculate level from XP (500 XP per level)
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
    <>
      <DashboardHero 
        greeting={greeting} 
        userData={userData} 
        typedText={typedText} 
        showCursor={showCursor} 
      />

      {/* ===== MAIN CONTENT - Compact balanced layout ===== */}
      <div className="space-y-4 lg:space-y-6 mb-20 lg:mb-8">
        <DailyGoals userData={userData} />
        <LearningShortcuts />
        <DailyContent 
          wordOfDay={wordOfDay} 
          todaysBubble={todaysBubble} 
          streak={streak} 
        />
        <GardenPreview />
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
    </>
  );
}
