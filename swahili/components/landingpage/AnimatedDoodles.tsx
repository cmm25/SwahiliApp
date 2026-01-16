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
