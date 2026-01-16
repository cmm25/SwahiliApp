'use client';

import { useCallback } from "react";

// Route to component mapping for prefetching
const routeComponents: Record<string, () => Promise<unknown>> = {
  "/": () => import("@/pages/Index"),
  "/auth": () => import("@/pages/Auth"),
  "/onboarding": () => import("@/pages/Onboarding"),
  "/dashboard": () => import("@/pages/Dashboard"),
  "/lessons": () => import("@/pages/Lessons"),
  "/conversation": () => import("@/pages/Conversation"),
  "/vocabulary": () => import("@/pages/Vocabulary"),
  "/profile": () => import("@/pages/Profile"),
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
