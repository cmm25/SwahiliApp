'use client';

// Sketch border that stays within bounds
export function SketchBorder({ className }: { className?: string }) {
  return (
    <svg 
      className={`absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] pointer-events-none ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <path
        d="M 2,2 
           C 6,1 16,3 26,1.5 
           S 46,3 56,1 
           S 76,2.5 86,1.5 
           S 97,3 98,2
           C 99,6 97,16 99,26 
           S 97,46 99,56 
           S 97,76 99,86 
           S 97,97 98,98
           C 94,99 84,97 74,99 
           S 54,97 44,99 
           S 34,97 14,99 
           S 3,97 2,98
           C 1,94 3,84 1,74 
           S 3,54 1,44 
           S 3,24 1,14 
           S 3,3 2,2 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className="text-foreground/40"
      />
    </svg>
  );
}

// Checkered grid background component
export function CheckeredBackground({ className }: { className?: string }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--foreground) / 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--foreground) / 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px'
      }}
    />
  );
}
