import { Zap } from "lucide-react";
import { WordCard } from "@/components/vocabulary/WordCard";
import type { GrowthStage, UserWord } from "@/lib/agents/teaching-shared";

interface StageInfo {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  xpBonus: number;
}

interface WordsGridProps {
  words: UserWord[];
  growthStages: Record<GrowthStage, StageInfo>;
  onToggleFavorite: (word: UserWord) => void;
  onPlayAudio: (text: string) => void;
  onAdd?: (word: UserWord) => void;
}

export function WordsGrid({ words, growthStages, onToggleFavorite, onPlayAudio, onAdd }: WordsGridProps) {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {words.map((word, index) => (
        <WordCard
          key={word.id}
          word={word}
          stageInfo={growthStages[word.growth_stage as GrowthStage] ?? growthStages.seed}
          onToggleFavorite={onToggleFavorite}
          onPlayAudio={onPlayAudio}
          onAdd={onAdd}
          index={index}
        />
      ))}

      <div className="border-2 border-dashed border-border/50 bg-muted/10 rounded-2xl flex items-center justify-center min-h-[280px] group cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all">
            <Zap className="text-accent" size={28} />
          </div>
          <p className="font-hand text-xl mb-1">Plant New Word</p>
          <p className="font-hand-secondary text-sm text-muted-foreground">Complete lessons to grow your garden</p>
        </div>
      </div>
    </section>
  );
}
