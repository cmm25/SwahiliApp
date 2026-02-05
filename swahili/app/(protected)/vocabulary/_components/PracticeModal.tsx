import { Check, ChevronRight, Droplets, Sparkles, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserWord } from "@/lib/agents/teaching-shared";

interface StageInfo {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  xpBonus: number;
}

interface PracticeModalProps {
  isOpen: boolean;
  word: UserWord | undefined;
  stageInfo: StageInfo;
  showXPPopup: boolean;
  earnedXP: number;
  practiceIntro: string | null;
  currentIndex: number;
  totalCount: number;
  showAnswer: boolean;
  isProcessing: boolean;
  onReveal: () => void;
  onAnswer: (correct: boolean) => void;
  onClose: () => void;
  onPlayPronunciation: (text: string) => void;
}

export function PracticeModal({
  isOpen,
  word,
  stageInfo,
  showXPPopup,
  earnedXP,
  practiceIntro,
  currentIndex,
  totalCount,
  showAnswer,
  isProcessing,
  onReveal,
  onAnswer,
  onClose,
  onPlayPronunciation,
}: PracticeModalProps) {
  if (!isOpen || !word) return null;

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border-2 border-accent/30 shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-scale relative">
        {showXPPopup && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="animate-fade-in-up flex items-center gap-2 px-4 py-2 bg-warning rounded-full text-warning-foreground font-hand text-xl">
              <Sparkles size={20} />
              +{stageInfo.xpBonus} XP!
            </div>
          </div>
        )}

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
                onClick={onClose}
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

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent via-success to-warning rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
              />
            </div>
            <span className="font-hand-secondary text-sm text-muted-foreground whitespace-nowrap">
              {currentIndex + 1}/{totalCount}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex justify-center mb-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border",
              stageInfo.color,
              stageInfo.bgColor
            )}>
              {stageInfo.icon}
              <span className="font-hand-secondary text-sm">{stageInfo.label}</span>
              <ChevronRight size={12} />
              <span className="font-hand-secondary text-xs opacity-70">Next level</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-3 animate-bounce-subtle">📚</div>
            <h3 className="font-hand text-4xl md:text-5xl mb-2">{word.swahili}</h3>

            <button
              onClick={() => onPlayPronunciation(word.swahili)}
              className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all"
            >
              <Volume2 size={16} />
              <span className="font-hand-secondary">Listen</span>
            </button>
          </div>

          {!showAnswer ? (
            <button
              onClick={onReveal}
              className="w-full py-5 border-2 border-dashed border-accent/40 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <span className="font-hand-secondary text-muted-foreground group-hover:text-accent">
                ✨ Tap to reveal meaning
              </span>
            </button>
          ) : (
            <div className="animate-fade-in-up">
              <div className="text-center mb-6 p-5 bg-gradient-to-br from-accent/10 to-success/5 rounded-xl border border-accent/20">
                <p className="font-hand text-3xl md:text-4xl text-accent mb-2">{word.english}</p>
                <p className="font-hand-secondary text-sm text-muted-foreground italic">
                  &quot;Practice makes perfect&quot;
                </p>
              </div>

              <p className="font-hand-secondary text-center text-sm text-muted-foreground mb-4">
                Did you remember this word?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => onAnswer(false)}
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
                  onClick={() => onAnswer(true)}
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

              <p className="text-center mt-4 font-hand-secondary text-xs text-muted-foreground">
                <Sparkles size={12} className="inline text-warning" /> Correct = +{stageInfo.xpBonus} XP & level up!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
