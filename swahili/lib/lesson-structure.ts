export type LessonUnit = {
  id: number;
  level: "beginner" | "intermediate";
  title: string;
  description: string;
  emoji: string;
  categories: string[];
  xp: number;
  completed?: boolean;
  current?: boolean;
  locked?: boolean;
  progress?: number;
};

export type LessonLevel = {
  id: string;
  title: string;
  subtitle: string;
  color: "accent" | "warning";
  requiredXp?: number;
  units: LessonUnit[];
};

export const lessonLevels: LessonLevel[] = [
  {
    id: "mwanzo",
    title: "Mwanzo",
    subtitle: "Beginner",
    color: "accent",
    units: [
      {
        id: 1,
        level: "beginner",
        title: "Karibu Basics",
        description: "Greetings, basics, phrases, pronouns, and questions to start conversations.",
        emoji: "👋",
        categories: ["greetings", "basics", "phrases", "pronouns", "questions"],
        xp: 60,
        current: true,
        progress: 0,
      },
      {
        id: 2,
        level: "beginner",
        title: "Numbers & Time",
        description: "Numbers, time, and colors for everyday references.",
        emoji: "⏰",
        categories: ["numbers", "time", "colors"],
        xp: 70,
      },
      {
        id: 3,
        level: "beginner",
        title: "People & Body",
        description: "Family, people, body, and clothing vocabulary.",
        emoji: "🧍",
        categories: ["family", "people", "body", "clothing"],
        xp: 70,
      },
      {
        id: 4,
        level: "beginner",
        title: "Daily Life",
        description: "Food, home items, objects, animals, and core adjectives/verbs.",
        emoji: "🏠",
        categories: ["food-drink", "home", "objects", "animals", "adjectives", "verbs-basic"],
        xp: 80,
      },
    ],
  },
  {
    id: "kati",
    title: "Kati",
    subtitle: "Intermediate",
    color: "warning",
    requiredXp: 580,
    units: [
      {
        id: 5,
        level: "intermediate",
        title: "Travel & Places",
        description: "Places, transport, and travel vocabulary for moving around.",
        emoji: "🧭",
        categories: ["places", "transport", "travel"],
        xp: 90,
      },
      {
        id: 6,
        level: "intermediate",
        title: "Work & Education",
        description: "Professions, work, and education terms for school and careers.",
        emoji: "💼",
        categories: ["professions", "work", "education"],
        xp: 100,
      },
      {
        id: 7,
        level: "intermediate",
        title: "Communication & Tech",
        description: "Communication, technology, and media for modern life.",
        emoji: "📱",
        categories: ["communication", "technology", "media"],
        xp: 100,
      },
      {
        id: 8,
        level: "intermediate",
        title: "Social Life",
        description: "Activities, relationships, and emotions in daily interactions.",
        emoji: "🫂",
        categories: ["activities", "relationships", "emotions"],
        xp: 100,
      },
      {
        id: 9,
        level: "intermediate",
        title: "Nature & Weather",
        description: "Nature, weather, and environment vocabulary.",
        emoji: "🌿",
        categories: ["nature", "weather", "environment"],
        xp: 100,
      },
      {
        id: 10,
        level: "intermediate",
        title: "Health & Wellbeing",
        description: "Health vocabulary for symptoms, care, and wellness.",
        emoji: "🩺",
        categories: ["health"],
        xp: 110,
      },
      {
        id: 11,
        level: "intermediate",
        title: "Money & Economics",
        description: "Money and economics terms for prices, budgets, and trade.",
        emoji: "💰",
        categories: ["money", "economics"],
        xp: 110,
      },
      {
        id: 12,
        level: "intermediate",
        title: "Society & Institutions",
        description: "Society, values, religion, law, politics, and institutions.",
        emoji: "🏛️",
        categories: ["society", "values", "religion", "law", "politics", "institutional"],
        xp: 120,
      },
      {
        id: 13,
        level: "intermediate",
        title: "Ideas & Sciences",
        description: "Concepts, philosophy, sciences, and advanced verbs.",
        emoji: "🧠",
        categories: ["concepts", "philosophy", "science", "social-science", "verbs-advanced"],
        xp: 120,
      },
    ],
  },
];

const allLessons = lessonLevels.flatMap((level) => level.units);

export const getLessonById = (id: number) => allLessons.find((lesson) => lesson.id === id) ?? null;
