'use client';

import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="relative">
          {/* Connector line */}
          {i < totalSteps - 1 && (
            <div
              className={cn(
                "absolute top-1/2 left-full w-8 h-0.5 -translate-y-1/2 transition-all duration-500",
                currentStep > i ? "bg-accent" : "bg-muted"
              )}
            />
          )}
          
          {/* Step dot */}
          <div
            className={cn(
              "relative w-4 h-4 rounded-full transition-all duration-500 flex items-center justify-center",
              currentStep === i && "scale-150",
              currentStep >= i ? "bg-accent" : "bg-muted"
            )}
          >
            {currentStep > i && (
              <span className="text-[8px] text-accent-foreground font-bold animate-fade-in-scale">✓</span>
            )}
            {currentStep === i && (
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-50" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
