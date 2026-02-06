'use client';

import Link from "next/link";
import { ChevronRight, BookOpen, MessageCircle, Flower2 } from "lucide-react";
import { SketchCard } from "@/components/shared/SketchCard";
import { DoodleArrow } from "@/components/shared/Doodle";

export function LearningShortcuts() {
  return (
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
  );
}
