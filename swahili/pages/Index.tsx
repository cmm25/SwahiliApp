'use client';

import Link from "next/link";
import { LionMascot, SketchFlame, SketchStar, SketchTrophy } from "@/components/shared/HandDrawnIcons";
import { SketchButton } from "@/components/shared/SketchButton";
import { SketchCard } from "@/components/shared/SketchCard";
import { FloatingShapes, PaperTexture } from "@/components/shared/DecorativeElements";
import { BookOpen, MessageCircle, Library, Trophy, User, ArrowRight } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Masomo", subtitle: "Interactive Lessons", path: "/lessons", emoji: "📚" },
  { icon: MessageCircle, title: "Sema na AI", subtitle: "AI Conversations", path: "/conversation", emoji: "🗣️" },
  { icon: Library, title: "Maneno", subtitle: "Vocabulary Cards", path: "/vocabulary", emoji: "🔤" },
  { icon: Trophy, title: "Ushindani", subtitle: "Leaderboard", path: "/leaderboard", emoji: "🏆" },
  { icon: User, title: "Wasifu", subtitle: "Your Profile", path: "/profile", emoji: "👤" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <PaperTexture />
      <FloatingShapes />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo & Mascot */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <LionMascot size={120} className="animate-float" />
              <SketchFlame size={32} className="absolute -top-2 -right-2 animate-fire-flicker" />
            </div>
          </div>

          <h1 className="font-hand text-6xl md:text-7xl text-accent mb-4 animate-fade-in-scale">
            Jifunze
          </h1>
          <p className="font-hand text-2xl md:text-3xl text-foreground mb-2 animate-fade-in-up">
            Karibu! — Welcome!
          </p>
          <p className="font-hand-secondary text-lg text-muted-foreground mb-8 animate-fade-in-up stagger-1">
            Learn Swahili with AI-powered lessons, conversations, and games
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up stagger-2">
            <Link href="/dashboard">
              <SketchButton variant="accent" size="lg" className="w-full sm:w-auto">
                Anza Sasa — Start Now <ArrowRight size={20} />
              </SketchButton>
            </Link>
            <Link href="/auth">
              <SketchButton variant="outline" size="lg" className="w-full sm:w-auto">
                Ingia — Sign In
              </SketchButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="font-hand text-3xl text-center mb-8">
          Explore the App
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <Link key={feature.path} href={feature.path}>
              <SketchCard
                hover
                className="h-full animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{feature.emoji}</span>
                  <div>
                    <h3 className="font-hand text-xl">{feature.title}</h3>
                    <p className="font-hand-secondary text-sm text-muted-foreground">{feature.subtitle}</p>
                  </div>
                </div>
              </SketchCard>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Preview */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex justify-center gap-8 flex-wrap">
          <div className="text-center">
            <SketchFlame size={40} className="mx-auto mb-2" />
            <p className="font-hand text-2xl">7</p>
            <p className="font-hand-secondary text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <SketchStar size={40} filled className="mx-auto mb-2" />
            <p className="font-hand text-2xl">1,250</p>
            <p className="font-hand-secondary text-sm text-muted-foreground">Total XP</p>
          </div>
          <div className="text-center">
            <SketchTrophy size={40} className="mx-auto mb-2" />
            <p className="font-hand text-2xl">#4</p>
            <p className="font-hand-secondary text-sm text-muted-foreground">Rank</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-6 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LionMascot size={24} />
            <span className="font-hand text-lg text-accent">Jifunze</span>
          </div>
          <p className="font-hand-secondary text-sm text-muted-foreground">
            Made with ❤️ for language learners
          </p>
        </div>
      </footer>
    </div>
  );
}
