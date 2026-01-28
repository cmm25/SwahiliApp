export interface VocabularyWord {
  id: string;
  swahili: string;
  english: string;
  category?: string | null;
  mastery_level: number;
  stage: string;
  is_favorite: boolean;
  last_practiced: string | null;
  times_practiced: number;
  created_at: string;
}

export interface TeachingRequest {
  userId: string;
  action: 'introduce' | 'review' | 'practice' | 'get_due_words' | 'update_progress';
  wordId?: string;
  words?: VocabularyWord[];
  performance?: 'perfect' | 'good' | 'struggled' | 'forgot';
  context?: string;
  sessionId?: string;
}

export interface TeachingResponse {
  success: boolean;
  action: string;
  content?: string;
  words?: VocabularyWord[];
  nextStage?: string;
  xpEarned?: number;
  nextReviewDate?: string;
  error?: string;
}

export const STAGE_INTERVALS: Record<string, number> = {
  seed: 1,
  sprout: 3,
  sapling: 7,
  flower: 14,
  tree: 30,
};

export const STAGE_PROGRESSION: string[] = ['seed', 'sprout', 'sapling', 'flower', 'tree'];

export function masteryLevelToStage(masteryLevel: number): string {
  if (masteryLevel >= 4) return 'tree';
  if (masteryLevel === 3) return 'flower';
  if (masteryLevel === 2) return 'sapling';
  if (masteryLevel === 1) return 'sprout';
  return 'seed';
}

export function stageToMasteryLevel(stage: string): number {
  const index = STAGE_PROGRESSION.indexOf(stage);
  if (index === -1) return 0;
  return stage === 'tree' ? 5 : Math.min(index, 4);
}

export function calculateNextStage(
  currentStage: string,
  performance: 'perfect' | 'good' | 'struggled' | 'forgot'
): { nextStage: string; xpEarned: number } {
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

export function calculateNextReviewDate(stage: string): Date {
  const intervalDays = STAGE_INTERVALS[stage] || 1;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate;
}

export function filterDueWords(words: VocabularyWord[]): VocabularyWord[] {
  const now = new Date();

  return words.filter(word => {
    if (!word.last_practiced) return true; // Never practiced = due

    const lastPracticed = new Date(word.last_practiced);
    const intervalDays = STAGE_INTERVALS[word.stage] || 1;
    const dueDate = new Date(lastPracticed);
    dueDate.setDate(dueDate.getDate() + intervalDays);

    return now >= dueDate;
  });
}
