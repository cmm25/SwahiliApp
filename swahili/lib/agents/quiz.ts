import { logAgentTrace } from '../agent-logger';

// ============================================================================
// TYPES
// ============================================================================

export type QuestionType =
  | 'swahili_to_english'
  | 'english_to_swahili'
  | 'fill_blank'
  | 'multiple_choice';

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  wordId: string;
  swahili: string;
  english: string;
  hint?: string;
}

export interface QuizAnswer {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  timeTakenMs?: number;
}

export interface QuizSession {
  id?: string;
  userId: string;
  lessonId: number;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  xpEarned: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface QuizConfig {
  questionCount: number;
  includeHints: boolean;
  difficultyBias: 'easy' | 'balanced' | 'hard';
}

export interface VocabWord {
  id: string;
  swahili: string;
  english: string;
  category?: string;
  growthStage?: string;
}

export interface GenerateQuizRequest {
  userId: string;
  lessonId: number;
  words: VocabWord[];
  config?: Partial<QuizConfig>;
}

export interface GradeQuizRequest {
  userId: string;
  session: QuizSession;
}

export interface QuizResult {
  success: boolean;
  session?: QuizSession;
  feedback?: string;
  error?: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: QuizConfig = {
  questionCount: 10,
  includeHints: true,
  difficultyBias: 'balanced',
};

const XP_REWARDS = {
  perfect: 100,      // 10/10
  excellent: 80,     // 9/10
  great: 60,         // 8/10
  good: 40,          // 7/10
  passing: 25,       // 6/10
  needsWork: 10,     // < 6/10
};

const QUESTION_TYPES: QuestionType[] = [
  'swahili_to_english',
  'english_to_swahili',
  'multiple_choice',
  'fill_blank',
];

// ============================================================================
// GROQ CLIENT
// ============================================================================

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call Groq API directly (for local development)
 * User provides GROQ_API_KEY in their .env.local
 */
async function callGroq(
  messages: GroqMessage[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const { temperature = 0.7, maxTokens = 2000 } = options;

  // For local dev, expect GROQ_API_KEY in Next.js API route
  // This function will be called via API route
  const response = await fetch('/api/agents/quiz-agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      temperature,
      maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return data.content;
}

// ============================================================================
// QUIZ GENERATION
// ============================================================================

const QUIZ_SYSTEM_PROMPT = `You are a Swahili language quiz generator for Rafiki learning platform.
 
 Your task is to generate quiz questions that test vocabulary knowledge.
 
 Rules:
 1. Questions must be clear and unambiguous
 2. Multiple choice options should be plausible but distinct
 3. Include helpful hints when requested
 4. Vary question types for engagement
 5. Ensure correct answers are accurate
 
 Always respond with valid JSON matching the requested schema.`;

/**
 * Generate a unique quiz for the user based on lesson vocabulary
 */
export async function generateQuiz(request: GenerateQuizRequest): Promise<QuizResult> {
  const startTime = Date.now();
  const config = { ...DEFAULT_CONFIG, ...request.config };

  try {
    // Validate input
    if (!request.words || request.words.length === 0) {
      return {
        success: false,
        error: 'No vocabulary words available for quiz generation',
      };
    }

    // Need at least 4 words for multiple choice distractors
    if (request.words.length < 4) {
      return {
        success: false,
        error: 'Need at least 4 vocabulary words to generate a quiz',
      };
    }

    // Select words for quiz (can repeat if not enough unique words)
    const selectedWords = selectWordsForQuiz(request.words, config.questionCount);

    // Generate questions using Groq
    const questions = await generateQuestionsWithAI(
      selectedWords,
      request.words, // Pass all words for distractors
      config
    );

    const session: QuizSession = {
      userId: request.userId,
      lessonId: request.lessonId,
      questions,
      answers: [],
      score: 0,
      totalQuestions: questions.length,
      xpEarned: 0,
      startedAt: new Date(),
    };

    // Log trace
    await logAgentTrace({
      userId: request.userId,
      agentName: 'quiz',
      input: JSON.stringify({ lessonId: request.lessonId, wordCount: request.words.length }),
      output: JSON.stringify({ questionCount: questions.length }),
      latencyMs: Date.now() - startTime,
      success: true,
      metadata: { action: 'generate', lessonId: request.lessonId, quizLevel: request.lessonId },
    });

    return {
      success: true,
      session,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Quiz generation failed';

    await logAgentTrace({
      userId: request.userId,
      agentName: 'quiz',
      input: JSON.stringify(request),
      output: JSON.stringify({ error: errorMessage }),
      latencyMs: Date.now() - startTime,
      success: false,
      metadata: { action: 'generate', lessonId: request.lessonId, quizLevel: request.lessonId },
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Select words for quiz, ensuring variety and appropriate difficulty
 */
function selectWordsForQuiz(words: VocabWord[], count: number): VocabWord[] {
  // Shuffle words
  const shuffled = [...words].sort(() => Math.random() - 0.5);

  // If we have enough words, select unique ones
  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }

  // Otherwise, repeat words to reach count
  const selected: VocabWord[] = [];
  while (selected.length < count) {
    selected.push(...shuffled);
  }
  return selected.slice(0, count);
}

/**
 * Generate quiz questions using Groq AI
 */
async function generateQuestionsWithAI(
  targetWords: VocabWord[],
  allWords: VocabWord[],
  config: QuizConfig
): Promise<QuizQuestion[]> {
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < targetWords.length; i++) {
    const word = targetWords[i];
    const questionType = QUESTION_TYPES[i % QUESTION_TYPES.length];

    const question = await generateSingleQuestion(
      word,
      questionType,
      allWords,
      i + 1,
      config.includeHints
    );

    questions.push(question);
  }

  return questions;
}

/**
 * Generate a single quiz question
 */
async function generateSingleQuestion(
  word: VocabWord,
  type: QuestionType,
  allWords: VocabWord[],
  questionNumber: number,
  includeHint: boolean
): Promise<QuizQuestion> {
  // Get distractors for multiple choice
  const distractors = allWords
    .filter(w => w.id !== word.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const prompt = buildQuestionPrompt(word, type, distractors, includeHint);

  try {
    const response = await callGroq([
      { role: 'system', content: QUIZ_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ], { temperature: 0.8, maxTokens: 500 });

    const parsed = parseQuestionResponse(response, word, type, questionNumber);
    return parsed;
  } catch {
    // Fallback to simple question if AI fails
    return createFallbackQuestion(word, type, distractors, questionNumber);
  }
}

/**
 * Build prompt for question generation
 */
function buildQuestionPrompt(
  word: VocabWord,
  type: QuestionType,
  distractors: VocabWord[],
  includeHint: boolean
): string {
  const baseInfo = `
 Target Word:
 - Swahili: ${word.swahili}
 - English: ${word.english}
 - Category: ${word.category || 'general'}
 
 Distractor Words (for multiple choice):
 ${distractors.map(d => `- ${d.swahili} = ${d.english}`).join('\n')}
 `;

  const typeInstructions: Record<QuestionType, string> = {
    swahili_to_english: `Create a question asking "What does '${word.swahili}' mean in English?"`,
    english_to_swahili: `Create a question asking "How do you say '${word.english}' in Swahili?"`,
    fill_blank: `Create a fill-in-the-blank sentence using the Swahili word '${word.swahili}'`,
    multiple_choice: `Create a multiple choice question with 4 options where the correct answer is '${word.english}' or '${word.swahili}'`,
  };

  return `${baseInfo}
 
 Question Type: ${type}
 ${typeInstructions[type]}
 
 ${includeHint ? 'Include a helpful hint.' : 'No hint needed.'}
 
 Respond with JSON:
 {
   "prompt": "The question text",
   "correctAnswer": "The correct answer",
   "options": ["option1", "option2", "option3", "option4"], // only for multiple_choice
   "hint": "A helpful hint" // if requested
 }`;
}

/**
 * Parse AI response into QuizQuestion
 */
function parseQuestionResponse(
  response: string,
  word: VocabWord,
  type: QuestionType,
  questionNumber: number
): QuizQuestion {
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      id: questionNumber,
      type,
      prompt: parsed.prompt || `What does "${word.swahili}" mean?`,
      correctAnswer: parsed.correctAnswer || word.english,
      options: parsed.options,
      wordId: word.id,
      swahili: word.swahili,
      english: word.english,
      hint: parsed.hint,
    };
  } catch {
    // Return fallback on parse error
    return createFallbackQuestion(word, type, [], questionNumber);
  }
}

/**
 * Create a fallback question when AI generation fails
 */
function createFallbackQuestion(
  word: VocabWord,
  type: QuestionType,
  distractors: VocabWord[],
  questionNumber: number
): QuizQuestion {
  const question: QuizQuestion = {
    id: questionNumber,
    type,
    prompt: '',
    correctAnswer: '',
    wordId: word.id,
    swahili: word.swahili,
    english: word.english,
  };

  switch (type) {
    case 'swahili_to_english':
      question.prompt = `What does "${word.swahili}" mean in English?`;
      question.correctAnswer = word.english;
      break;
    case 'english_to_swahili':
      question.prompt = `How do you say "${word.english}" in Swahili?`;
      question.correctAnswer = word.swahili;
      break;
    case 'multiple_choice':
      question.prompt = `What does "${word.swahili}" mean?`;
      question.correctAnswer = word.english;
      question.options = [
        word.english,
        ...distractors.slice(0, 3).map(d => d.english),
      ].sort(() => Math.random() - 0.5);
      break;
    case 'fill_blank':
      question.prompt = `Complete: "_____" means "${word.english}" in Swahili`;
      question.correctAnswer = word.swahili;
      break;
  }

  return question;
}

// ============================================================================
// GRADING
// ============================================================================

/**
 * Grade a completed quiz and calculate XP
 */
export async function gradeQuiz(request: GradeQuizRequest): Promise<QuizResult> {
  const startTime = Date.now();
  const { session } = request;

  try {
    // Calculate score
    const correctAnswers = session.answers.filter(a => a.isCorrect).length;
    const percentage = (correctAnswers / session.totalQuestions) * 100;

    // Calculate XP based on performance
    let xpEarned: number;
    if (percentage === 100) xpEarned = XP_REWARDS.perfect;
    else if (percentage >= 90) xpEarned = XP_REWARDS.excellent;
    else if (percentage >= 80) xpEarned = XP_REWARDS.great;
    else if (percentage >= 70) xpEarned = XP_REWARDS.good;
    else if (percentage >= 60) xpEarned = XP_REWARDS.passing;
    else xpEarned = XP_REWARDS.needsWork;

    // Generate feedback using AI
    const feedback = await generateFeedback(session, correctAnswers, percentage);

    const gradedSession: QuizSession = {
      ...session,
      score: correctAnswers,
      xpEarned,
      completedAt: new Date(),
    };

    await logAgentTrace({
      userId: request.userId,
      agentName: 'quiz',
      input: JSON.stringify({ lessonId: session.lessonId, answers: session.answers.length }),
      output: JSON.stringify({ score: correctAnswers, xpEarned, percentage }),
      latencyMs: Date.now() - startTime,
      success: true,
      metadata: { action: 'grade', score: correctAnswers, percentage, lessonId: session.lessonId, quizLevel: session.lessonId },
    });

    return {
      success: true,
      session: gradedSession,
      feedback,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Grading failed';

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Check if an answer is correct (with fuzzy matching)
 */
export function checkAnswer(
  userAnswer: string,
  correctAnswer: string
): boolean {
  const normalize = (s: string) =>
    s.toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, ' ');

  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(correctAnswer);

  // Exact match
  if (normalizedUser === normalizedCorrect) return true;

  // Allow minor typos (Levenshtein distance <= 1 for short words)
  if (normalizedCorrect.length <= 5) {
    return levenshteinDistance(normalizedUser, normalizedCorrect) <= 1;
  }

  // For longer words, allow 2 character difference
  return levenshteinDistance(normalizedUser, normalizedCorrect) <= 2;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Generate personalized feedback using AI
 */
async function generateFeedback(
  session: QuizSession,
  correctCount: number,
  percentage: number
): Promise<string> {
  const wrongAnswers = session.answers
    .filter(a => !a.isCorrect)
    .map(a => {
      const q = session.questions.find(q => q.id === a.questionId);
      return q ? `${q.swahili} (${q.english})` : '';
    })
    .filter(Boolean);

  const prompt = `Generate brief, encouraging feedback (2-3 sentences) for a Swahili quiz result:
 
 Score: ${correctCount}/${session.totalQuestions} (${percentage.toFixed(0)}%)
 ${wrongAnswers.length > 0 ? `Words to review: ${wrongAnswers.join(', ')}` : 'Perfect score!'}
 
 Use garden/growth metaphors. Be warm and encouraging. If they struggled, be gentle but motivating.`;

  try {
    const response = await callGroq([
      { role: 'system', content: 'You are Mwalimu, a warm and encouraging Swahili teacher.' },
      { role: 'user', content: prompt },
    ], { temperature: 0.8, maxTokens: 200 });

    return response;
  } catch {
    // Fallback feedback
    if (percentage >= 80) {
      return `🌟 Hongera sana! You scored ${correctCount}/${session.totalQuestions}! Your garden is flourishing beautifully!`;
    } else if (percentage >= 60) {
      return `🌱 Good effort! You scored ${correctCount}/${session.totalQuestions}. Keep watering your garden and watch it grow!`;
    } else {
      return `🌰 You scored ${correctCount}/${session.totalQuestions}. Every seed needs time to grow. Keep practicing!`;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const QuizAgent = {
  generateQuiz,
  gradeQuiz,
  checkAnswer,
};