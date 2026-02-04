'use client';

import React from 'react';

// Paper Texture - adds a subtle noise/texture overlay
export const PaperTexture = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1]">
      <svg width="100%" height="100%">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch" 
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

// Grid Lines - adds a subtle grid background
export const GridLines = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[0] opacity-[0.02]"
      style={{
        backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    />
  );
};

// Highlight Marker - adds a hand-drawn marker effect behind text
export const HighlightMarker = ({ 
  children, 
  color = "accent", 
  className = "" 
}: { 
  children: React.ReactNode; 
  color?: "accent" | "warning" | "success" | "destructive";
  className?: string;
}) => {
  const colorMap = {
    accent: "bg-accent/20",
    warning: "bg-warning/20",
    success: "bg-success/20",
    destructive: "bg-destructive/20"
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span 
        className={`absolute inset-0 transform -skew-x-12 scale-105 rounded-sm ${colorMap[color]}`}
        style={{
          clipPath: "polygon(0% 10%, 100% 0%, 98% 90%, 2% 100%)"
        }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
};
