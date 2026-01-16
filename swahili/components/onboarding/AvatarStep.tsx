'use client';

import { SketchButton } from "@/components/shared/SketchButton";
import { SketchCard } from "@/components/shared/SketchCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { AvatarSelector } from "@/components/profile/AvatarSelector";

interface AvatarStepProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AvatarStep({ selectedAvatar, onSelect, onNext, onBack }: AvatarStepProps) {
  return (
    <SketchCard className="w-full max-w-2xl animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="font-hand text-3xl md:text-4xl mb-3">Choose Your Spirit Animal 🦁</h2>
        <p className="font-hand-secondary text-muted-foreground">
          Select an avatar to represent you on your journey
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/10 blur-xl rounded-full" />
          <ProfileAvatar avatarId={selectedAvatar} size="xl" className="relative z-10 scale-110" />
        </div>

        <div className="w-full">
          <AvatarSelector 
            selectedAvatar={selectedAvatar} 
            onSelect={onSelect} 
            size="lg"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-border/10">
        <SketchButton variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft size={20} /> Back
        </SketchButton>
        <SketchButton variant="accent" onClick={onNext} className="gap-2">
          Next <ArrowRight size={20} />
        </SketchButton>
      </div>
    </SketchCard>
  );
}
