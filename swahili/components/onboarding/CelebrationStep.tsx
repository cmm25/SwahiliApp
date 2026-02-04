'use client';

import { useEffect, useState } from "react";
import { SketchButton } from "@/components/shared/SketchButton";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Sparkles } from "lucide-react";
import Confetti from "react-confetti";

import {
  AnimatedConfetti,
  AnimatedTrophyCup,
  AnimatedFireworks,
  AnimatedRibbon,
  FloatingElement,
  AnimatedSparkle
} from "@/components/shared/AnimatedDoodles";

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
    <div className="text-center animate-fade-in-up relative">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
      />

      {/* Celebration decorations */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <AnimatedConfetti className="w-40 h-40 text-accent" />
      </div>
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-30 hidden md:block pointer-events-none">
        <FloatingElement delay={0.3}>
          <AnimatedFireworks className="w-24 h-24 text-foreground" />
        </FloatingElement>
      </div>
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 opacity-30 hidden md:block pointer-events-none">
        <FloatingElement delay={0.6}>
          <AnimatedRibbon className="w-20 h-32 text-accent" />
        </FloatingElement>
      </div>
      
      <div className="mb-8 relative inline-block">
        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
        <ProfileAvatar avatarId={selectedAvatar} size="xl" className="relative z-10 scale-125" />
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <AnimatedTrophyCup className="w-12 h-16 text-accent hidden sm:block" />
        <h2 className="font-hand text-4xl md:text-5xl">
          Karibu, <span className="text-accent">{displayName}</span>! 🎉
        </h2>
      </div>
      
      {/* Multiple floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <AnimatedSparkle 
          key={i}
          className="absolute text-accent pointer-events-none hidden sm:block"
          delay={1 + i * 0.3}
          size={12 + Math.random() * 8}
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}
      
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
