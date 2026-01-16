'use client';

import React, { useEffect, useState } from 'react';

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
        '--float-amplitude': `${amplitude}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export const DrawingCanvas = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 1200 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Decorative corner flourish - top left */}
      <g className="text-foreground/20">
        <AnimatedLine d="M50 50 Q 70 30, 100 40 Q 130 50, 120 80" delay={0.5} />
        <AnimatedLine d="M55 55 Q 65 45, 80 50" delay={0.7} />
      </g>
      
      {/* Decorative corner flourish - top right */}
      <g className="text-foreground/20">
        <AnimatedLine d="M1150 50 Q 1130 30, 1100 40 Q 1070 50, 1080 80" delay={0.8} />
        <AnimatedLine d="M1145 55 Q 1135 45, 1120 50" delay={1} />
      </g>
      
      {/* Decorative corner flourish - bottom left */}
      <g className="text-foreground/15">
        <AnimatedLine d="M50 750 Q 70 770, 100 760 Q 130 750, 120 720" delay={1.2} />
      </g>
      
      {/* Decorative corner flourish - bottom right */}
      <g className="text-foreground/15">
        <AnimatedLine d="M1150 750 Q 1130 770, 1100 760 Q 1070 750, 1080 720" delay={1.4} />
      </g>

      {/* Scattered small doodles */}
      <g className="text-accent/40">
        <AnimatedLine d="M200 150 Q 210 140, 220 150 Q 210 160, 200 150" delay={1.5} strokeWidth={1.5} />
        <AnimatedLine d="M950 200 L 960 190 L 970 200 L 960 210 Z" delay={1.7} strokeWidth={1.5} />
        <AnimatedLine d="M180 600 Q 190 590, 200 600 Q 190 610, 180 600" delay={1.9} strokeWidth={1.5} />
      </g>

      {/* Subtle grid lines */}
      <g className="text-foreground/5">
        <AnimatedLine d="M0 400 L 1200 400" delay={2} strokeWidth={0.5} duration={2} />
        <AnimatedLine d="M600 0 L 600 800" delay={2.2} strokeWidth={0.5} duration={2} />
      </g>
    </svg>
  );
};

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

export const AnimatedStar = ({ 
  className = "", 
  delay = 0,
  style 
}: { 
  className?: string; 
  delay?: number;
  style?: React.CSSProperties;
}) => {
  return (
    <svg 
      className={className}
      style={style}
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <AnimatedLine d="M20 5 Q 22 16, 35 18 Q 22 20, 20 33 Q 18 20, 5 18 Q 18 16, 20 5" delay={delay} strokeWidth={2} />
    </svg>
  );
};

export const AnimatedSparkle = ({ 
  className = "", 
  delay = 0,
  size = 24 
}: { 
  className?: string; 
  delay?: number;
  size?: number;
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-500 ${className}`}
      style={{
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    </div>
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

// NEW - Animated Rocket
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

// NEW - Animated Chat Bubble with text
export const AnimatedChatBubble = ({ className = "", text = "Habari!" }: { className?: string; text?: string }) => {
  const [showText, setShowText] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <svg 
        viewBox="0 0 160 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Bubble outline */}
        <AnimatedLine 
          d="M20 10 Q 5 10, 5 30 L 5 60 Q 5 80, 20 80 L 30 80 L 25 95 L 45 80 L 140 80 Q 155 80, 155 60 L 155 30 Q 155 10, 140 10 Z" 
          delay={0.3}
          duration={1.2}
          strokeWidth={2.5}
        />
      </svg>
      <span 
        className="absolute inset-0 flex items-center justify-center font-hand text-2xl md:text-3xl text-foreground pb-4 transition-opacity duration-500"
        style={{ opacity: showText ? 1 : 0 }}
      >
        {text}
      </span>
    </div>
  );
};

// NEW - Animated Pencil
export const AnimatedPencil = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 40 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pencil body */}
      <AnimatedLine d="M10 30 L 10 120 L 20 140 L 30 120 L 30 30" delay={0.2} strokeWidth={2.5} />
      
      {/* Eraser */}
      <AnimatedLine d="M10 30 Q 10 20, 20 15 Q 30 20, 30 30" delay={0.4} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M10 30 L 30 30" delay={0.5} strokeWidth={2} />
      
      {/* Wood part */}
      <AnimatedLine d="M10 120 Q 15 125, 20 130 Q 25 125, 30 120" delay={0.7} strokeWidth={1.5} />
      
      {/* Tip */}
      <AnimatedLine d="M17 130 L 20 140 L 23 130" delay={0.9} strokeWidth={2} className="text-accent" />
      
      {/* Pencil stripes */}
      <AnimatedLine d="M10 50 L 30 50" delay={1.1} strokeWidth={1.5} />
      <AnimatedLine d="M10 70 L 30 70" delay={1.2} strokeWidth={1.5} />
      <AnimatedLine d="M10 90 L 30 90" delay={1.3} strokeWidth={1.5} />
    </svg>
  );
};

// NEW - Animated Music Notes
export const AnimatedMusicNotes = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 120 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* First note */}
      <AnimatedLine d="M30 70 Q 20 70, 20 80 Q 20 90, 30 90 Q 40 90, 40 80 Q 40 75, 35 72" delay={0.3} strokeWidth={2} />
      <AnimatedLine d="M40 80 L 40 30" delay={0.5} strokeWidth={2} />
      <AnimatedLine d="M40 30 Q 50 25, 55 30 Q 52 35, 45 35" delay={0.7} strokeWidth={2} />
      
      {/* Second note */}
      <AnimatedLine d="M70 60 Q 60 60, 60 70 Q 60 80, 70 80 Q 80 80, 80 70 Q 80 65, 75 62" delay={0.9} strokeWidth={2} />
      <AnimatedLine d="M80 70 L 80 20" delay={1.1} strokeWidth={2} />
      
      {/* Connecting beam */}
      <AnimatedLine d="M40 30 L 80 20" delay={1.3} strokeWidth={3} />
      
      {/* Floating notes */}
      <g className="text-accent">
        <AnimatedLine d="M95 40 Q 88 40, 88 45 Q 88 52, 95 52 Q 102 52, 102 45 Q 102 42, 98 40" delay={1.5} strokeWidth={1.5} />
        <AnimatedLine d="M102 45 L 102 25" delay={1.6} strokeWidth={1.5} />
      </g>
    </svg>
  );
};

// NEW - Animated Globe/World
export const AnimatedGlobe = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main circle */}
      <AnimatedLine 
        d="M60 10 Q 100 10, 110 60 Q 100 110, 60 110 Q 20 110, 10 60 Q 20 10, 60 10" 
        delay={0.2}
        duration={1.5}
        strokeWidth={2.5}
      />
      
      {/* Horizontal lines */}
      <AnimatedLine d="M15 40 Q 60 35, 105 40" delay={0.6} strokeWidth={1.5} />
      <AnimatedLine d="M10 60 Q 60 55, 110 60" delay={0.7} strokeWidth={1.5} />
      <AnimatedLine d="M15 80 Q 60 85, 105 80" delay={0.8} strokeWidth={1.5} />
      
      {/* Vertical ellipse */}
      <AnimatedLine d="M60 10 Q 45 60, 60 110" delay={1} strokeWidth={1.5} />
      <AnimatedLine d="M60 10 Q 75 60, 60 110" delay={1.1} strokeWidth={1.5} />
      
      {/* Africa-ish continent */}
      <AnimatedLine d="M55 35 Q 65 40, 70 55 Q 72 70, 65 80 Q 55 85, 50 75 Q 48 60, 55 35" delay={1.3} strokeWidth={2} className="text-accent" />
    </svg>
  );
};

// NEW - Animated Heart
export const AnimatedHeart = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <AnimatedLine 
        d="M40 70 Q 10 45, 10 30 Q 10 15, 25 15 Q 35 15, 40 25 Q 45 15, 55 15 Q 70 15, 70 30 Q 70 45, 40 70" 
        delay={0.3}
        duration={1.2}
        strokeWidth={2.5}
        className="text-accent"
      />
    </svg>
  );
};

// NEW - Decorative Squiggle Line
export const AnimatedSquiggle = ({ className = "", delay = 0 }: { className?: string; delay?: number }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 30" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <AnimatedLine 
        d="M0 15 Q 20 5, 40 15 Q 60 25, 80 15 Q 100 5, 120 15 Q 140 25, 160 15 Q 180 5, 200 15" 
        delay={delay}
        duration={1}
        strokeWidth={3}
      />
    </svg>
  );
};

// NEW - Animated Arrow Pointer
export const AnimatedArrowPointer = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 80 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arrow shaft with curve */}
      <AnimatedLine 
        d="M40 10 Q 35 30, 40 50 Q 50 70, 45 90" 
        delay={0.2}
        duration={1}
        strokeWidth={3}
      />
      
      {/* Arrow head */}
      <AnimatedLine d="M30 75 L 45 90 L 55 70" delay={0.8} strokeWidth={3} />
    </svg>
  );
};

// NEW - Confetti burst
export const AnimatedConfetti = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center burst */}
      <AnimatedLine d="M50 50 L 50 20" delay={0.2} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M50 50 L 75 30" delay={0.3} strokeWidth={2} />
      <AnimatedLine d="M50 50 L 85 50" delay={0.4} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M50 50 L 75 75" delay={0.5} strokeWidth={2} />
      <AnimatedLine d="M50 50 L 50 85" delay={0.6} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M50 50 L 25 75" delay={0.7} strokeWidth={2} />
      <AnimatedLine d="M50 50 L 15 50" delay={0.8} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M50 50 L 25 25" delay={0.9} strokeWidth={2} />
      
      {/* Small shapes at ends */}
      <AnimatedLine d="M48 18 L 52 18 L 52 22 L 48 22 Z" delay={1.1} strokeWidth={1.5} />
      <AnimatedLine d="M83 48 L 87 52" delay={1.2} strokeWidth={2} />
      <AnimatedLine d="M48 83 Q 50 87, 52 83" delay={1.3} strokeWidth={1.5} />
      <AnimatedLine d="M13 48 L 17 52" delay={1.4} strokeWidth={2} />
    </svg>
  );
};

// NEW - Animated Swahili pattern (African-inspired geometric)
export const AnimatedPattern = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <AnimatedLine 
        d="M60 10 Q 100 10, 110 60 Q 100 110, 60 110 Q 20 110, 10 60 Q 20 10, 60 10" 
        delay={0.1}
        strokeWidth={2}
      />
      
      {/* Inner circle */}
      <AnimatedLine 
        d="M60 30 Q 85 30, 90 60 Q 85 90, 60 90 Q 35 90, 30 60 Q 35 30, 60 30" 
        delay={0.4}
        strokeWidth={2}
      />
      
      {/* Cross pattern */}
      <AnimatedLine d="M60 10 L 60 30" delay={0.6} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M60 90 L 60 110" delay={0.7} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M10 60 L 30 60" delay={0.8} strokeWidth={2} className="text-accent" />
      <AnimatedLine d="M90 60 L 110 60" delay={0.9} strokeWidth={2} className="text-accent" />
      
      {/* Diagonal lines */}
      <AnimatedLine d="M25 25 L 38 38" delay={1} strokeWidth={1.5} />
      <AnimatedLine d="M95 25 L 82 38" delay={1.1} strokeWidth={1.5} />
      <AnimatedLine d="M25 95 L 38 82" delay={1.2} strokeWidth={1.5} />
      <AnimatedLine d="M95 95 L 82 82" delay={1.3} strokeWidth={1.5} />
      
      {/* Center diamond */}
      <AnimatedLine d="M60 45 L 75 60 L 60 75 L 45 60 Z" delay={1.5} strokeWidth={2} className="text-accent" />
    </svg>
  );
};
