import { cn } from "@/lib/utils";
import { SketchCard } from "@/components/shared/SketchCard";
import type { GrowthStage } from "@/lib/agents/teaching-shared";

interface FiltersSectionProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  selectedCategory: string;
  selectedStage: GrowthStage | "all";
  showFavorites: boolean;
  showLearningOnly: boolean;
  showDueOnly: boolean;
  searchQuery: string;
  wordsCount: number;
  userWordsCount: number;
  dueCount: number;
  filteredCount: number;
  baseCount: number;
  stageOptions: Array<{ value: GrowthStage; label: string }>;
  onCategoryChange: (value: string) => void;
  onStageChange: (value: GrowthStage | "all") => void;
  onSearchChange: (value: string) => void;
  onToggleFavorites: () => void;
  onShowAllWords: () => void;
  onShowLearningOnly: () => void;
  onToggleDueOnly: () => void;
  onReset: () => void;
}

export function FiltersSection({
  categories,
  categoryCounts,
  selectedCategory,
  selectedStage,
  showFavorites,
  showLearningOnly,
  showDueOnly,
  wordsCount,
  userWordsCount,
  dueCount,
  filteredCount,
  baseCount,
  stageOptions,
  searchQuery,
  onCategoryChange,
  onStageChange,
  onSearchChange,
  onToggleFavorites,
  onShowAllWords,
  onShowLearningOnly,
  onToggleDueOnly,
  onReset,
}: FiltersSectionProps) {
  return (
    <section className="mb-6">
      <SketchCard className="border-border/40">
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="w-full">
            <input
              type="text"
              placeholder="Search words in Swahili or English..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-card px-4 py-2 font-hand-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="min-w-[200px]">
              <label className="font-hand-secondary text-xs text-muted-foreground">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border/40 bg-card px-3 py-2 font-hand-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="all">All categories ({wordsCount})</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category} ({categoryCounts[category] ?? 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[180px]">
              <label className="font-hand-secondary text-xs text-muted-foreground">Stage</label>
              <select
                value={selectedStage}
                onChange={(e) => onStageChange(e.target.value as GrowthStage | "all")}
                className="mt-1 w-full rounded-xl border border-border/40 bg-card px-3 py-2 font-hand-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="all">All stages</option>
                {stageOptions.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onShowAllWords}
              className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-hand-secondary transition-all",
                !showLearningOnly
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card border-border/40 hover:border-accent/50 hover:bg-accent/5"
              )}
            >
              All Words
            </button>
            <button
              onClick={onShowLearningOnly}
              className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-hand-secondary transition-all",
                showLearningOnly
                  ? "bg-success/20 text-success border-success/30"
                  : "bg-card border-border/40 hover:border-success/40 hover:bg-success/5"
              )}
            >
              My Garden ({userWordsCount})
            </button>
            <button
              onClick={onToggleFavorites}
              className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-hand-secondary transition-all",
                showFavorites
                  ? "bg-destructive/15 text-destructive border-destructive/30"
                  : "bg-card border-border/40 hover:border-destructive/40 hover:bg-destructive/5"
              )}
            >
              Favorites
            </button>
            <button
              onClick={onToggleDueOnly}
              className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-hand-secondary transition-all",
                showDueOnly
                  ? "bg-warning/20 text-warning border-warning/30"
                  : "bg-card border-border/40 hover:border-warning/40 hover:bg-warning/5"
              )}
            >
              Due Now ({dueCount})
            </button>

            <button
              onClick={onReset}
              className="ml-auto px-3 py-1.5 rounded-full border border-border/40 text-xs font-hand-secondary text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all"
            >
              Reset Filters
            </button>
          </div>

          <div className="font-hand-secondary text-xs text-muted-foreground">
            Showing {filteredCount} of {baseCount} words
          </div>
        </div>
      </SketchCard>
    </section>
  );
}
