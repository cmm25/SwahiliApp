'use client';

import { 
  AnimatedStar, 
  AnimatedPattern, 
  AnimatedSquiggle, 
  AnimatedBaobab, 
  AnimatedAcacia, 
  AnimatedBird, 
  AnimatedButterfly, 
  AnimatedCloud,
  FloatingElement // Import FloatingElement from here now
} from "@/components/shared/AnimatedDoodles";

type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'pattern' | 'squiggle' | 
                 'baobab' | 'acacia' | 'bird' | 'butterfly' | 'cloud';

export function AnimatedBackground() {
  const shapes: Array<{ type: ShapeType; top: string; left: string; size: string; color: string; delay: number }> = [
    { type: 'baobab', top: '10%', left: '10%', size: 'w-32 h-32', color: 'text-foreground/10', delay: 0 },
    { type: 'acacia', top: '70%', left: '80%', size: 'w-40 h-32', color: 'text-foreground/10', delay: 1 },
    { type: 'bird', top: '20%', left: '80%', size: 'w-16 h-12', color: 'text-foreground/10', delay: 2 },
    { type: 'butterfly', top: '60%', left: '15%', size: 'w-12 h-12', color: 'text-accent/20', delay: 1.5 },
    { type: 'cloud', top: '15%', left: '40%', size: 'w-24 h-16', color: 'text-foreground/5', delay: 3 },
    { type: 'star', top: '80%', left: '30%', size: 'w-8 h-8', color: 'text-accent/20', delay: 0.5 },
    { type: 'squiggle', top: '40%', left: '90%', size: 'w-20 h-8', color: 'text-foreground/10', delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, i) => (
        <div 
          key={i} 
          className={`absolute ${shape.top.startsWith('-') ? '' : 'transform'} ${shape.color}`}
          style={{ top: shape.top, left: shape.left }}
        >
          <FloatingElement delay={shape.delay} duration={4 + i}>
            <div className={`${shape.size}`}>
              {shape.type === 'baobab' && <AnimatedBaobab className="w-full h-full" />}
              {shape.type === 'acacia' && <AnimatedAcacia className="w-full h-full" />}
              {shape.type === 'bird' && <AnimatedBird className="w-full h-full" />}
              {shape.type === 'butterfly' && <AnimatedButterfly className="w-full h-full" />}
              {shape.type === 'cloud' && <AnimatedCloud className="w-full h-full" />}
              {shape.type === 'star' && <AnimatedStar className="w-full h-full" />}
              {shape.type === 'squiggle' && <AnimatedSquiggle className="w-full h-full" />}
              {/* Fallback/Original shapes */}
              {shape.type === 'circle' && <div className="w-full h-full rounded-full bg-current opacity-20 blur-xl" />}
            </div>
          </FloatingElement>
        </div>
      ))}
    </div>
  );
}
