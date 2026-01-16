import { cn } from "@/lib/utils";

// Wobbly hand-drawn border that can wrap any element
export function HandDrawnBorder({ 
  className, 
  strokeWidth = 1.5,
  variant = "default" 
}: { 
  className?: string; 
  strokeWidth?: number;
  variant?: "default" | "accent" | "success" | "warning";
}) {
  const colors = {
    default: "text-foreground/40",
    accent: "text-accent/50",
    success: "text-success/50",
    warning: "text-warning/50",
  };

  return (
    <svg 
      className={cn("absolute inset-0 w-full h-full pointer-events-none overflow-visible", colors[variant], className)}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      style={{ overflow: 'visible' }}
    >
      <path
        d="M 4,4 
           C 8,3 18,5 28,3.5 
           S 48,5 58,3 
           S 78,4.5 88,3.5 
           S 95,5 96,4
           C 97,8 95,18 97,28 
           S 95,48 97,58 
           S 95,78 97,88 
           S 95,95 96,96
           C 92,97 82,95 72,97 
           S 52,95 42,97 
           S 22,95 12,97 
           S 5,95 4,96
           C 3,92 5,82 3,72 
           S 5,52 3,42 
           S 5,22 3,12 
           S 5,5 4,4 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Decorative scribble arrow
export function DoodleArrow({ 
  className, 
  direction = "right" 
}: { 
  className?: string; 
  direction?: "right" | "down" | "left" | "up";
}) {
  const rotations = {
    right: "rotate-0",
    down: "rotate-90",
    left: "rotate-180",
    up: "-rotate-90",
  };

  return (
    <svg 
      viewBox="0 0 40 20" 
      className={cn("w-10 h-5", rotations[direction], className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M 2,10 C 8,9 15,11 22,10 S 30,9 35,10" />
      <path d="M 30,5 L 37,10 L 30,15" />
    </svg>
  );
}

// Squiggly underline
export function SquigglyUnderline({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 8" 
      className={cn("w-full h-2", className)}
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M 0,4 Q 5,1 10,4 T 20,4 T 30,4 T 40,4 T 50,4 T 60,4 T 70,4 T 80,4 T 90,4 T 100,4" />
    </svg>
  );
}

// Small doodle star burst
export function DoodleStarburst({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size}
      className={cn("", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M 12,2 L 12,6" />
      <path d="M 12,18 L 12,22" />
      <path d="M 2,12 L 6,12" />
      <path d="M 18,12 L 22,12" />
      <path d="M 5,5 L 8,8" />
      <path d="M 16,16 L 19,19" />
      <path d="M 5,19 L 8,16" />
      <path d="M 16,8 L 19,5" />
    </svg>
  );
}

// Circle doodle (like a hand-drawn bullet point)
export function DoodleCircle({ className, size = 12 }: { className?: string; size?: number }) {
  return (
    <svg 
      viewBox="0 0 20 20" 
      width={size} 
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M 10,2 C 16,2 18,6 18,10 C 18,16 14,18 10,18 C 4,18 2,14 2,10 C 2,5 5,2 10,2" />
    </svg>
  );
}

// Wobbly progress bar
export function WobblyProgress({ 
  progress, 
  className,
  colorClass = "text-accent"
}: { 
  progress: number; 
  className?: string;
  colorClass?: string;
}) {
  return (
    <div className={cn("relative h-3", className)}>
      {/* Background track */}
      <svg 
        viewBox="0 0 200 12" 
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M 2,6 Q 10,4 20,6 T 40,6 T 60,6 T 80,6 T 100,6 T 120,6 T 140,6 T 160,6 T 180,6 T 198,6"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-muted/30"
        />
      </svg>
      
      {/* Progress fill */}
      <svg 
        viewBox="0 0 200 12" 
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M 2,6 Q 10,4 20,6 T 40,6 T 60,6 T 80,6 T 100,6 T 120,6 T 140,6 T 160,6 T 180,6 T 198,6"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className={colorClass}
          strokeDasharray="196"
          strokeDashoffset={196 - (196 * progress / 100)}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>
    </div>
  );
}

// Decorative corner squiggle
export function CornerSquiggle({ 
  className, 
  position = "top-right" 
}: { 
  className?: string; 
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const transforms = {
    "top-left": "",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)",
  };

  return (
    <svg 
      viewBox="0 0 30 30" 
      className={cn("w-8 h-8 absolute", className)}
      style={{ transform: transforms[position] }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M 5,25 Q 5,10 15,8 T 28,5" />
    </svg>
  );
}

// Tape/sticky note corner effect
export function TapeCorner({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-warning/40 rounded-sm",
        "rotate-[-2deg] shadow-sm",
        className
      )}
      style={{
        background: "linear-gradient(135deg, hsl(var(--warning) / 0.3), hsl(var(--warning) / 0.5))"
      }}
    />
  );
}
