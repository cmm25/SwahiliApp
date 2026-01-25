'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  MessageCircle, 
  Library, 
  User, 
  Trophy,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { StreakBadge } from "@/components/shared/StreakBadge";
import { XPBadge } from "@/components/shared/XPBadge";
import { LionMascot } from "@/components/shared/HandDrawnIcons";
import { PaperTexture, GridLines } from "@/components/shared/DecorativeElements";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Nyumbani", labelEn: "Home", emoji: "🏠" },
  { path: "/lessons", icon: BookOpen, label: "Jifunze", labelEn: "Learn", emoji: "📚" },
  { path: "/conversation", icon: MessageCircle, label: "Sema", labelEn: "Speak", emoji: "💬" },
  { path: "/vocabulary", icon: Library, label: "Maneno", labelEn: "Words", emoji: "📝" },
  { path: "/leaderboard", icon: Trophy, label: "Ushindani", labelEn: "Compete", emoji: "🏆" },
  { path: "/profile", icon: User, label: "Wasifu", labelEn: "Profile", emoji: "👤" },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data - will come from backend later
  const userStats = {
    streak: 7,
    xp: 1250,
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background textures */}
      <PaperTexture />
      <GridLines className="opacity-[0.02]" />
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-foreground">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo with mascot */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <LionMascot size={36} className="transition-transform group-hover:scale-110" />
              <Sparkles 
                size={12} 
                className="absolute -top-1 -right-1 text-warning opacity-0 group-hover:opacity-100 transition-opacity" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-hand text-2xl md:text-3xl text-accent leading-none">Jifunze</span>
              <span className="font-hand-secondary text-[10px] text-muted-foreground hidden sm:block">Learn Swahili</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 font-hand-secondary text-base transition-all relative group",
                    isActive 
                      ? "text-accent" 
                      : "text-foreground hover:text-accent"
                  )}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.label}</span>
                  
                  {/* Active indicator - hand-drawn underline */}
                  {isActive && (
                    <svg 
                      className="absolute -bottom-1 left-2 right-2 h-2 text-accent"
                      viewBox="0 0 100 8"
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0 4 Q25 1, 50 4 T100 4" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  
                  {/* Hover indicator */}
                  {!isActive && (
                    <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-accent transition-all group-hover:w-1/2 group-hover:left-1/4" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Stats & Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card sketch-border">
              <StreakBadge streak={userStats.streak} size="sm" showLabel={false} />
              <div className="w-px h-5 bg-border" />
              <XPBadge xp={userStats.xp} size="sm" showLabel={false} />
            </div>
            
            <button 
              className="lg:hidden p-2 sketch-border bg-card hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-background border-b-2 border-foreground animate-fade-in-up">
            <div className="container mx-auto py-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 font-hand-secondary transition-all animate-fade-in-up",
                      isActive 
                        ? "text-accent bg-accent/10 sketch-border-accent mx-2 my-1" 
                        : "text-foreground hover:text-accent hover:bg-accent/5"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-lg">{item.label}</span>
                    <span className="text-muted-foreground text-sm">({item.labelEn})</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t-2 border-foreground py-6 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LionMascot size={24} />
            <span className="font-hand text-lg text-accent">Jifunze</span>
            <span className="font-hand-secondary text-sm text-muted-foreground">— Learn Swahili with joy</span>
          </div>
          <p className="font-hand-secondary text-sm text-muted-foreground">
            Made with ❤️ for language learners
          </p>
        </div>
      </footer>
    </div>
  );
}
