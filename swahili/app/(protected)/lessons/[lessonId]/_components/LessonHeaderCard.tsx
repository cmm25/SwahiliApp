import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SketchCard } from "@/components/shared/SketchCard";
import { SketchStar } from "@/components/shared/HandDrawnIcons";
import { HighlightMarker } from "@/components/shared/DecorativeElements";
import { DoodleStarburst } from "@/components/shared/Doodle";
import type { LessonMeta } from "./types";

interface LessonHeaderCardProps {
  lessonMeta: LessonMeta;
}

export function LessonHeaderCard({ lessonMeta }: LessonHeaderCardProps) {
  return (
    <div className="relative z-10 mb-8">
      <SketchCard className="!p-4 backdrop-blur-sm bg-card/80">
        <div className="flex items-center gap-4">
          <Link
            href="/lessons"
            className="p-2.5 rounded-xl border-2 border-border/40 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
          </Link>

          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl border-2 border-accent/30 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center shadow-lg">
                <span className="text-2xl">{lessonMeta.emoji}</span>
              </div>
              <div className="absolute -top-1 -right-1 animate-spin [animation-duration:8s]">
                <DoodleStarburst size={16} className="text-warning" />
              </div>
            </div>
            <div>
              <h1 className="font-hand text-2xl leading-tight">
                <HighlightMarker color="accent">{lessonMeta.title}</HighlightMarker>
              </h1>
              <p className="font-hand-secondary text-sm text-muted-foreground">{lessonMeta.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-warning/20 to-warning/5 border-2 border-warning/30 rounded-xl shadow-sm">
            <SketchStar size={18} filled className="text-warning animate-pulse" />
            <span className="font-hand text-lg text-warning">{lessonMeta.xp}</span>
            <span className="font-hand-secondary text-xs text-warning/70">XP</span>
          </div>
        </div>
      </SketchCard>
    </div>
  );
}
