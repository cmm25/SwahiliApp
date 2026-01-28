'use client';

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { WordCard } from "@/components/vocabulary/WordCard";
import { GardenStats } from "@/components/vocabulary/GardenStats";
import { GrowthVisualization } from "@/components/vocabulary/GrowthVisualization";
import {
  Volume2,
  Sparkles,
  Check,
  X,
  Droplets,
  Leaf,
  Flower2,
  TreeDeciduous,
  Zap,
  ChevronRight
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { SketchButton } from "@/components/shared/SketchButton";
import { SketchCard } from "@/components/shared/SketchCard";
import { useStreak } from "@/hooks/useStreak";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useTeaching } from "@/hooks/useTeaching";
import { stageToMasteryLevel, VocabularyWord } from "@/lib/agents/teaching-shared";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

type GrowthStage = "seed" | "sprout" | "sapling" | "flower" | "tree";

const growthStages: Record<GrowthStage, { icon: React.ReactNode; label: string; color: string; bgColor: string; xpBonus: number }> = {
  seed: { icon: <Droplets size={14} />, label: "Seed", color: "text-muted-foreground", bgColor: "bg-muted/30 border-muted/50", xpBonus: 5 },
  sprout: { icon: <Leaf size={14} />, label: "Sprout", color: "text-success/70", bgColor: "bg-success/10 border-success/30", xpBonus: 10 },
  sapling: { icon: <Leaf size={14} />, label: "Sapling", color: "text-success", bgColor: "bg-success/20 border-success/40", xpBonus: 15 },
  flower: { icon: <Flower2 size={14} />, label: "Blooming", color: "text-accent", bgColor: "bg-accent/20 border-accent/40", xpBonus: 20 },
  tree: { icon: <TreeDeciduous size={14} />, label: "Mastered", color: "text-warning", bgColor: "bg-warning/20 border-warning/40", xpBonus: 25 },
};


export default function Vocabulary() {
  const { streak, xp, addXp } = useStreak();
  const { fetchVocabulary, fetchVocabularyCount, toggleFavorite, startPractice, reviewWord, filterDueWords } = useTeaching();
  const { speak: playPronunciation } = useTextToSpeech();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [practiceWords, setPracticeWords] = useState<VocabularyWord[]>([]);
  const [practiceIntro, setPracticeIntro] = useState<string | null>(null);
  const [practiceNotice, setPracticeNotice] = useState<string | null>(null);
  const [totalVocabulary, setTotalVocabulary] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchVocabulary().then(data => {
      if (isMounted) {
        setWords(data);
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

  const filteredWords = useMemo(() => 
    selectedCategory ? words.filter(w => w.category === selectedCategory) : words,
    [words, selectedCategory]
  );
  
  const categories = useMemo(() => 
    [...new Set(words.map(w => w.category).filter((c): c is string => Boolean(c)))].sort(), 
    [words]
  );

  // Practice mode handlers
  const wordsNeedingWater = useMemo(() => filterDueWords(words), [filterDueWords, words]);
  const currentPracticeWord = practiceWords[currentPracticeIndex];
  const currentStageInfo = useMemo(
    () =>
      currentPracticeWord
        ? growthStages[currentPracticeWord.stage as GrowthStage] ?? growthStages.seed
        : growthStages.seed,
    [currentPracticeWord]
  );


  const handlePracticeAnswer = async (correct: boolean) => {
    if (!currentPracticeWord || isProcessing) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const performance = correct ? "perfect" : "forgot";
      const response = await reviewWord(currentPracticeWord, performance);
  
      if (response.success && response.nextStage) {
        const nextMastery = stageToMasteryLevel(response.nextStage);
        const xpAmount = response.xpEarned ?? currentStageInfo.xpBonus;
        setEarnedXP(prev => prev + xpAmount);
        setShowXPPopup(true);
        setTimeout(() => setShowXPPopup(false), 1000);
  
        await addXp(xpAmount);
  
        setWords(prev =>
          prev.map(w =>
            w.id === currentPracticeWord.id
              ? {
                  ...w,
                  stage: response.nextStage as GrowthStage,
                  mastery_level: nextMastery,
                  last_practiced: new Date().toISOString(),
                }
              : w
          )
        );
      }
      
      setShowAnswer(false);
      if (currentPracticeIndex < practiceWords.length - 1) {
        setCurrentPracticeIndex(prev => prev + 1);
      } else {
        setPracticeMode(false);
        setCurrentPracticeIndex(0);
        setPracticeWords([]);
        setPracticeIntro(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const success = await toggleFavorite(id);
    if (success) {
      setWords(prev => prev.map(w => w.id === id ? { ...w, is_favorite: !w.is_favorite } : w));
    }
  };

  // Growth stage distribution for visual garden
  const stageDistribution = {
    seed: words.filter(w => w.stage === "seed").length,
    sprout: words.filter(w => w.stage === "sprout").length,
    sapling: words.filter(w => w.stage === "sapling").length,
    flower: words.filter(w => w.stage === "flower").length,
    tree: words.filter(w => w.stage === "tree").length,
  };

  const waterProgress = words.length === 0
    ? 0
    : Math.round(((words.length - wordsNeedingWater.length) / words.length) * 100);

  return (
    <ProtectedRoute>
      <AppLayout>
        <PageHeader 
          title="Bustani ya Maneno" 
          subtitle="Your Word Garden — Watch your vocabulary bloom! 🌻"
        />
        {practiceNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
            <div className="relative bg-card rounded-2xl border border-border/30 shadow-2xl max-w-md w-full p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-hand text-lg">Garden Update</h3>
                  <p className="font-hand-secondary text-sm text-muted-foreground">
                    {practiceNotice}
                  </p>
                </div>
                <button
                  onClick={() => setPracticeNotice(null)}
                  className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                  aria-label="Close notice"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== GARDEN STATS ===== */}
        <section className="mb-6">
          <GardenStats 
            totalWords={words.length}
            totalVocabulary={totalVocabulary}
            masteredWords={stageDistribution.tree}
            streakDays={streak}
            todayXP={xp}
            waterProgress={waterProgress}
          />
        </section>

        {/* ===== GARDEN GROWTH VISUALIZATION ===== */}
        <section className="mb-8">
          <SketchCard className="bg-gradient-to-br from-success/5 via-card to-warning/5 border-success/20 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-hand text-2xl flex items-center gap-2">
                  🌱 Your Garden is Thriving!
                </h2>
                <p className="font-hand-secondary text-muted-foreground">
                  <span className="text-accent font-medium">{words.length} learned</span> •
                  <span className="text-warning font-medium"> {stageDistribution.tree} mastered</span> •
                  <span className="text-muted-foreground"> {totalVocabulary} total words</span>
                </p>
              </div>
              
              <SketchButton 
                variant="accent" 
                onClick={async () => {
                  const response = await startPractice();
                  if (response.success && response.words && response.words.length > 0) {
                    setPracticeWords(response.words);
                    setPracticeIntro(response.content ?? null);
                    setPracticeNotice(null);
                    setPracticeMode(true);
                    setCurrentPracticeIndex(0);
                    setShowAnswer(false);
                    setEarnedXP(0);
                    return;
                  }

                  const notice =
                    response.content ||
                    response.error ||
                    "No words are ready for practice yet. Try again later.";
                  setPracticeNotice(notice);
                  setPracticeMode(false);
                }}
                className="group shrink-0"
              >
                <Droplets size={16} className="group-hover:animate-bounce" />
                Water Your Garden
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </SketchButton>
            </div>

            <GrowthVisualization 
              distribution={stageDistribution}
              totalWords={words.length}
            />
          </SketchCard>
        </section>

        {/* ===== PRACTICE MODE MODAL ===== */}
        {practiceMode && currentPracticeWord && (
          <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl border-2 border-accent/30 shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-scale relative">
              {/* XP Popup */}
              {showXPPopup && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                  <div className="animate-fade-in-up flex items-center gap-2 px-4 py-2 bg-warning rounded-full text-warning-foreground font-hand text-xl">
                    <Sparkles size={20} />
                    +{currentStageInfo.xpBonus} XP!
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="bg-gradient-to-r from-accent/20 via-success/10 to-warning/10 p-4 border-b border-border/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-accent/20 rounded-full">
                      <Droplets className="text-accent" size={18} />
                    </div>
                    <span className="font-hand text-lg">Watering Time!</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-warning/20 rounded-full">
                      <Sparkles size={12} className="text-warning" />
                      <span className="font-hand-secondary text-xs text-warning">+{earnedXP} XP</span>
                    </div>
                    <button 
                      onClick={() => { setPracticeMode(false); setCurrentPracticeIndex(0); setShowAnswer(false); setEarnedXP(0); setPracticeWords([]); setPracticeIntro(null); }}
                      className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                {practiceIntro && (
                  <p className="font-hand-secondary text-sm text-muted-foreground">
                    {practiceIntro}
                  </p>
                )}
                
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent via-success to-warning rounded-full transition-all duration-500"
                      style={{ width: `${((currentPracticeIndex + 1) / practiceWords.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-hand-secondary text-sm text-muted-foreground whitespace-nowrap">
                    {currentPracticeIndex + 1}/{practiceWords.length}
                  </span>
                </div>
              </div>
              
              {/* Card content */}
              <div className="p-6 md:p-8">
                {/* Current growth stage */}
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border",
                    currentStageInfo.color,
                    currentStageInfo.bgColor
                  )}>
                    {currentStageInfo.icon}
                    <span className="font-hand-secondary text-sm">{currentStageInfo.label}</span>
                    <ChevronRight size={12} />
                    <span className="font-hand-secondary text-xs opacity-70">Next level</span>
                  </div>
                </div>
                
                {/* Word */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3 animate-bounce-subtle">📚</div>
                  <h3 className="font-hand text-4xl md:text-5xl mb-2">{currentPracticeWord.swahili}</h3>
                  
                  <button
                    onClick={() => playPronunciation(currentPracticeWord.swahili)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all"
                  >
                    <Volume2 size={16} />
                    <span className="font-hand-secondary">Listen</span>
                  </button>
                </div>
                
                {/* Answer reveal */}
                {!showAnswer ? (
                  <button 
                    onClick={() => setShowAnswer(true)}
                    className="w-full py-5 border-2 border-dashed border-accent/40 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                  >
                    <span className="font-hand-secondary text-muted-foreground group-hover:text-accent">
                      ✨ Tap to reveal meaning
                    </span>
                  </button>
                ) : (
                  <div className="animate-fade-in-up">
                    <div className="text-center mb-6 p-5 bg-gradient-to-br from-accent/10 to-success/5 rounded-xl border border-accent/20">
                      <p className="font-hand text-3xl md:text-4xl text-accent mb-2">{currentPracticeWord.english}</p>
                      <p className="font-hand-secondary text-sm text-muted-foreground italic">
                        &quot;Practice makes perfect&quot;
                      </p>
                    </div>
                    
                    <p className="font-hand-secondary text-center text-sm text-muted-foreground mb-4">
                      Did you remember this word?
                    </p>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handlePracticeAnswer(false)}
                        disabled={isProcessing}
                        className={cn(
                          "flex-1 py-4 bg-destructive/10 hover:bg-destructive/20 border-2 border-destructive/30 rounded-xl flex items-center justify-center gap-2 text-destructive transition-all hover:scale-[1.02]",
                          isProcessing && "opacity-50 cursor-not-allowed transform-none"
                        )}
                      >
                        <X size={20} />
                        <span className="font-hand-secondary">Still learning</span>
                      </button>
                      <button 
                        onClick={() => handlePracticeAnswer(true)}
                        disabled={isProcessing}
                        className={cn(
                          "flex-1 py-4 bg-success/10 hover:bg-success/20 border-2 border-success/30 rounded-xl flex items-center justify-center gap-2 text-success transition-all hover:scale-[1.02]",
                          isProcessing && "opacity-50 cursor-not-allowed transform-none"
                        )}
                      >
                        {isProcessing ? (
                          <Sparkles size={20} className="animate-spin" />
                        ) : (
                          <Check size={20} />
                        )}
                        <span className="font-hand-secondary">
                          {isProcessing ? "Growing..." : "Got it! 🌱"}
                        </span>
                      </button>
                    </div>
                    
                    {/* XP reward preview */}
                    <p className="text-center mt-4 font-hand-secondary text-xs text-muted-foreground">
                      <Sparkles size={12} className="inline text-warning" /> Correct = +{currentStageInfo.xpBonus} XP & level up!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== CATEGORY FILTER ===== */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full border-2 transition-all font-hand-secondary text-sm",
                !selectedCategory 
                  ? "bg-accent text-accent-foreground border-accent shadow-md" 
                  : "bg-card border-border/30 hover:border-accent/50 hover:bg-accent/5"
              )}
            >
              All Words ({words.length})
            </button>
            
            {categories.map(cat => {
              const catWords = words.filter(w => w.category === cat);
              // Use a default emoji since we don't store emoji in DB yet, or check for common categories
              const emoji = "📚"; 
              
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full border-2 transition-all font-hand-secondary text-sm flex items-center gap-2",
                    selectedCategory === cat 
                      ? "bg-accent text-accent-foreground border-accent shadow-md" 
                      : "bg-card border-border/30 hover:border-accent/50 hover:bg-accent/5"
                  )}
                >
                  <span className="text-lg">{emoji}</span>
                  {cat} ({catWords.length})
                </button>
              );
            })}
          </div>
        </section>

        {/* ===== WORD CARDS GRID ===== */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWords.map((word, index) => (
            <WordCard 
              key={word.id}
              word={word}
              stageInfo={growthStages[word.stage as GrowthStage] ?? growthStages.seed}
              onToggleFavorite={handleToggleFavorite}
              onPlayAudio={playPronunciation}
              index={index}
            />
          ))}
          
          {/* Add new word card */}
          <div 
            className="border-2 border-dashed border-border/50 bg-muted/10 rounded-2xl flex items-center justify-center min-h-[280px] group cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all"
          >
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                <Zap className="text-accent" size={28} />
              </div>
              <p className="font-hand text-xl mb-1">Plant New Word</p>
              <p className="font-hand-secondary text-sm text-muted-foreground">Complete lessons to grow your garden</p>
            </div>
          </div>
        </section>
      </AppLayout>
    </ProtectedRoute>
  );
}
