'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AnimatedBackground } from "@/components/onboarding/AnimatedBackground";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { AvatarStep } from "@/components/onboarding/AvatarStep";
import { NameStep } from "@/components/onboarding/NameStep";
import { CelebrationStep } from "@/components/onboarding/CelebrationStep";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useProfile } from "@/hooks/useProfile";

type OnboardingStep = "welcome" | "avatar" | "name" | "complete";

const STEPS: OnboardingStep[] = ["welcome", "avatar", "name", "complete"];

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedAvatar, setSelectedAvatar] = useState("lion");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { updateProfile } = useProfile();

  const currentStepIndex = STEPS.indexOf(step);

  const transitionTo = (nextStep: OnboardingStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
    }, 300);
  };

  const handleComplete = async () => {
    if (!displayName.trim()) {
      toast({
        variant: "destructive",
        title: "Jina Linahitajika (Name Required)",
        description: "Please enter your display name to continue.",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await updateProfile({
      display_name: displayName.trim(),
      avatar: selectedAvatar,
      onboarding_completed: true,
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error.message || "Please try again.",
      });
      setIsLoading(false);
      return;
    }

    transitionTo("complete");

    setTimeout(() => {
      toast({
        title: "Karibu sana! (Welcome!)",
        description: "Your profile is all set. Let's start learning!",
      });
      router.push("/dashboard");
    }, 2500);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground />

        {/* Progress indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <OnboardingProgress currentStep={currentStepIndex} totalSteps={STEPS.length} />
        </div>

        {/* Step content with transitions */}
        <div
          className={`w-full max-w-2xl transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
        >
          {step === "welcome" && (
            <WelcomeStep onNext={() => transitionTo("avatar")} />
          )}

          {step === "avatar" && (
            <AvatarStep
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
              onNext={() => transitionTo("name")}
              onBack={() => transitionTo("welcome")}
            />
          )}

          {step === "name" && (
            <NameStep
              selectedAvatar={selectedAvatar}
              displayName={displayName}
              onNameChange={setDisplayName}
              onComplete={handleComplete}
              onBack={() => transitionTo("avatar")}
              isLoading={isLoading}
            />
          )}

          {step === "complete" && (
            <CelebrationStep
              displayName={displayName}
              selectedAvatar={selectedAvatar}
            />
          )}
        </div>

        {/* Skip option removed to enforce onboarding */}
      </div>
    </ProtectedRoute>
  );
}
