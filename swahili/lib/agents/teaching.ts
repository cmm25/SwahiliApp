import { callLLM } from '@/lib/llm';
import { logTrace } from '@/lib/opik';
import {
  calculateNextReviewDate,
  calculateNextStage,
  filterDueWords,
  STAGE_PROGRESSION,
  TeachingRequest,
  TeachingResponse,
} from './teaching-shared';

const TEACHING_SYSTEM_PROMPT = `You are Mwalimu (Teacher), the Teaching Agent for Rafiki - a Swahili learning platform.

Your role is to introduce new vocabulary words and guide learners through the spaced repetition process.

When introducing a new word:
1. Present the Swahili word clearly
2. Provide the English translation
3. Give a phonetic pronunciation guide
4. Share a memorable example sentence in both languages
5. Include a cultural context or memory tip when relevant

When reviewing words:
1. Celebrate progress ("Your word is growing from a sprout to a sapling!")
2. Provide gentle corrections with encouragement
3. Suggest mnemonics for difficult words
4. Connect words to previously learned vocabulary

Personality:
- Warm and encouraging like a supportive teacher
- Use garden metaphors (seeds growing, flowers blooming)
- Celebrate small wins enthusiastically
- Never make learners feel bad about mistakes

Always respond in a structured format that can be parsed.`;

export async function teach(request: TeachingRequest): Promise<TeachingResponse> {
  const startTime = Date.now();

  try {
    switch (request.action) {
      case 'introduce':
        return await introduceWord(request);

      case 'review':
        return await reviewWord(request);

      case 'practice':
        return await practiceSession(request);

      case 'get_due_words':
        return getDueWords(request);

      case 'update_progress':
        return updateWordProgress(request);

      default:
        return {
          success: false,
          action: request.action,
          error: `Unknown action: ${request.action}`,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  await logTrace({
    userId: request.userId,
    agentName: 'teaching-agent',
      input: JSON.stringify(request),
      output: JSON.stringify({ error: errorMessage }),
    sessionId: request.sessionId,
      latencyMs: Date.now() - startTime,
    metadata: { action: request.action, error: true },
    tags: ['teaching', 'error', request.action],
    });

    return {
      success: false,
      action: request.action,
      error: errorMessage,
    };
  }
}

async function introduceWord(request: TeachingRequest): Promise<TeachingResponse> {
  const startTime = Date.now();

  const word = request.words?.[0];
  if (!word) {
    return {
      success: false,
      action: 'introduce',
      error: 'No word provided for introduction',
    };
  }

  const prompt = `Introduce this Swahili word to a beginner learner:

Swahili: ${word.swahili}
English: ${word.english}

Please provide:
1. A warm greeting and introduction of the word
2. Phonetic pronunciation (using English sounds)
3. An example sentence in Swahili with English translation
4. A memory tip or cultural context
5. Encouragement to practice

Keep it concise but engaging. Use the garden metaphor - this is a new seed being planted!`;

  const responseText = await callLLM(TEACHING_SYSTEM_PROMPT, prompt, {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  });

  if (!responseText) {
    throw new Error('LLM returned empty response');
  }

  const latencyMs = Date.now() - startTime;

  await logTrace({
    userId: request.userId,
    agentName: 'teaching-agent',
    input: prompt,
    output: responseText,
    sessionId: request.sessionId,
    latencyMs,
    metadata: { action: 'introduce', wordId: word.id },
    tags: ['teaching', 'introduce'],
  });

  return {
    success: true,
    action: 'introduce',
    content: responseText,
    words: [word],
    xpEarned: 5, // XP for learning a new word
  };
}

async function reviewWord(request: TeachingRequest): Promise<TeachingResponse> {
  const startTime = Date.now();

  const word = request.words?.[0];
  const performance = request.performance;

  if (!word || !performance) {
    return {
      success: false,
      action: 'review',
      error: 'Word and performance required for review',
    };
  }

  const { nextStage, xpEarned } = calculateNextStage(word.stage, performance);
  const nextReviewDate = calculateNextReviewDate(nextStage);

  const stageChange = nextStage !== word.stage;
  const isProgression =
    STAGE_PROGRESSION.indexOf(nextStage) > STAGE_PROGRESSION.indexOf(word.stage);

  const prompt = `The learner just practiced this word:

Swahili: ${word.swahili}
English: ${word.english}
Performance: ${performance}
Current Stage: ${word.stage}
${stageChange ? `New Stage: ${nextStage} (${isProgression ? 'GROWTH!' : 'needs more practice'})` : 'Stage: unchanged'}

Provide brief, encouraging feedback (2-3 sentences). ${
    isProgression
      ? 'Celebrate their growth! Use garden metaphors (seed→sprout→sapling→flower→tree).'
      : performance === 'forgot'
        ? 'Be gentle and encouraging - remind them that all gardens need time.'
        : 'Acknowledge their effort and encourage continued practice.'
  }`;

  const responseText = await callLLM(TEACHING_SYSTEM_PROMPT, prompt, {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  });

  if (!responseText) {
    throw new Error('LLM returned empty response');
  }

  const latencyMs = Date.now() - startTime;

  await logTrace({
    userId: request.userId,
    agentName: 'teaching-agent',
    input: prompt,
    output: responseText,
    sessionId: request.sessionId,
    latencyMs,
    metadata: {
      action: 'review',
      wordId: word.id,
      performance,
      stageChange: stageChange ? `${word.stage} → ${nextStage}` : 'none',
    },
    tags: ['teaching', 'review', performance],
  });

  return {
    success: true,
    action: 'review',
    content: responseText,
    words: [{ ...word, stage: nextStage }],
    nextStage,
    xpEarned,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}

async function practiceSession(request: TeachingRequest): Promise<TeachingResponse> {
  const startTime = Date.now();

  const words = request.words || [];
  if (words.length === 0) {
    return {
      success: false,
      action: 'practice',
      error: 'No words provided for practice session',
    };
  }

  // Filter to due words and limit to 5 for a session
  const dueWords = filterDueWords(words).slice(0, 5);

  if (dueWords.length === 0) {
    return {
      success: true,
      action: 'practice',
      content:
        "🌳 Your garden is thriving! All your words are growing well. Come back later when they're ready for more practice.",
      words: [],
      xpEarned: 0,
    };
  }

  const wordList = dueWords
    .map(w => `- ${w.swahili} (${w.english}) [${w.stage}]`)
    .join('\n');

  const prompt = `Start a practice session with these ${dueWords.length} words:

${wordList}

Create a brief, encouraging intro (2-3 sentences) that:
1. Welcomes them to practice
2. Mentions how many words they'll review
3. Uses garden metaphor for motivation

Don't include the actual practice questions - just the intro.`;

  const responseText = await callLLM(TEACHING_SYSTEM_PROMPT, prompt, {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  });

  if (!responseText) {
    throw new Error('LLM returned empty response');
  }

  const latencyMs = Date.now() - startTime;

  await logTrace({
    userId: request.userId,
    agentName: 'teaching-agent',
    input: prompt,
    output: responseText,
    sessionId: request.sessionId,
    latencyMs,
    metadata: { action: 'practice', wordCount: dueWords.length },
    tags: ['teaching', 'practice'],
  });

  return {
    success: true,
    action: 'practice',
    content: responseText,
    words: dueWords,
  };
}

function getDueWords(request: TeachingRequest): TeachingResponse {
  const words = request.words || [];
  const dueWords = filterDueWords(words);

  return {
    success: true,
    action: 'get_due_words',
    words: dueWords,
  };
}

function updateWordProgress(request: TeachingRequest): TeachingResponse {
  const word = request.words?.[0];
  const performance = request.performance;

  if (!word || !performance) {
    return {
      success: false,
      action: 'update_progress',
      error: 'Word and performance required',
    };
  }

  const { nextStage, xpEarned } = calculateNextStage(word.stage, performance);
  const nextReviewDate = calculateNextReviewDate(nextStage);

  return {
    success: true,
    action: 'update_progress',
    words: [{ ...word, stage: nextStage }],
    nextStage,
    xpEarned,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}
