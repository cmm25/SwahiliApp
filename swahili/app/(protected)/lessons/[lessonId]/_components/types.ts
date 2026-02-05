export type LessonMeta = {
  title: string;
  description: string;
  emoji: string;
  categories: string[];
  xp: number;
  totalWords: number;
};

export type LessonStep = {
  id: number;
  type: "intro" | "vocab" | "practice" | "quiz";
  title: string;
  content: {
    swahili: string;
    english: string;
    pronunciation?: string;
    example?: { swahili: string; english: string };
    tip?: string;
  };
};

export type VocabularyWordRow = {
  id: string;
  swahili: string;
  english: string;
  category: string | null;
  created_at: string | null;
};

export type FloatingParticleSpec = {
  delay: number;
  size: number;
  color: string;
  left: number;
  top: number;
  duration: number;
};

export type ConfettiSpec = {
  left: number;
  delay: number;
  duration: number;
  color: string;
};

export type VocabularySupabase = {
  public: {
    Tables: {
      vocabulary_words: {
        Row: VocabularyWordRow;
      };
    };
  };
};
