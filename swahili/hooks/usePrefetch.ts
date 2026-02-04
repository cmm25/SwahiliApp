'use client';

import { useCallback } from "react";
import { useRouter } from "next/navigation";

// Route to component mapping for prefetching
const routeComponents: Record<string, () => Promise<unknown>> = {
  "/": () => import("@/app/page"),
  "/auth": () => import("@/app/auth/page"),
  "/onboarding": () => import("@/app/onboarding/page"),
  "/dashboard": () => import("@/app/dashboard/page"),
  "/lessons": () => import("@/app/lessons/page"),
  "/conversation": () => import("@/app/conversation/page"),
  "/vocabulary": () => import("@/app/vocabulary/page"),
  "/profile": () => import("@/app/profile/page"),
};

// Cache to prevent duplicate prefetches
const prefetchedRoutes = new Set<string>();

export function usePrefetch() {
  const router = useRouter();

  const prefetch = useCallback((path: string) => {
    if (prefetchedRoutes.has(path)) return;
    
    const loader = routeComponents[path];
    if (loader) {
      prefetchedRoutes.add(path);
      router.prefetch(path);
      // Delay prefetch slightly to not block hover interaction
      requestIdleCallback?.(() => loader()) ?? setTimeout(() => loader(), 100);
    }
  }, [router]);

  return { prefetch };
}
