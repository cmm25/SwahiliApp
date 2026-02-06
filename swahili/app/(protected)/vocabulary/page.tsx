'use client';

import { PageHeader } from "@/components/shared/PageHeader";
import { QuizModal } from "@/components/vocabulary/QuizModal";
import { useEffect, useMemo, useState } from "react";
import { useStreak } from "@/hooks/useStreak";
import { useTeaching } from "@/hooks/useTeaching";
import { useQuiz } from "@/hooks/useQuiz";
import { GrowthStage, UserWord } from "@/lib/agents/teaching-shared";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { growthStages, stageOptions } from "./_components/constants";
import { PracticeNotice } from "./_components/PracticeNotice";
import { GardenStatsSection } from "./_components/GardenStatsSection";
import { GrowthOverview } from "./_components/GrowthOverview";
import { PracticeModal } from "./_components/PracticeModal";
import { FiltersSection } from "./_components/FiltersSection";
import { WordsGrid } from "./_components/WordsGrid";

export default function Vocabulary() {
  const { streak, xp } = useStreak();
  const { fetchVocabulary, fetchVocabularyCount, toggleFavorite, startPractice, reviewWord, quickReview, filterDueWords, addWordToLearning } = useTeaching();
  const quiz = useQuiz();
  const { speak: playPronunciation } = useTextToSpeech();
  const [words, setWords] = useState<UserWord[]>([]);
  const [userWords, setUserWords] = useState<UserWord[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [practiceWords, setPracticeWords] = useState<UserWord[]>([]);
  const [practiceIntro, setPracticeIntro] = useState<string | null>(null);
  const [practiceNotice, setPracticeNotice] = useState<string | null>(null);
  const [totalVocabulary, setTotalVocabulary] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<GrowthStage | "all">("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showLearningOnly, setShowLearningOnly] = useState(false);
  const [showDueOnly, setShowDueOnly] = useState(false);
  const [reviewedWordIds, setReviewedWordIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;
    fetchVocabulary().then(data => {
      if (isMounted) {
        setWords(data);
        setUserWords(data.filter(word => Boolean(word.userVocabId)));
      }
    });
    fetchVocabularyCount().then(count => {
      if (isMounted) {
        setTotalVocabulary(count);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [fetchVocabulary, fetchVocabularyCount]);

  const categories = useMemo(
    () => [...new Set(words.map(w => w.category).filter((c): c is string => Boolean(c)))].sort(),
    [words]
  );
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    words.forEach(word => {
      if (!word.category) return;
      counts[word.category] = (counts[word.category] ?? 0) + 1;
    });
    return counts;
  }, [words]);

  const wordsNeedingWater = useMemo(() => filterDueWords(userWords), [filterDueWords, userWords]);

  const dueWordIds = useMemo(
    () => new Set(wordsNeedingWater.map(word => word.id)),
    [wordsNeedingWater]
  );

  const filteredWords = useMemo(() => {
    const baseWords = showDueOnly ? userWords : (showLearningOnly ? userWords : words);

    return baseWords.filter(word => {
      if (selectedCategory !== "all" && word.category !== selectedCategory) {
        return false;
      }
      if (selectedStage !== "all" && word.growth_stage !== selectedStage) {
        return false;
      }
      if (showFavorites && !word.is_favorite) {
        return false;
      }
      if (showDueOnly && !dueWordIds.has(word.id)) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          word.swahili.toLowerCase().includes(query) ||
          word.english.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [
    selectedCategory,
    selectedStage,
    showFavorites,
    showLearningOnly,
    showDueOnly,
    searchQuery,
    words,
    userWords,
    dueWordIds,
  ]);

  const currentPracticeWord = practiceWords[currentPracticeIndex];
  const currentStageInfo = useMemo(
    () =>
      currentPracticeWord
        ? growthStages[currentPracticeWord.growth_stage as GrowthStage] ?? growthStages.seed
        : growthStages.seed,
    [currentPracticeWord]
  );

  const handleStartPractice = async () => {
    const response = await startPractice();
    if (response.success && response.words && response.words.length > 0) {
      setPracticeWords(response.words);
      setPracticeIntro(response.content ?? null);
      setPracticeNotice(null);
      setPracticeMode(true);
      setCurrentPracticeIndex(0);
      setShowAnswer(false);
      setEarnedXP(0);
      setReviewedWordIds(new Set());
      return;
    }

    const notice =
      response.content ||
      response.error ||
      "No words are ready for practice yet. Try again later.";
    setPracticeNotice(notice);
    setPracticeMode(false);
  };

  const handleClosePractice = () => {
    setPracticeMode(false);
    setCurrentPracticeIndex(0);
    setShowAnswer(false);
    setEarnedXP(0);
    setPracticeWords([]);
    setPracticeIntro(null);
    setReviewedWordIds(new Set());
  };

  const moveToNextWord = () => {
    setShowAnswer(false);
    if (currentPracticeIndex < practiceWords.length - 1) {
      setCurrentPracticeIndex(prev => prev + 1);
      return;
    }
    setPracticeMode(false);
    setCurrentPracticeIndex(0);
    setPracticeWords([]);
    setPracticeIntro(null);
  };

  const handlePracticeAnswer = async (performance: 'perfect' | 'good' | 'struggled' | 'forgot') => {
    if (!currentPracticeWord || isProcessing) {
      return;
    }

    if (reviewedWordIds.has(currentPracticeWord.id)) {
      moveToNextWord();
      return;
    }

    setIsProcessing(true);
    setReviewedWordIds(prev => new Set(prev).add(currentPracticeWord.id));
    
    try {
      // Use quickReview for faster feedback loop without LLM
      const response = await quickReview(currentPracticeWord, performance);
  
      if (response.success) {
        const xpAmount = response.xpEarned ?? currentStageInfo.xpBonus;
        setEarnedXP(prev => prev + xpAmount);
        setShowXPPopup(true);
        setTimeout(() => setShowXPPopup(false), 1000);

        const fallbackWord = response.nextStage
          ? { ...currentPracticeWord, growth_stage: response.nextStage as GrowthStage, last_reviewed_at: new Date().toISOString() }
          : null;
        const updatedWord = response.words?.[0] ?? fallbackWord;

        if (updatedWord) {
          setWords(prev =>
            prev.map(w => (w.id === updatedWord.id ? updatedWord : w))
          );
          setUserWords(prev => {
            const exists = prev.some(w => w.id === updatedWord.id);
            return exists
              ? prev.map(w => (w.id === updatedWord.id ? updatedWord : w))
              : [...prev, updatedWord];
          });
          setPracticeWords(prev =>
            prev.map(w => (w.id === updatedWord.id ? updatedWord : w))
          );
        }
      }
      
    } finally {
      setIsProcessing(false);
      moveToNextWord();
    }
  };

  const handleAddWord = async (word: UserWord) => {
    const updated = await addWordToLearning(word.id);
    if (!updated) return;

    setWords(prev => prev.map(w => (w.id === updated.id ? updated : w)));
    setUserWords(prev => [...prev, updated]);
  };

  const handleToggleFavorite = async (word: UserWord) => {
    const updated = await toggleFavorite(word);
    if (!updated) return;

    setWords(prev => prev.map(w => (w.id === updated.id ? updated : w)));
    setUserWords(prev => {
      const exists = prev.some(w => w.id === updated.id);
      return exists
        ? prev.map(w => (w.id === updated.id ? updated : w))
        : [...prev, updated];
    });
  };

  const stageDistribution = {
    seed: userWords.filter(w => w.growth_stage === "seed").length,
    sprout: userWords.filter(w => w.growth_stage === "sprout").length,
    sapling: userWords.filter(w => w.growth_stage === "sapling").length,
    flower: userWords.filter(w => w.growth_stage === "flower").length,
    tree: userWords.filter(w => w.growth_stage === "tree").length,
  };

  const waterProgress = userWords.length === 0
    ? 0
    : Math.round(((userWords.length - wordsNeedingWater.length) / userWords.length) * 100);

  const baseCount = (showLearningOnly || showDueOnly) ? userWords.length : words.length;

  return (
    <>
      <PageHeader 
          title="Bustani ya Maneno" 
          subtitle="Your Word Garden — Watch your vocabulary bloom! 🌻"
        />
        <PracticeNotice
          message={practiceNotice}
          onClose={() => setPracticeNotice(null)}
        />

        <GardenStatsSection
          totalWords={userWords.length}
          totalVocabulary={totalVocabulary}
          masteredWords={stageDistribution.tree}
          streakDays={streak}
          todayXP={xp}
          waterProgress={waterProgress}
        />

        <GrowthOverview
          learnedCount={userWords.length}
          masteredCount={stageDistribution.tree}
          totalVocabulary={totalVocabulary}
          distribution={stageDistribution}
          totalWords={userWords.length}
          onQuickReview={handleStartPractice}
          onTakeQuiz={() => void quiz.startQuiz()}
          quizLoading={quiz.state === "loading"}
        />
        <QuizModal
          isOpen={quiz.state !== "idle"}
          state={quiz.state}
          session={quiz.session}
          currentQuestion={quiz.currentQuestion}
          currentIndex={quiz.currentIndex}
          progress={quiz.progress}
          correctCount={quiz.correctCount}
          isLastQuestion={quiz.isLastQuestion}
          feedback={quiz.feedback}
          error={quiz.error}
          onStart={quiz.beginQuiz}
          onSubmit={quiz.submitAnswer}
          onNext={quiz.nextQuestion}
          onFinish={quiz.finishQuiz}
          onClose={quiz.resetQuiz}
          onRetry={() => {
            quiz.resetQuiz();
            void quiz.startQuiz();
          }}
        />

        <PracticeModal
          isOpen={practiceMode}
          word={currentPracticeWord}
          stageInfo={currentStageInfo}
          showXPPopup={showXPPopup}
          earnedXP={earnedXP}
          practiceIntro={practiceIntro}
          currentIndex={currentPracticeIndex}
          totalCount={practiceWords.length}
          showAnswer={showAnswer}
          isProcessing={isProcessing}
          onReveal={() => setShowAnswer(true)}
          onAnswer={handlePracticeAnswer}
          onClose={handleClosePractice}
          onPlayPronunciation={playPronunciation}
        />

        <FiltersSection
          categories={categories}
          categoryCounts={categoryCounts}
          selectedCategory={selectedCategory}
          selectedStage={selectedStage}
          showFavorites={showFavorites}
          showLearningOnly={showLearningOnly}
          showDueOnly={showDueOnly}
          searchQuery={searchQuery}
          wordsCount={words.length}
          userWordsCount={userWords.length}
          dueCount={wordsNeedingWater.length}
          filteredCount={filteredWords.length}
          baseCount={baseCount}
          stageOptions={stageOptions}
          onCategoryChange={setSelectedCategory}
          onStageChange={setSelectedStage}
          onSearchChange={setSearchQuery}
          onToggleFavorites={() => setShowFavorites((prev) => !prev)}
          onShowAllWords={() => setShowLearningOnly(false)}
          onShowLearningOnly={() => setShowLearningOnly(true)}
          onToggleDueOnly={() => setShowDueOnly((prev) => !prev)}
          onReset={() => {
            setSelectedCategory("all");
            setSelectedStage("all");
            setShowFavorites(false);
            setShowLearningOnly(false);
            setShowDueOnly(false);
            setSearchQuery("");
          }}
        />

        <WordsGrid
          words={filteredWords}
          growthStages={growthStages}
          onToggleFavorite={handleToggleFavorite}
          onPlayAudio={playPronunciation}
          onAdd={handleAddWord}
        />
      </>
    );
  }
