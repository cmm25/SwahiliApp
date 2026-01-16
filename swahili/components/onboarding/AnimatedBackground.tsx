'use client';

import { FloatingElement } from "@/components/shared/FloatingElement";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top Left */}
      <FloatingElement className="absolute top-10 left-10 opacity-20" delay={0}>
        <div className="w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
      </FloatingElement>
      
      {/* Bottom Right */}
      <FloatingElement className="absolute bottom-10 right-10 opacity-20" delay={1} reverse>
        <div className="w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
      </FloatingElement>

      {/* Decorative Shapes */}
      <FloatingElement className="absolute top-1/4 right-1/4 opacity-10" delay={0.5}>
        <div className="w-12 h-12 sketch-border rotate-12" />
      </FloatingElement>
      
      <FloatingElement className="absolute bottom-1/3 left-1/4 opacity-10" delay={1.5} reverse>
        <div className="w-8 h-8 bg-accent/20 rounded-full" />
      </FloatingElement>
    </div>
  );
}
