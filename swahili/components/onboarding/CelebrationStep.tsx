'use client';

import { useEffect, useState } from "react";
import { SketchButton } from "@/components/shared/SketchButton";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Sparkles } from "lucide-react";
import Confetti from "react-confetti";

interface CelebrationStepProps {
  displayName: string;
  selectedAvatar: string;
}

export function CelebrationStep({ displayName, selectedAvatar }: CelebrationStepProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <div className="text-center animate-fade-in-up">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
      />
      
      <div className="mb-8 relative inline-block">
        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
        <ProfileAvatar avatarId={selectedAvatar} size="xl" className="relative z-10 scale-125" />
      </div>

      <h2 className="font-hand text-4xl md:text-5xl mb-4">
        Karibu, <span className="text-accent">{displayName}</span>! 🎉
      </h2>
      
      <p className="font-hand-secondary text-xl text-muted-foreground mb-8 max-w-md mx-auto">
        Your profile is ready. Get ready to start your Swahili learning adventure!
      </p>

      <div className="flex justify-center gap-2 text-sm text-muted-foreground font-hand-secondary animate-bounce">
        <Sparkles className="text-warning" size={16} />
        Redirecting to dashboard...
      </div>
    </div>
  );
}
