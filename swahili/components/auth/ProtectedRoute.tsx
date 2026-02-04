'use client';

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const needsOnboarding = user && !profileLoading && (!profile || !profile.onboarding_completed);

  // Handle redirects
  useEffect(() => {
    // Wait for initial load
    if (authLoading || profileLoading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    // Redirect to onboarding if profile is incomplete (unless already on onboarding page)
    if (needsOnboarding && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }

  }, [user, authLoading, profileLoading, needsOnboarding, pathname, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-hand text-2xl text-accent animate-pulse">Jifunze</h2>
          <p className="font-hand-secondary text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  if (needsOnboarding && pathname !== "/onboarding") {
    return null; 
  }

  return <>{children}</>;
}
