import { GardenStats } from "@/components/vocabulary/GardenStats";

interface GardenStatsSectionProps {
  totalWords: number;
  totalVocabulary: number;
  masteredWords: number;
  streakDays: number;
  todayXP: number;
  waterProgress: number;
}

export function GardenStatsSection({
  totalWords,
  totalVocabulary,
  masteredWords,
  streakDays,
  todayXP,
  waterProgress,
}: GardenStatsSectionProps) {
  return (
    <section className="mb-6">
      <GardenStats
        totalWords={totalWords}
        totalVocabulary={totalVocabulary}
        masteredWords={masteredWords}
        streakDays={streakDays}
        todayXP={todayXP}
        waterProgress={waterProgress}
      />
    </section>
  );
}
