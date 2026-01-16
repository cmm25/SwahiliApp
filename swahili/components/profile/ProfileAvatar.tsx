'use client';

import { cn } from "@/lib/utils";
import { getAvatarById } from "./AvatarSelector";

interface ProfileAvatarProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ProfileAvatar({ avatarId, size = 'md', className }: ProfileAvatarProps) {
  const avatar = getAvatarById(avatarId);
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
    xl: 'w-28 h-28 text-6xl',
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg",
        avatar.color,
        sizeClasses[size],
        className
      )}
      title={avatar.name}
    >
      <span className="drop-shadow-sm">{avatar.emoji}</span>
    </div>
  );
}
