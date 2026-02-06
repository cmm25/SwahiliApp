import { cn } from "@/lib/utils";
import { Heart, Check, Sparkles, Star, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { UserWord } from "@/lib/agents/teaching-shared";

interface WordCardProps {
  word: UserWord;
  stageInfo: {
    icon: React.ReactNode;
    label: string;
    color: string;
    bgColor: string;
  };
  onToggleFavorite: (word: UserWord) => void;
  onPlayAudio?: (text: string) => void;
  onAdd?: (word: UserWord) => void;
  index: number;
}

export function WordCard({ word, stageInfo, onToggleFavorite, onPlayAudio, onAdd, index }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const isLearned = Boolean(word.userVocabId);

  const lastReviewedLabel = useMemo(() => {
    if (!isLearned) return "New word";
    const source = word.last_reviewed_at ?? word.created_at;
    if (!source) {
      return "Not reviewed";
    }
    const date = new Date(source);
    if (Number.isNaN(date.getTime())) {
      return "Not reviewed";
    }
    return date.toLocaleDateString();
  }, [word.last_reviewed_at, word.created_at]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 800);
    }
  };

  const isMastered = word.growth_stage === "tree";
  const isFlowering = word.growth_stage === "flower";

  return (
    <div 
      className="perspective-1000 cursor-pointer group"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={handleFlip}
    >
      <div 
        className={cn(
          "relative transition-all duration-500 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front of card */}
        <div className={cn(
          "relative backface-hidden rounded-2xl border-2 overflow-hidden transition-all duration-300",
          "hover:scale-[1.02] hover:shadow-lg",
          isMastered && "border-warning/50 bg-gradient-to-br from-warning/10 via-card to-warning/5",
          isFlowering && "border-accent/50 bg-gradient-to-br from-accent/10 via-card to-accent/5",
          !isMastered && !isFlowering && "border-border/40 bg-card"
        )}>
          {/* Decorative corner glow for mastered words */}
          {isMastered && (
            <>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-warning/20 rounded-full blur-2xl" />
              <div className="absolute top-2 right-2">
                <Star size={16} className="text-warning fill-warning animate-pulse-glow" />
              </div>
            </>
          )}

          {/* Stage badge */}
          <div className="absolute top-3 right-3 z-10">
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-hand-secondary border transition-transform",
              stageInfo.color,
              stageInfo.bgColor,
              "group-hover:scale-110"
            )}>
              {stageInfo.icon}
              <span>{stageInfo.label}</span>
            </div>
          </div>

          {/* Favorite heart */}
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(word); }}
            className={cn(
              "absolute top-3 left-3 z-10 transition-all duration-300",
              word.is_favorite ? "scale-100" : "scale-0 group-hover:scale-100"
            )}
          >
            <Heart 
              size={20} 
              className={cn(
                "transition-all duration-300",
                word.is_favorite 
                  ? "fill-destructive text-destructive animate-bounce-subtle" 
                  : "text-muted-foreground hover:text-destructive hover:scale-110"
              )} 
            />
          </button>

          {/* Main content */}
          <div className="pt-10 pb-4 px-4">
            {/* Emoji with animation */}
            <div className="relative w-20 h-20 mx-auto mb-3">
              <div className={cn(
                "text-5xl flex items-center justify-center w-full h-full rounded-2xl transition-transform duration-500",
                "bg-gradient-to-br from-muted/30 to-muted/10",
                "group-hover:scale-110 group-hover:rotate-3"
              )}>
                📚
              </div>
              
              {/* Sparkle effect */}
              {showSparkle && (
                <div className="absolute -top-1 -right-1 animate-ping">
                  <Sparkles size={16} className="text-warning" />
                </div>
              )}
            </div>

            {/* Word */}
            <h3 className="font-hand text-3xl text-center mb-1 group-hover:text-accent transition-colors">
              {word.swahili}
            </h3>
            
            <p className="font-hand-secondary text-accent text-lg text-center mb-3">
              {word.english}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {onPlayAudio && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio(word.swahili);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30"
                >
                  <Volume2 size={14} />
                  <span className="font-hand-secondary text-sm">Listen</span>
                </button>
              )}

              {!isLearned && onAdd && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(word);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-success/10 text-success hover:bg-success/20 transition-colors rounded-lg border border-success/20"
                >
                  <Sparkles size={14} />
                  <span className="font-hand-secondary text-sm">Start Learning</span>
                </button>
              )}
            </div>

            {/* Stats footer - Only show if learned */}
            {isLearned && (
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/20">
                <span className="font-hand-secondary text-xs text-muted-foreground">
                  {lastReviewedLabel}
                </span>
                
                {/* Times correct with progress ring */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <svg className="w-6 h-6 -rotate-90">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="hsl(var(--muted) / 0.3)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="hsl(var(--success))"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="0 63"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <Check size={10} className="absolute inset-0 m-auto text-success" />
                  </div>
                  <span className="font-hand-secondary text-xs text-success font-medium">
                    —
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tap to flip hint */}
          <div className="absolute bottom-0 left-0 right-0 text-center py-1.5 bg-gradient-to-t from-muted/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="font-hand-secondary text-xs text-muted-foreground">Tap to see {isLearned ? "stats" : "details"}</span>
          </div>
        </div>

        {/* Back of card (shown when flipped) */}
        <div className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-card p-5",
          "flex flex-col items-center justify-center text-center"
        )}>
          {isLearned ? (
            <>
              <h4 className="font-hand text-xl text-accent mb-4">Garden Stats 📊</h4>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm w-full mb-4">
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-xs font-hand-secondary">Ease Factor</span>
                  <span className="font-bold text-foreground">{word.ease_factor.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-xs font-hand-secondary">Interval</span>
                  <span className="font-bold text-foreground">{word.interval_days}d</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-xs font-hand-secondary">Streak</span>
                  <span className="font-bold text-foreground">{word.repetitions} 🔥</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground text-xs font-hand-secondary">Accuracy</span>
                  <span className="font-bold text-foreground">
                    {word.correct_count + word.incorrect_count > 0 
                      ? `${Math.round((word.correct_count / (word.correct_count + word.incorrect_count)) * 100)}%`
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="w-full pt-3 border-t border-border/20">
                <p className="text-xs font-hand-secondary text-muted-foreground mb-1">Next Review:</p>
                <p className="font-medium text-accent">
                  {word.next_review_at 
                    ? new Date(word.next_review_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                    : "Ready now!"}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="font-hand text-xl text-center text-accent leading-relaxed mb-4">
                "{word.english}"
              </p>
              <p className="font-hand-secondary text-sm text-muted-foreground mb-6">
                Not yet in your garden
              </p>
              {onAdd && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(word);
                  }}
                  className="px-6 py-2 bg-success text-success-foreground rounded-full font-hand shadow-lg hover:scale-105 transition-transform"
                >
                  Start Learning
                </button>
              )}
            </div>
          )}

          <p className="font-hand-secondary text-xs text-muted-foreground mt-auto">Tap to flip back</p>
        </div>
      </div>
    </div>
  );
}
