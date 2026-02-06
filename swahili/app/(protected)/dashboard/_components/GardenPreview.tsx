'use client';

import Link from "next/link";
import { Leaf, Flower2, TreeDeciduous } from "lucide-react";
import { SketchCard } from "@/components/shared/SketchCard";

export function GardenPreview() {
  return (
    <SketchCard className="bg-gradient-to-br from-success/5 to-warning/5 border-success/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-hand text-lg flex items-center gap-2">
          🌱 Bustani ya Maneno
        </h3>
        <Link href="/vocabulary" className="font-hand-secondary text-xs text-accent hover:underline">
          View garden →
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <p className="font-hand-secondary text-sm text-muted-foreground">
          Your garden is growing beautifully!
        </p>

        {/* Compact growth stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="font-hand text-sm">23</span>
          </div>
          <div className="flex items-center gap-1">
            <Leaf size={14} className="text-success/60" />
            <span className="font-hand text-sm">45</span>
          </div>
          <div className="flex items-center gap-1">
            <Flower2 size={14} className="text-accent" />
            <span className="font-hand text-sm">32</span>
          </div>
          <div className="flex items-center gap-1">
            <TreeDeciduous size={14} className="text-warning" />
            <span className="font-hand text-sm text-warning">18</span>
          </div>
        </div>
      </div>
    </SketchCard>
  );
}
