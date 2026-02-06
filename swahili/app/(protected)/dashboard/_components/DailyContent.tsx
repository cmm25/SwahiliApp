'use client';

import { Volume2, Heart } from "lucide-react";
import { SketchCard } from "@/components/shared/SketchCard";
import { SquigglyUnderline } from "@/components/shared/Doodle";
import { DailyArticleFeature } from "@/components/article";

interface DailyContentProps {
  wordOfDay: {
    swahili: string;
    english: string;
    pronunciation: string;
    example: string;
    category: string;
  };
  todaysBubble: {
    day: number;
    quote: string;
    translation: string;
    meaning: string;
  };
  streak: number;
}

export function DailyContent({ wordOfDay, todaysBubble, streak }: DailyContentProps) {
  return (
    <>
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
                <p className="font-hand-secondary text-xs text-muted-foreground">Day {streak} Wisdom</p>
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
    </>
  );
}
