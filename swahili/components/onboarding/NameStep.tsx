'use client';

import { ArrowLeft, Sparkles, User } from "lucide-react";
import { SketchButton } from "@/components/shared/SketchButton";
import { SketchCard } from "@/components/shared/SketchCard";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { useState, useEffect } from "react";

interface NameStepProps {
  selectedAvatar: string;
  displayName: string;
  onNameChange: (name: string) => void;
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const encouragements = [
  "Great name! 🌟",
  "Nzuri sana! (Very nice!) ✨",
  "Love it! 🎉",
  "Perfect choice! 💫",
];

export function NameStep({ 
  selectedAvatar, 
  displayName, 
  onNameChange, 
  onComplete, 
  onBack,
  isLoading 
}: NameStepProps) {
  const [encouragement, setEncouragement] = useState("");
  const [showEncouragement, setShowEncouragement] = useState(false);

  useEffect(() => {
    if (displayName.length >= 2) {
      const timer = setTimeout(() => {
        setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
        setShowEncouragement(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowEncouragement(false);
    }
  }, [displayName]);

  return (
    <SketchCard className="w-full max-w-lg animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="font-hand text-4xl text-foreground mb-2">Jina Lako Nani?</h2>
        <p className="font-hand-secondary text-muted-foreground">
          What's your name? This is how we'll greet you!
        </p>
      </div>

      {/* Avatar with name preview */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <ProfileAvatar avatarId={selectedAvatar} size="xl" />
          
          {/* Speech bubble */}
          <div className="absolute -right-4 top-0 translate-x-full">
            <div className="relative bg-card sketch-border px-4 py-2 animate-fade-in-scale">
              <div className="absolute left-0 top-4 -translate-x-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-border" />
              <p className="font-hand-secondary text-sm">
                {displayName ? `Habari, ${displayName}!` : "Habari!"}
              </p>
            </div>
          </div>
        </div>

        {/* Live preview name */}
        <div className="h-8 flex items-center justify-center">
          {displayName && (
            <p className="font-hand text-2xl text-accent animate-fade-in-scale">
              {displayName}
            </p>
          )}
        </div>
      </div>

      {/* Name input with animations */}
      <div className="space-y-3 mb-8">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <User size={20} />
          </div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Type your name..."
            className="w-full pl-12 pr-4 py-4 sketch-border bg-background font-hand-secondary text-lg focus:outline-none focus:border-accent transition-colors text-center"
            maxLength={30}
            autoFocus
          />
        </div>
        
        {/* Encouragement message */}
        <div className="h-6 flex items-center justify-center">
          {showEncouragement && (
            <p className="font-hand-secondary text-sm text-accent animate-fade-in-scale">
              {encouragement}
            </p>
          )}
        </div>

        {/* Character count */}
        <div className="flex justify-between items-center text-xs font-hand-secondary text-muted-foreground">
          <span>This is how other learners will see you</span>
          <span>{displayName.length}/30</span>
        </div>
      </div>

      <div className="flex justify-between">
        <SketchButton variant="outline" onClick={onBack} className="group" disabled={isLoading}>
          <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={18} />
          Rudi (Back)
        </SketchButton>
        <SketchButton 
          variant="accent" 
          onClick={onComplete}
          disabled={isLoading || !displayName.trim()}
          className="group"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse">Subiri...</span>
            </>
          ) : (
            <>
              Maliza! (Finish)
              <Sparkles className="ml-2 transition-transform group-hover:rotate-12" size={18} />
            </>
          )}
        </SketchButton>
      </div>
    </SketchCard>
  );
}
