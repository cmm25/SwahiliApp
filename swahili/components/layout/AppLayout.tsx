'use client';

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageCircle, 
  Library, 
  User, 
  Menu, 
  X,
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SketchButton } from "@/components/shared/SketchButton";
import { LionMascot, SketchFlame, SketchStar } from "@/components/shared/HandDrawnIcons";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useStreak } from "@/hooks/useStreak";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PaperTexture, GridLines } from "@/components/shared/DecorativeElements";
import { PrefetchLink } from "@/components/shared/PrefetchLink";
import { useState } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Nyumbani", icon: LayoutDashboard, english: "Dashboard", emoji: "🏠" },
  { href: "/lessons", label: "Masomo", icon: BookOpen, english: "Lessons", emoji: "📚" },
  { href: "/conversation", label: "Mazungumzo", icon: MessageCircle, english: "Conversation", emoji: "💬" },
  { href: "/vocabulary", label: "Bustani", icon: Library, english: "Word Garden", emoji: "🌱" },
  { href: "/profile", label: "Wasifu", icon: User, english: "Profile", emoji: "👤" },
];

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { signOut, user, isLoading } = useAuth();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { streak, xp, logActivity } = useStreak();

  // Log activity when user visits the app
  useEffect(() => {
    if (!isLoading && user?.id) {
      logActivity();
    }
  }, [isLoading, logActivity, user?.id]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Kwaheri!",
      description: "You have been logged out.",
    });
  };

  const NavContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border/20">
        <Link href="/" className="flex items-center gap-3 group">
          <LionMascot size={48} className="group-hover:animate-wiggle transition-transform" />
          <div>
            <h1 className="font-hand text-2xl text-foreground leading-none">Jifunze</h1>
            <p className="font-hand-secondary text-xs text-muted-foreground">Kiswahili</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <PrefetchLink
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group",
                "hover:bg-secondary/50",
                isActive && "bg-accent/10 border-l-2 border-accent"
              )}
            >
              <span className="text-lg">{item.emoji}</span>
              <div className="flex-1">
                <p className={cn(
                  "font-hand text-lg leading-none",
                  isActive ? "text-accent" : "text-foreground"
                )}>
                  {item.label}
                </p>
                <p className="font-hand-secondary text-xs text-muted-foreground">{item.english}</p>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </PrefetchLink>
          );
        })}
      </nav>

      {/* User Stats - always visible at bottom */}
      <div className="p-4 border-t border-border/30 flex-shrink-0">
        <div className="flex items-center justify-around p-3 bg-secondary/30 rounded-sm">
          {streak > 0 && (
            <>
              <div className="flex items-center gap-2">
                <SketchFlame size={20} className="text-destructive animate-fire-flicker" />
                <span className="font-hand text-lg">{streak}</span>
              </div>
              <div className="w-px h-6 bg-border/50" />
            </>
          )}
          <div className="flex items-center gap-2">
            <SketchStar size={20} filled className="text-warning" />
            <span className="font-hand text-lg">{xp.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sign Out - always visible at bottom */}
      <div className="p-4 border-t border-border/30 flex-shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <LogOut size={18} />
          <span className="font-hand-secondary">Toka (Sign out)</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex w-full relative">
      {/* Subtle background textures */}
      <PaperTexture />
      <GridLines />

      {/* Mobile Header Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/30 safe-area-inset">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-foreground" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <LionMascot size={32} />
            <span className="font-hand text-xl text-foreground">Jifunze</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1">
                <SketchFlame size={16} className="text-destructive" />
                <span className="font-hand text-sm">{streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <SketchStar size={16} filled className="text-warning" />
              <span className="font-hand text-sm">{xp.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 w-[280px] max-w-[80vw] bg-card z-[70]",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/30 bg-secondary/20">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <LionMascot size={36} />
            <div>
              <h1 className="font-hand text-lg text-foreground leading-none">Jifunze</h1>
              <p className="font-hand-secondary text-xs text-muted-foreground">Kiswahili</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            aria-label="Close menu"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        
        {/* Mobile Nav Content reuse logic slightly adapted */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <PrefetchLink
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200",
                  "active:scale-[0.98]",
                  isActive 
                    ? "bg-accent/10 border-l-2 border-accent" 
                    : "hover:bg-secondary/50"
                )}
              >
                <span className="text-lg">{item.emoji}</span>
                <div className="flex-1">
                  <p className={cn(
                    "font-hand text-base leading-none",
                    isActive ? "text-accent" : "text-foreground"
                  )}>
                    {item.label}
                  </p>
                  <p className="font-hand-secondary text-xs text-muted-foreground">{item.english}</p>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </PrefetchLink>
            );
          })}
        </nav>

        <div className="border-t border-border/30 bg-secondary/10">
          <div className="p-3">
            <div className="flex items-center justify-center gap-6 py-2 bg-secondary/30 rounded-lg">
              {streak > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <SketchFlame size={18} className="text-destructive" />
                    <div>
                      <span className="font-hand text-base block leading-none">{streak}</span>
                      <span className="font-hand-secondary text-[10px] text-muted-foreground">streak</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-border/50" />
                </>
              )}
              <div className="flex items-center gap-2">
                <SketchStar size={18} filled className="text-warning" />
                <div>
                  <span className="font-hand text-base block leading-none">{xp.toLocaleString()}</span>
                  <span className="font-hand-secondary text-[10px] text-muted-foreground">XP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 pb-3">
            <button 
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all w-full"
            >
              <LogOut size={16} />
              <span className="font-hand-secondary text-sm">Toka (Sign out)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-card border-r border-border/30 fixed top-0 left-0 overflow-hidden z-30">
        <NavContent />
      </aside>

      {/* Main Content - Offset for fixed sidebar, with mobile header padding */}
      <main className="flex-1 min-h-screen lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-12 lg:pl-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
