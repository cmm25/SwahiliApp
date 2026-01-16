'use client';

import { useCallback } from "react";

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
  const prefetch = useCallback((path: string) => {
    if (prefetchedRoutes.has(path)) return;
    
    const loader = routeComponents[path];
    if (loader) {
      prefetchedRoutes.add(path);
      // Delay prefetch slightly to not block hover interaction
      requestIdleCallback?.(() => loader()) ?? setTimeout(() => loader(), 100);
    }
  }, []);

  return { prefetch };
}
