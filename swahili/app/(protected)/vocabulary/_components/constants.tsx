import type { ReactNode } from "react";
import { Droplets, Leaf, Flower2, TreeDeciduous } from "lucide-react";
import type { GrowthStage } from "@/lib/agents/teaching-shared";

export const growthStages: Record<
  GrowthStage,
  { icon: ReactNode; label: string; color: string; bgColor: string; xpBonus: number }
> = {
  seed: { icon: <Droplets size={14} />, label: "Seed", color: "text-muted-foreground", bgColor: "bg-muted/30 border-muted/50", xpBonus: 5 },
  sprout: { icon: <Leaf size={14} />, label: "Sprout", color: "text-success/70", bgColor: "bg-success/10 border-success/30", xpBonus: 10 },
  sapling: { icon: <Leaf size={14} />, label: "Sapling", color: "text-success", bgColor: "bg-success/20 border-success/40", xpBonus: 15 },
  flower: { icon: <Flower2 size={14} />, label: "Blooming", color: "text-accent", bgColor: "bg-accent/20 border-accent/40", xpBonus: 20 },
  tree: { icon: <TreeDeciduous size={14} />, label: "Mastered", color: "text-warning", bgColor: "bg-warning/20 border-warning/40", xpBonus: 25 },
};

export const stageOptions: Array<{ value: GrowthStage; label: string }> = [
  { value: "seed", label: "Seed" },
  { value: "sprout", label: "Sprout" },
  { value: "sapling", label: "Sapling" },
  { value: "flower", label: "Blooming" },
  { value: "tree", label: "Mastered" },
];
