'use client';

import { ArrowRight, Sparkles } from "lucide-react";
import { SketchButton } from "@/components/shared/SketchButton";
import { useEffect, useState } from "react";

interface WelcomeStepProps {
  onNext: () => void;
}

const swahiliWords = [
  { word: "Jambo", meaning: "Hello" },
  { word: "Asante", meaning: "Thank you" },
  { word: "Habari", meaning: "How are you" },
  { word: "Rafiki", meaning: "Friend" },
  { word: "Safari", meaning: "Journey" },
];

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % swahiliWords.length);
        setIsAnimating(false);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const currentWord = swahiliWords[currentWordIndex];

  return (
    <div className="text-center max-w-lg mx-auto">
      {/* Animated greeting */}
      <div className="mb-8 h-32 flex flex-col items-center justify-center">
        <div
          className={`transition-all duration-300 ${
            isAnimating ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        >
          <h1 className="font-hand text-6xl md:text-7xl text-accent mb-2 animate-wiggle">
            {currentWord.word}!
          </h1>
          <p className="font-hand-secondary text-xl text-muted-foreground">
            ({currentWord.meaning})
          </p>
        </div>
      </div>

      {/* Word bubbles floating */}
      <div className="relative h-20 mb-8">
        {swahiliWords.map((word, index) => (
          <span
            key={word.word}
            className={`absolute px-3 py-1 sketch-border bg-card font-hand-secondary text-sm
              transition-all duration-500 ${
                index === currentWordIndex
                  ? "opacity-0 scale-0"
                  : "opacity-60 scale-100"
              }`}
            style={{
              left: `${15 + index * 17}%`,
              top: `${Math.sin(index) * 20 + 30}%`,
              transform: `rotate(${(index - 2) * 5}deg)`,
              animationDelay: `${index * 0.2}s`,
            }}
          >
            {word.word}
          </span>
        ))}
      </div>

      <div className="space-y-4 animate-fade-in-up stagger-2">
        <p className="font-hand text-3xl text-foreground">
          Welcome to <span className="text-accent">Jifunze</span>
        </p>
        <p className="font-hand-secondary text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Your personal AI companion for mastering Swahili. Let's set up your profile and begin your journey!
        </p>
      </div>

      <div className="mt-10 animate-fade-in-up stagger-4">
        <SketchButton
          variant="accent"
          size="lg"
          onClick={onNext}
          className="group"
        >
          <span className="flex items-center gap-2">
            Twende! (Let's go!)
            <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
          </span>
        </SketchButton>
        
        <div className="flex justify-center gap-2 mt-4">
          <Sparkles className="text-accent animate-pulse" size={16} />
          <span className="font-hand-secondary text-sm text-muted-foreground">
            Takes less than a minute
          </span>
          <Sparkles className="text-accent animate-pulse" size={16} />
        </div>
      </div>
    </div>
  );
}
