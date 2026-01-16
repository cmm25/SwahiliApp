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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SketchButton } from "@/components/shared/SketchButton";
import { SketchCard } from "@/components/shared/SketchCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Word growth stages - like a garden!
type GrowthStage = "seed" | "sprout" | "sapling" | "flower" | "tree";

interface Word {
  id: number;
  swahili: string;
  english: string;
  pronunciation: string;
  example: string;
  category: string;
  categoryEmoji: string;
  stage: GrowthStage;
  lastReviewed: string;
  timesCorrect: number;
  isFavorite: boolean;
}

const growthStages: Record<GrowthStage, { icon: React.ReactNode; label: string; color: string; bgColor: string; xpBonus: number }> = {
  seed: { icon: <Droplets size={14} />, label: "Seed", color: "text-muted-foreground", bgColor: "bg-muted/30 border-muted/50", xpBonus: 5 },
  sprout: { icon: <Leaf size={14} />, label: "Sprout", color: "text-success/70", bgColor: "bg-success/10 border-success/30", xpBonus: 10 },
  sapling: { icon: <Leaf size={14} />, label: "Sapling", color: "text-success", bgColor: "bg-success/20 border-success/40", xpBonus: 15 },
  flower: { icon: <Flower2 size={14} />, label: "Blooming", color: "text-accent", bgColor: "bg-accent/20 border-accent/40", xpBonus: 20 },
  tree: { icon: <TreeDeciduous size={14} />, label: "Mastered", color: "text-warning", bgColor: "bg-warning/20 border-warning/40", xpBonus: 25 },
};

// Sample vocabulary data with growth stages
const initialWords: Word[] = [
  { id: 1, swahili: "Simba", english: "Lion", pronunciation: "SEEM-bah", example: "Simba ni mfalme wa wanyama.", category: "Wanyama", categoryEmoji: "🦁", stage: "tree", lastReviewed: "Today", timesCorrect: 12, isFavorite: true },
  { id: 2, swahili: "Upendo", english: "Love", pronunciation: "oo-PEN-doh", example: "Upendo ni nguvu kubwa.", category: "Hisia", categoryEmoji: "❤️", stage: "flower", lastReviewed: "Yesterday", timesCorrect: 8, isFavorite: true },
  { id: 3, swahili: "Nyumba", english: "House", pronunciation: "NYOOM-bah", example: "Nyumba yangu ni kubwa.", category: "Mahali", categoryEmoji: "🏠", stage: "sapling", lastReviewed: "2 days ago", timesCorrect: 5, isFavorite: false },
  { id: 4, swahili: "Maji", english: "Water", pronunciation: "MAH-jee", example: "Maji ni muhimu kwa maisha.", category: "Chakula", categoryEmoji: "💧", stage: "sprout", lastReviewed: "3 days ago", timesCorrect: 3, isFavorite: false },
];

// Garden stats
const gardenStats = {
  totalWords: 156,
  seeds: 23,
  sprouts: 45,
  saplings: 38,
  flowers: 32,
  trees: 18,
  streakDays: 7,
  waterDrops: 85,
  todayXP: 145,
};

export default function Vocabulary() {
  const [words, setWords] = useState<Word[]>(initialWords);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showXPPopup, setShowXPPopup] = useState(false);

  const categories = [...new Set(words.map(w => w.category))];
  const filteredWords = selectedCategory ? words.filter(w => w.category === selectedCategory) : words;

  // Practice mode handlers
  const wordsNeedingWater = words.filter(w => w.stage !== "tree" || w.lastReviewed !== "Today");
  const currentPracticeWord = wordsNeedingWater[currentPracticeIndex];

  const handlePracticeAnswer = (correct: boolean) => {
    if (correct && currentPracticeWord) {
      const xp = growthStages[currentPracticeWord.stage].xpBonus;
      setEarnedXP(prev => prev + xp);
      setShowXPPopup(true);
      setTimeout(() => setShowXPPopup(false), 1000);

      setWords(prev => prev.map(w => {
        if (w.id === currentPracticeWord.id) {
          const stages: GrowthStage[] = ["seed", "sprout", "sapling", "flower", "tree"];
          const currentIndex = stages.indexOf(w.stage);
          const newStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : w.stage;
          return { ...w, stage: newStage, timesCorrect: w.timesCorrect + 1, lastReviewed: "Today" };
        }
        return w;
      }));
    }
    
    setShowAnswer(false);
    if (currentPracticeIndex < wordsNeedingWater.length - 1) {
      setCurrentPracticeIndex(prev => prev + 1);
    } else {
      setPracticeMode(false);
      setCurrentPracticeIndex(0);
    }
  };

  const toggleFavorite = (id: number) => {
    setWords(prev => prev.map(w => w.id === id ? { ...w, isFavorite: !w.isFavorite } : w));
  };

  // Growth stage distribution for visual garden
  const stageDistribution = {
    seed: words.filter(w => w.stage === "seed").length,
    sprout: words.filter(w => w.stage === "sprout").length,
    sapling: words.filter(w => w.stage === "sapling").length,
    flower: words.filter(w => w.stage === "flower").length,
    tree: words.filter(w => w.stage === "tree").length,
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* ... (rest of the component) ... */}
        {/* Note: I'll preserve the full component content here but wrapped in ProtectedRoute */}
        <PageHeader 
          title="Bustani ya Maneno" 
          subtitle="Your Word Garden — Watch your vocabulary bloom! 🌻"
        />

        {/* ===== GARDEN STATS ===== */}
        <section className="mb-6">
          <GardenStats 
            totalWords={gardenStats.totalWords}
            masteredWords={gardenStats.trees}
            streakDays={gardenStats.streakDays}
            todayXP={gardenStats.todayXP + earnedXP}
            waterProgress={gardenStats.waterDrops}
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
                  <span className="text-accent font-medium">{gardenStats.totalWords} words</span> planted • 
                  <span className="text-warning font-medium"> {gardenStats.trees} fully mastered!</span>
                </p>
              </div>
              
              <SketchButton 
                variant="accent" 
                onClick={() => setPracticeMode(true)}
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
                    +{growthStages[currentPracticeWord.stage].xpBonus} XP!
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
                      onClick={() => { setPracticeMode(false); setCurrentPracticeIndex(0); setShowAnswer(false); setEarnedXP(0); }}
                      className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent via-success to-warning rounded-full transition-all duration-500"
                      style={{ width: `${((currentPracticeIndex + 1) / wordsNeedingWater.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-hand-secondary text-sm text-muted-foreground whitespace-nowrap">
                    {currentPracticeIndex + 1}/{wordsNeedingWater.length}
                  </span>
                </div>
              </div>
              
              {/* Card content */}
              <div className="p-6 md:p-8">
                {/* Current growth stage */}
                <div className="flex justify-center mb-4">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border",
                    growthStages[currentPracticeWord.stage].color,
                    growthStages[currentPracticeWord.stage].bgColor
                  )}>
                    {growthStages[currentPracticeWord.stage].icon}
                    <span className="font-hand-secondary text-sm">{growthStages[currentPracticeWord.stage].label}</span>
                    <ChevronRight size={12} />
                    <span className="font-hand-secondary text-xs opacity-70">Next level</span>
                  </div>
                </div>
                
                {/* Word */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3 animate-bounce-subtle">{currentPracticeWord.categoryEmoji}</div>
                  <h3 className="font-hand text-4xl md:text-5xl mb-2">{currentPracticeWord.swahili}</h3>
                  
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all">
                    <Volume2 size={16} />
                    <span className="font-hand-secondary">{currentPracticeWord.pronunciation}</span>
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
                      <p className="font-hand-secondary text-sm text-muted-foreground italic">"{currentPracticeWord.example}"</p>
                    </div>
                    
                    <p className="font-hand-secondary text-center text-sm text-muted-foreground mb-4">
                      Did you remember this word?
                    </p>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handlePracticeAnswer(false)}
                        className="flex-1 py-4 bg-destructive/10 hover:bg-destructive/20 border-2 border-destructive/30 rounded-xl flex items-center justify-center gap-2 text-destructive transition-all hover:scale-[1.02]"
                      >
                        <X size={20} />
                        <span className="font-hand-secondary">Still learning</span>
                      </button>
                      <button 
                        onClick={() => handlePracticeAnswer(true)}
                        className="flex-1 py-4 bg-success/10 hover:bg-success/20 border-2 border-success/30 rounded-xl flex items-center justify-center gap-2 text-success transition-all hover:scale-[1.02]"
                      >
                        <Check size={20} />
                        <span className="font-hand-secondary">Got it! 🌱</span>
                      </button>
                    </div>
                    
                    {/* XP reward preview */}
                    <p className="text-center mt-4 font-hand-secondary text-xs text-muted-foreground">
                      <Sparkles size={12} className="inline text-warning" /> Correct = +{growthStages[currentPracticeWord.stage].xpBonus} XP & level up!
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
              const emoji = catWords[0]?.categoryEmoji || "📚";
              
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
              stageInfo={growthStages[word.stage]}
              onToggleFavorite={toggleFavorite}
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
