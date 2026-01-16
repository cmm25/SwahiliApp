'use client';

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-8", className)}>
      <div>
        <h1 className="font-hand text-4xl md:text-5xl text-foreground sketch-underline inline-block">
          {title}
        </h1>
        {subtitle && (
          <p className="font-hand-secondary text-lg text-muted-foreground mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
