'use client';

/**
 * StatCard - Reusable stat display card for admin dashboard
 */

import { LucideIcon } from 'lucide-react';
import { SketchCard } from '@/components/shared/SketchCard';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number | null;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  valueClassName,
}: StatCardProps) {
  const displayValue = value ?? '—';

  return (
    <SketchCard className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-hand-secondary text-xs text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className={cn('font-hand text-3xl', valueClassName)}>
            {displayValue}
          </p>
          {subtitle && (
            <p className="font-hand-secondary text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn(
              'font-hand-secondary text-xs',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '↑' : '↓'} {trend.value} {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-full bg-accent/10">
            <Icon size={20} className="text-accent" />
          </div>
        )}
      </div>
    </SketchCard>
  );
}
