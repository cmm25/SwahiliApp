import { cn } from "@/lib/utils";
import type { FloatingParticleSpec } from "./types";

function FloatingParticle({ delay, size, color, left, top, duration }: FloatingParticleSpec) {
  return (
    <div
      className={cn("absolute rounded-full opacity-60 animate-float", color)}
      style={{
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        left: `${left}%`,
        top: `${top}%`,
      }}
    />
  );
}

export function LessonBackground({ particles }: { particles: FloatingParticleSpec[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
      <div
        className="absolute -bottom-20 -left-20 w-48 h-48 bg-warning/10 rounded-full blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      {particles.map((particle, i) => (
        <FloatingParticle key={i} {...particle} />
      ))}

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
