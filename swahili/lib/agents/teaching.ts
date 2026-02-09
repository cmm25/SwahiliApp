import { callLLM } from '@/lib/llm';
import { logTrace } from '@/lib/opik';
import { TEMPLATES, SYSTEM_PROMPTS, formatPrompt } from '@/lib/prompts';
import {
  calculateNextReviewDate,
  calculateNextStage,
  filterDueWords,
  STAGE_PROGRESSION,
  TeachingRequest,
  TeachingResponse,
  normalizeGrowthStage,
} from './teaching-shared';

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

  const template = TEMPLATES.INTRODUCE_WORD;
  const prompt = formatPrompt(template.prompt, {
    swahili: word.swahili,
    english: word.english
  });

  const responseText = await callLLM(SYSTEM_PROMPTS.TEACHING.prompt, prompt, {
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
      action: 'introduce',
      wordId: word.id,
      prompt_name: template.name,
      prompt_version: template.version,
      success: true,
      // Enhanced Analytics Metadata
      learning_type: 'vocabulary_introduction',
      word_introduced: word.swahili,
      word_length: word.swahili.length,
      cultural_context_included: responseText.toLowerCase().includes('culture') || 
                                 responseText.toLowerCase().includes('context') ||
                                 responseText.toLowerCase().includes('east africa'),
      garden_metaphor_used: responseText.toLowerCase().includes('seed') || 
                            responseText.toLowerCase().includes('plant') ||
                            responseText.toLowerCase().includes('grow'),
      response_contains_pronunciation: responseText.includes('(') && responseText.includes(')')
    },
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

  const currentStage = normalizeGrowthStage(word.growth_stage ?? word.stage);
  const { nextStage, xpEarned } = calculateNextStage(currentStage, performance);
  const nextReviewDate = calculateNextReviewDate(nextStage);

  const stageChange = nextStage !== currentStage;
  const isProgression =
    STAGE_PROGRESSION.indexOf(nextStage) > STAGE_PROGRESSION.indexOf(currentStage);

  const stageChangeInfo = stageChange
    ? `New Stage: ${nextStage} (${isProgression ? 'GROWTH!' : 'needs more practice'})`
    : 'Stage: unchanged';

  const feedbackGuidance = isProgression
    ? 'Celebrate their growth! Use garden metaphors (seed→sprout→sapling→flower→tree).'
    : performance === 'forgot'
      ? 'Be gentle and encouraging - remind them that all gardens need time.'
      : 'Acknowledge their effort and encourage continued practice.';

  const template = TEMPLATES.REVIEW_WORD;
  const prompt = formatPrompt(template.prompt, {
    swahili: word.swahili,
    english: word.english,
    performance: performance,
    currentStage: currentStage,
    stageChangeInfo: stageChangeInfo,
    feedbackGuidance: feedbackGuidance
  });

  const responseText = await callLLM(SYSTEM_PROMPTS.TEACHING.prompt, prompt, {
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
      stageChange: stageChange ? `${currentStage} → ${nextStage}` : 'none',
      prompt_name: template.name,
      prompt_version: template.version,
      success: true,
      // Enhanced Analytics Metadata
      learning_type: 'spaced_repetition_review',
      word_reviewed: word.swahili,
      performance_outcome: performance,
      spaced_repetition_stage: currentStage,
      garden_metaphor_used: responseText.toLowerCase().includes('grow') || 
                            responseText.toLowerCase().includes('bloom') ||
                            responseText.toLowerCase().includes('water') ||
                            responseText.toLowerCase().includes('sapling'),
      feedback_tone: performance === 'perfect' || performance === 'good' ? 'celebratory' : 'encouraging'
    },
    tags: ['teaching', 'review', performance],
  });

  return {
    success: true,
    action: 'review',
    content: responseText,
    words: [{ ...word, growth_stage: nextStage }],
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
    .map(w => `- ${w.swahili} (${w.english}) [${w.growth_stage}]`)
    .join('\n');

  const template = TEMPLATES.PRACTICE_SESSION;
  const prompt = formatPrompt(template.prompt, {
    count: dueWords.length,
    wordList: wordList
  });

  const responseText = await callLLM(SYSTEM_PROMPTS.TEACHING.prompt, prompt, {
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
      action: 'practice',
      wordCount: dueWords.length,
      prompt_name: template.name,
      prompt_version: template.version,
      success: true,
      // Enhanced Analytics Metadata
      learning_type: 'practice_session_start',
      word_count: dueWords.length,
      garden_metaphor_used: responseText.toLowerCase().includes('garden') || 
                            responseText.toLowerCase().includes('grow')
    },
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

  const currentStage = normalizeGrowthStage(word.growth_stage ?? word.stage);
  const { nextStage, xpEarned } = calculateNextStage(currentStage, performance);
  const nextReviewDate = calculateNextReviewDate(nextStage);

  return {
    success: true,
    action: 'update_progress',
    words: [{ ...word, growth_stage: nextStage }],
    nextStage,
    xpEarned,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}
