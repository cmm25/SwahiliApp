export type GrowthStage = 'seed' | 'sprout' | 'sapling' | 'flower' | 'tree';

// Master word (shared dictionary)
export interface VocabularyWord {
  id: string;
  swahili: string;
  english: string;
  stage: string | null;
  category: string | null;
  created_at: string | null;
}

// User-specific progress (SRS tracking)
export interface UserVocabulary {
  id: string;
  user_id: string;
  word_id: string;
  growth_stage: GrowthStage;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  correct_count: number;
  incorrect_count: number;
  is_favorite: boolean | null;
  created_at?: string;
  updated_at?: string;
}

// Combined view for UI
export interface UserWord {
  // From vocabulary_words
  id: string;
  swahili: string;
  english: string;
  category: string | null;
  stage: string | null;
  created_at: string | null;
  // From user_vocabulary
  userVocabId: string | null;
  growth_stage: GrowthStage;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string | null;
  last_reviewed_at: string | null;
  correct_count: number;
  incorrect_count: number;
  is_favorite: boolean;
}

export interface TeachingRequest {
  userId: string;
  action: 'introduce' | 'review' | 'practice' | 'get_due_words' | 'update_progress';
  wordId?: string;
  words?: UserWord[];
  performance?: 'perfect' | 'good' | 'struggled' | 'forgot';
  context?: string;
  sessionId?: string;
}

export interface TeachingResponse {
  success: boolean;
  action: string;
  content?: string;
  words?: UserWord[];
  nextStage?: GrowthStage;
  xpEarned?: number;
  nextReviewDate?: string;
  error?: string;
}

export const STAGE_INTERVALS: Record<GrowthStage, number> = {
  seed: 1,
  sprout: 3,
  sapling: 7,
  flower: 14,
  tree: 30,
};

export const STAGE_PROGRESSION: GrowthStage[] = ['seed', 'sprout', 'sapling', 'flower', 'tree'];

export function normalizeGrowthStage(stage?: string | null): GrowthStage {
  switch (stage) {
    case 'sprout':
      return 'sprout';
    case 'sapling':
      return 'sapling';
    case 'flower':
      return 'flower';
    case 'tree':
      return 'tree';
    case 'growing':
      return 'sapling';
    case 'blooming':
      return 'flower';
    case 'flourishing':
      return 'tree';
    case 'seed':
    default:
      return 'seed';
  }
}

export function masteryLevelToStage(masteryLevel: number): GrowthStage {
  if (masteryLevel >= 4) return 'tree';
  if (masteryLevel === 3) return 'flower';
  if (masteryLevel === 2) return 'sapling';
  if (masteryLevel === 1) return 'sprout';
  return 'seed';
}

export function stageToMasteryLevel(stage: GrowthStage): number {
  const index = STAGE_PROGRESSION.indexOf(stage);
  if (index === -1) return 0;
  return stage === 'tree' ? 5 : Math.min(index, 4);
}

export function calculateNextStage(
  currentStage: GrowthStage,
  performance: 'perfect' | 'good' | 'struggled' | 'forgot'
): { nextStage: GrowthStage; xpEarned: number } {
  const currentIndex = STAGE_PROGRESSION.indexOf(currentStage);

  let nextIndex = currentIndex;
  let xpEarned = 0;

  switch (performance) {
    case 'perfect':
      // Advance one stage, max at tree
      nextIndex = Math.min(currentIndex + 1, STAGE_PROGRESSION.length - 1);
      xpEarned = 15 + (nextIndex * 5); // More XP for higher stages
      break;
    case 'good':
      // Stay at current stage but still earn XP
      xpEarned = 10 + (currentIndex * 3);
      break;
    case 'struggled':
      // Drop back one stage, minimum seed
      nextIndex = Math.max(currentIndex - 1, 0);
      xpEarned = 5; // Small XP for trying
      break;
    case 'forgot':
      // Reset to seed
      nextIndex = 0;
      xpEarned = 2; // Minimal XP for attempt
      break;
  }

  return {
    nextStage: STAGE_PROGRESSION[nextIndex],
    xpEarned,
  };
}

export function calculateNextReviewDate(stage: GrowthStage): Date {
  const intervalDays = STAGE_INTERVALS[stage] || 1;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate;
}

export function calculateSM2(
  currentEase: number,
  currentInterval: number,
  currentReps: number,
  quality: number
): { easeFactor: number; interval: number; repetitions: number } {
  const nextReps = quality < 3 ? 0 : currentReps + 1;

  let interval = 1;
  if (nextReps === 1) {
    interval = 1;
  } else if (nextReps === 2) {
    interval = 6;
  } else {
    interval = Math.max(1, Math.round(currentInterval * currentEase));
  }

  const easeFactor =
    currentEase +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  return {
    easeFactor: Math.max(1.3, Number(easeFactor.toFixed(2))),
    interval,
    repetitions: nextReps,
  };
}

export function performanceToQuality(
  performance: 'perfect' | 'good' | 'struggled' | 'forgot'
): number {
  switch (performance) {
    case 'perfect':
      return 5;
    case 'good':
      return 4;
    case 'struggled':
      return 2;
    case 'forgot':
    default:
      return 0;
  }
}

export function filterDueWords(words: UserWord[]): UserWord[] {
  const now = new Date();

  return words.filter(word => {
    if (!word.next_review_at) return true;
    const dueDate = new Date(word.next_review_at);
    if (Number.isNaN(dueDate.getTime())) return true;
    return now >= dueDate;
  });
}
