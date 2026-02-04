'use client';

import React, { useEffect, useState } from 'react';

// AnimatedLine - Core drawing animation component
export const AnimatedLine = ({ 
  d, 
  delay = 0, 
  duration = 1.5,
  strokeWidth = 2,
  className = "" 
}: { 
  d: string; 
  delay?: number; 
  duration?: number;
  strokeWidth?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <path
      d={d}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        strokeDasharray: 1000,
        strokeDashoffset: isVisible ? 0 : 1000,
        transition: `stroke-dashoffset ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`,
      }}
    />
  );
};

// Learning & Education Components
export const AnimatedBrain = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main brain outline */}
      <AnimatedLine
        d="M100 20 Q 40 15, 30 60 Q 20 90, 35 120 Q 45 150, 100 160 Q 155 150, 165 120 Q 180 90, 170 60 Q 160 15, 100 20"
        delay={0.2}
        duration={1.8}
        strokeWidth={2.5}
      />

      {/* Brain folds - left side */}
      <AnimatedLine d="M50 50 Q 70 40, 85 55 Q 95 70, 75 80" delay={0.8} strokeWidth={2} />
      <AnimatedLine d="M40 85 Q 60 75, 80 90 Q 95 105, 70 115" delay={1} strokeWidth={2} />
      <AnimatedLine d="M55 120 Q 75 110, 90 125 Q 100 140, 80 145" delay={1.2} strokeWidth={2} />

      {/* Brain folds - right side */}
      <AnimatedLine d="M150 50 Q 130 40, 115 55 Q 105 70, 125 80" delay={0.9} strokeWidth={2} />
      <AnimatedLine d="M160 85 Q 140 75, 120 90 Q 105 105, 130 115" delay={1.1} strokeWidth={2} />
      <AnimatedLine d="M145 120 Q 125 110, 110 125 Q 100 140, 120 145" delay={1.3} strokeWidth={2} />

      {/* Center division */}
      <AnimatedLine d="M100 30 Q 95 80, 100 130 Q 105 150, 100 155" delay={1.5} strokeWidth={2} />

      {/* Neural sparkles */}
      <g className="text-accent">
        <AnimatedLine d="M60 60 L 65 55 L 70 60 L 65 65 Z" delay={2} strokeWidth={1.5} />
        <AnimatedLine d="M130 70 L 135 65 L 140 70 L 135 75 Z" delay={2.2} strokeWidth={1.5} />
        <AnimatedLine d="M90 100 L 95 95 L 100 100 L 95 105 Z" delay={2.4} strokeWidth={1.5} />
      </g>
    </svg>
  );
};

export const AnimatedBook = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book cover */}
      <AnimatedLine d="M15 10 Q 12 8, 15 100 Q 18 102, 85 100 Q 88 98, 85 10 Q 82 8, 15 10" delay={0.3} strokeWidth={2} />

      {/* Spine */}
      <AnimatedLine d="M25 12 Q 22 10, 25 98" delay={0.5} strokeWidth={2} />

      {/* Pages lines */}
      <AnimatedLine d="M35 25 Q 45 23, 75 25" delay={0.8} strokeWidth={1.5} />
      <AnimatedLine d="M35 38 Q 50 36, 70 38" delay={0.9} strokeWidth={1.5} />
      <AnimatedLine d="M35 51 Q 45 49, 75 51" delay={1} strokeWidth={1.5} />
      <AnimatedLine d="M35 64 Q 55 62, 68 64" delay={1.1} strokeWidth={1.5} />
      <AnimatedLine d="M35 77 Q 45 75, 72 77" delay={1.2} strokeWidth={1.5} />

      {/* Bookmark */}
      <AnimatedLine d="M70 8 L 70 35 L 75 30 L 80 35 L 80 8" delay={1.4} strokeWidth={1.5} className="text-accent" />
    </svg>
  );
};

export const AnimatedPencil = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 50 100" fill="none">
      <AnimatedLine d="M15 10 L35 10 L35 70 L25 90 L15 70 Z" delay={0.4} duration={1.2} />
      <AnimatedLine d="M15 25 L35 25" delay={0.8} duration={0.8} />
    </svg>
  );
};

export const AnimatedLightbulb = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bulb glass */}
      <AnimatedLine
        d="M50 10 Q 20 15, 15 50 Q 10 75, 30 95 L 30 105 L 70 105 L 70 95 Q 90 75, 85 50 Q 80 15, 50 10"
        delay={0.2}
        duration={1.5}
        strokeWidth={2.5}
      />

      {/* Screw base */}
      <AnimatedLine d="M30 105 Q 28 108, 32 112 Q 35 115, 30 118 L 70 118 Q 65 115, 68 112 Q 72 108, 70 105" delay={0.8} strokeWidth={2} />
      <AnimatedLine d="M30 118 Q 28 121, 32 124 Q 38 127, 50 128 Q 62 127, 68 124 Q 72 121, 70 118" delay={0.9} strokeWidth={2} />

      {/* Filament inside */}
      <AnimatedLine d="M40 85 Q 42 70, 50 65 Q 58 70, 60 85" delay={1.1} strokeWidth={1.5} className="text-accent" />
      <AnimatedLine d="M45 85 Q 48 75, 50 72" delay={1.2} strokeWidth={1.5} className="text-accent" />
      <AnimatedLine d="M55 85 Q 52 75, 50 72" delay={1.3} strokeWidth={1.5} className="text-accent" />

      {/* Light rays */}
      <g className="text-accent">
        <AnimatedLine d="M50 0 L 50 8" delay={1.5} strokeWidth={2} />
        <AnimatedLine d="M25 8 L 30 15" delay={1.6} strokeWidth={2} />
        <AnimatedLine d="M75 8 L 70 15" delay={1.7} strokeWidth={2} />
        <AnimatedLine d="M8 35 L 15 40" delay={1.8} strokeWidth={2} />
        <AnimatedLine d="M92 35 L 85 40" delay={1.9} strokeWidth={2} />
        <AnimatedLine d="M5 60 L 12 58" delay={2} strokeWidth={2} />
        <AnimatedLine d="M95 60 L 88 58" delay={2.1} strokeWidth={2} />
      </g>

      {/* Sparkle inside bulb */}
      <AnimatedLine d="M50 45 L 52 40 L 54 45 L 52 50 Z" delay={2.3} strokeWidth={1.5} className="text-accent" />
    </svg>
  );
};

// African-Themed Components
export const AnimatedBaobab = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 140 180" fill="none">
      <AnimatedLine 
        d="M70 180 Q 50 170, 45 140 Q 40 100, 50 70 Q 55 50, 70 40 Q 85 50, 90 70 Q 100 100, 95 140 Q 90 170, 70 180" 
        delay={0.2}
        duration={1.5}
        strokeWidth={3}
      />
      <AnimatedLine d="M70 40 Q 50 20, 30 30" delay={0.8} duration={1.0} />
      <AnimatedLine d="M70 40 Q 90 20, 110 30" delay={1.0} duration={1.0} />
      <AnimatedLine d="M70 40 L 70 10" delay={1.2} duration={0.8} />
    </svg>
  );
};

export const AnimatedGiraffe = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 150" fill="none">
      <AnimatedLine d="M30 150 Q 40 100, 40 50 Q 30 20, 50 10 Q 70 20, 60 50 Q 60 100, 70 150" delay={0.3} duration={1.8} />
      <AnimatedLine d="M50 10 L 45 5" delay={1.2} duration={0.5} />
      <AnimatedLine d="M50 10 L 55 5" delay={1.3} duration={0.5} />
    </svg>
  );
};

export const AnimatedAcacia = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 150 120" fill="none">
      <AnimatedLine d="M75 120 L75 80" delay={0.2} duration={0.8} strokeWidth={3} />
      <AnimatedLine d="M75 80 Q 40 70, 20 50 Q 75 30, 130 50 Q 110 70, 75 80" delay={0.5} duration={1.5} />
    </svg>
  );
};

export const AnimatedDrum = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 120" fill="none">
      <AnimatedLine d="M20 20 Q 50 30, 80 20 L 70 100 Q 50 110, 30 100 Z" delay={0.3} duration={1.5} />
      <AnimatedLine d="M20 20 L 30 100" delay={0.8} duration={1.0} className="opacity-50" />
      <AnimatedLine d="M80 20 L 70 100" delay={1.0} duration={1.0} className="opacity-50" />
    </svg>
  );
};

export const AnimatedShield = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 140" fill="none">
      <AnimatedLine d="M10 20 Q 50 0, 90 20 Q 100 70, 50 130 Q 0 70, 10 20" delay={0.3} duration={1.5} />
      <AnimatedLine d="M50 0 L 50 130" delay={1.0} duration={1.2} />
    </svg>
  );
};

// Celebration Components
export const AnimatedConfetti = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <AnimatedLine d="M50 50 L 40 30" delay={0.1} duration={0.5} />
      <AnimatedLine d="M50 50 L 60 30" delay={0.2} duration={0.5} />
      <AnimatedLine d="M50 50 L 30 50" delay={0.3} duration={0.5} />
      <AnimatedLine d="M50 50 L 70 50" delay={0.4} duration={0.5} />
      <AnimatedLine d="M50 50 L 40 70" delay={0.5} duration={0.5} />
      <AnimatedLine d="M50 50 L 60 70" delay={0.6} duration={0.5} />
    </svg>
  );
};

export const AnimatedTrophyCup = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 120" fill="none">
      <AnimatedLine d="M30 60 Q 30 80, 50 80 Q 70 80, 70 60 L 80 20 L 20 20 Z" delay={0.3} duration={1.5} />
      <AnimatedLine d="M50 80 L 50 100 L 30 110 L 70 110 L 50 100" delay={1.0} duration={1.0} />
      <AnimatedLine d="M20 30 Q 10 40, 20 50" delay={1.2} duration={0.8} />
      <AnimatedLine d="M80 30 Q 90 40, 80 50" delay={1.4} duration={0.8} />
    </svg>
  );
};

export const AnimatedRibbon = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <AnimatedLine d="M20 80 Q 50 20, 80 80" delay={0.3} duration={1.2} />
      <AnimatedLine d="M20 80 L 30 90" delay={1.0} duration={0.5} />
      <AnimatedLine d="M80 80 L 70 90" delay={1.1} duration={0.5} />
    </svg>
  );
};

export const AnimatedFireworks = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <AnimatedLine d="M50 50 L 50 20" delay={0.1} duration={0.5} />
      <AnimatedLine d="M50 50 L 80 50" delay={0.2} duration={0.5} />
      <AnimatedLine d="M50 50 L 50 80" delay={0.3} duration={0.5} />
      <AnimatedLine d="M50 50 L 20 50" delay={0.4} duration={0.5} />
      <AnimatedLine d="M50 50 L 70 30" delay={0.5} duration={0.5} />
      <AnimatedLine d="M50 50 L 70 70" delay={0.6} duration={0.5} />
      <AnimatedLine d="M50 50 L 30 70" delay={0.7} duration={0.5} />
      <AnimatedLine d="M50 50 L 30 30" delay={0.8} duration={0.5} />
    </svg>
  );
};

// Nature & Environment
export const AnimatedPlant = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 120 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pot */}
      <AnimatedLine d="M35 130 Q 30 110, 40 105 L 80 105 Q 90 110, 85 130 Q 80 140, 35 130" delay={0.2} strokeWidth={2} />
      <AnimatedLine d="M38 105 L 82 105" delay={0.3} strokeWidth={2} />
      
      {/* Soil */}
      <AnimatedLine d="M42 108 Q 50 112, 60 108 Q 70 112, 78 108" delay={0.5} strokeWidth={1.5} />
      
      {/* Main stem */}
      <AnimatedLine d="M60 105 Q 55 85, 60 65 Q 65 45, 55 25" delay={0.6} strokeWidth={2} />
      
      {/* Leaves */}
      <AnimatedLine d="M55 25 Q 30 15, 35 35 Q 40 50, 55 45" delay={1} strokeWidth={2} />
      <AnimatedLine d="M57 40 Q 85 30, 80 50 Q 75 65, 58 60" delay={1.2} strokeWidth={2} />
      <AnimatedLine d="M58 65 Q 30 55, 38 75 Q 45 90, 58 82" delay={1.4} strokeWidth={2} />
      <AnimatedLine d="M60 80 Q 90 70, 82 90 Q 75 102, 60 95" delay={1.6} strokeWidth={2} />
      
      {/* Leaf veins */}
      <AnimatedLine d="M45 30 Q 48 38, 52 42" delay={1.8} strokeWidth={1} />
      <AnimatedLine d="M72 42 Q 68 50, 62 55" delay={2} strokeWidth={1} />
    </svg>
  );
};

export const AnimatedButterfly = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none">
      <AnimatedLine d="M50 20 L 50 60" delay={0.3} duration={0.8} />
      <AnimatedLine d="M50 30 Q 80 10, 80 40 Q 50 50, 50 40" delay={0.5} duration={1.0} />
      <AnimatedLine d="M50 30 Q 20 10, 20 40 Q 50 50, 50 40" delay={0.5} duration={1.0} />
    </svg>
  );
};

export const AnimatedBird = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 60" fill="none">
      <AnimatedLine d="M10 30 Q 30 10, 50 30 Q 70 10, 90 30" delay={0.3} duration={1.2} />
    </svg>
  );
};

export const AnimatedCloud = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none">
      <AnimatedLine d="M20 60 Q 10 40, 30 30 Q 50 10, 70 30 Q 90 20, 100 40 Q 110 60, 90 70 L 30 70 Q 10 70, 20 60" delay={0.3} duration={2.0} />
    </svg>
  );
};

// UI & Communication
export const AnimatedChatBubble = ({ className = "", text = "Habari!" }: { className?: string, text?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 80" fill="none">
        <AnimatedLine d="M10 10 H 110 V 60 H 40 L 20 75 L 30 60 H 10 V 10" delay={0.3} duration={1.5} />
      </svg>
      <div className="relative z-10 p-4 text-center font-hand text-lg">{text}</div>
    </div>
  );
};

export const AnimatedRocket = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rocket body */}
      <AnimatedLine
        d="M50 10 Q 35 25, 30 60 L 30 100 Q 35 110, 50 115 Q 65 110, 70 100 L 70 60 Q 65 25, 50 10"
        delay={0.2}
        duration={1.5}
        strokeWidth={2.5}
      />

      {/* Window */}
      <AnimatedLine d="M50 40 Q 38 40, 38 55 Q 38 70, 50 70 Q 62 70, 62 55 Q 62 40, 50 40" delay={0.6} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M50 50 Q 45 50, 45 55 Q 45 60, 50 60 Q 55 60, 55 55 Q 55 50, 50 50" delay={0.8} strokeWidth={1.5} className="text-accent" />

      {/* Fins */}
      <AnimatedLine d="M30 85 Q 15 90, 15 110 Q 20 115, 30 105" delay={1} strokeWidth={2} />
      <AnimatedLine d="M70 85 Q 85 90, 85 110 Q 80 115, 70 105" delay={1.1} strokeWidth={2} />

      {/* Flames */}
      <g className="text-accent">
        <AnimatedLine d="M40 115 Q 35 130, 42 145 Q 45 150, 50 140" delay={1.3} strokeWidth={2} />
        <AnimatedLine d="M50 115 Q 50 135, 50 155" delay={1.4} strokeWidth={2} />
        <AnimatedLine d="M60 115 Q 65 130, 58 145 Q 55 150, 50 140" delay={1.5} strokeWidth={2} />
      </g>

      {/* Smoke puffs */}
      <AnimatedLine d="M35 150 Q 30 155, 32 160" delay={1.7} strokeWidth={1.5} className="text-muted-foreground" />
      <AnimatedLine d="M65 150 Q 70 155, 68 160" delay={1.8} strokeWidth={1.5} className="text-muted-foreground" />
    </svg>
  );
};

export const AnimatedGlobe = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <AnimatedLine d="M50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10" delay={0.3} duration={1.5} />
      <AnimatedLine d="M10 50 H 90" delay={0.8} duration={1.0} />
      <AnimatedLine d="M50 10 V 90" delay={1.0} duration={1.0} />
      <AnimatedLine d="M30 20 Q 50 50, 70 20" delay={1.2} duration={1.0} />
      <AnimatedLine d="M30 80 Q 50 50, 70 80" delay={1.4} duration={1.0} />
    </svg>
  );
};

export const AnimatedHeart = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <AnimatedLine d="M50 30 Q 70 0, 90 30 Q 100 60, 50 90 Q 0 60, 10 30 Q 30 0, 50 30" delay={0.3} duration={1.5} />
    </svg>
  );
};

export const AnimatedStar = ({ className = "", delay = 0 }: { className?: string, delay?: number }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <AnimatedLine d="M50 10 L 60 40 L 90 50 L 60 60 L 50 90 L 40 60 L 10 50 L 40 40 Z" delay={delay} duration={1.5} />
    </svg>
  );
};

export const AnimatedSparkle = ({ className = "", delay = 0, size = 24, style }: { className?: string, delay?: number, size?: number, style?: React.CSSProperties }) => {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <AnimatedLine d="M12 2 L 14 10 L 22 12 L 14 14 L 12 22 L 10 14 L 2 12 L 10 10 Z" delay={delay} duration={1.0} />
    </svg>
  );
};

// Decorative Elements
export const AnimatedSquiggle = ({ className = "", delay = 0 }: { className?: string, delay?: number }) => {
  return (
    <svg className={className} viewBox="0 0 100 20" fill="none">
      <AnimatedLine d="M0 10 Q 10 0, 20 10 T 40 10 T 60 10 T 80 10 T 100 10" delay={delay} duration={1.5} />
    </svg>
  );
};

export const AnimatedArrowPointer = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 60" fill="none">
      <AnimatedLine d="M10 30 Q 50 10, 90 30" delay={0.3} duration={1.0} />
      <AnimatedLine d="M80 20 L 90 30 L 80 40" delay={0.8} duration={0.5} />
    </svg>
  );
};

export const AnimatedMusicNotes = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <AnimatedLine d="M20 80 V 40 H 60 V 80" delay={0.3} duration={1.0} />
      <AnimatedLine d="M10 80 Q 20 90, 30 80" delay={0.8} duration={0.5} />
      <AnimatedLine d="M50 80 Q 60 90, 70 80" delay={1.0} duration={0.5} />
    </svg>
  );
};

export const AnimatedPattern = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <AnimatedLine d="M10 10 L 90 90" delay={0.3} duration={1.5} />
      <AnimatedLine d="M90 10 L 10 90" delay={0.3} duration={1.5} />
    </svg>
  );
};

export const AnimatedSunrise = ({ className = "" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none">
      {/* Horizon */}
      <AnimatedLine d="M10 60 L 110 60" delay={0.2} duration={1.2} strokeWidth={2} />

      {/* Sun arc */}
      <AnimatedLine d="M25 60 A 35 35 0 0 1 95 60" delay={0.4} duration={1.5} strokeWidth={2.5} />

      {/* Sun rays */}
      <g className="text-accent">
        <AnimatedLine d="M60 60 V 18" delay={0.8} duration={0.9} strokeWidth={2} />
        <AnimatedLine d="M40 54 L 26 34" delay={1.0} duration={0.8} strokeWidth={2} />
        <AnimatedLine d="M80 54 L 94 34" delay={1.1} duration={0.8} strokeWidth={2} />
        <AnimatedLine d="M52 60 L 52 44" delay={1.2} duration={0.6} strokeWidth={1.5} />
        <AnimatedLine d="M68 60 L 68 44" delay={1.3} duration={0.6} strokeWidth={1.5} />
      </g>

      {/* Small sparkles */}
      <g className="text-accent/60">
        <AnimatedLine d="M20 22 L 22 18 L 24 22 L 22 26 Z" delay={1.6} strokeWidth={1.5} />
        <AnimatedLine d="M98 26 L 100 22 L 102 26 L 100 30 Z" delay={1.8} strokeWidth={1.5} />
      </g>
    </svg>
  );
};

export const DrawingCanvas = ({ className = "" }: { className?: string }) => {
  return <div className={`absolute inset-0 pointer-events-none ${className}`} />;
};

// Layout Utility
export const FloatingElement = ({ 
  children, 
  delay = 0,
  amplitude = 10,
  duration = 3
}: { 
  children: React.ReactNode; 
  delay?: number;
  amplitude?: number;
  duration?: number;
}) => {
  return (
    <div 
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
};
