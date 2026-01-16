'use client';

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    MessageCircle,
    Library,
    User,
    Menu,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SketchButton } from "@/components/shared/SketchButton";
import { LionMascot } from "@/components/shared/HandDrawnIcons";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PaperTexture, GridLines } from "@/components/shared/DecorativeElements";

interface AppLayoutProps {
    children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const { toast } = useToast();

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/lessons", label: "Lessons", icon: BookOpen },
        { href: "/conversation", label: "Conversation", icon: MessageCircle },
        { href: "/vocabulary", label: "Vocabulary", icon: Library },
        { href: "/profile", label: "Profile", icon: User },
    ];

    const handleLogout = async () => {
        await signOut();
        toast({
            title: "Kwaheri!",
            description: "You have been logged out.",
        });
    };

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-2 mb-8">
                <LionMascot size={40} />
                <span className="font-hand text-2xl text-accent">Swahili AI</span>
            </div>

            <nav className="space-y-2 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-hand-secondary text-lg",
                                isActive
                                    ? "bg-accent/10 text-accent font-bold sketch-border border-accent/20"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-border/20">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-hand-secondary text-lg"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex w-full relative">
            {/* Subtle background textures */}
            <PaperTexture />
            <GridLines />

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 p-6 border-r border-border/20 fixed inset-y-0 bg-background/50 backdrop-blur-sm z-30">
                <NavContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden p-4 flex items-center justify-between border-b border-border/20 sticky top-0 bg-background/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-2">
                        <LionMascot size={32} />
                        <span className="font-hand text-xl text-accent">Swahili AI</span>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <SketchButton variant="ghost" size="sm">
                                <Menu size={24} />
                            </SketchButton>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-6">
                            <NavContent />
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 p-4 md:p-8 animate-fade-in-up">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
