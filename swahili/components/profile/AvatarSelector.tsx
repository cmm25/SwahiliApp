'use client';

import { cn } from "@/lib/utils";

const BIG_FIVE_AVATARS = [
  { id: 'lion', name: 'Simba', emoji: '🦁', color: 'from-amber-400 to-orange-500' },
  { id: 'elephant', name: 'Tembo', emoji: '🐘', color: 'from-slate-400 to-slate-600' },
  { id: 'buffalo', name: 'Nyati', emoji: '🦬', color: 'from-stone-500 to-stone-700' },
  { id: 'leopard', name: 'Chui', emoji: '🐆', color: 'from-yellow-400 to-amber-600' },
  { id: 'rhino', name: 'Kifaru', emoji: '🦏', color: 'from-zinc-400 to-zinc-600' },
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarSelector({ selectedAvatar, onSelect, size = 'md' }: AvatarSelectorProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {BIG_FIVE_AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onSelect(avatar.id)}
          className={cn(
            "relative rounded-full flex items-center justify-center transition-all duration-300",
            "bg-gradient-to-br shadow-md hover:shadow-lg hover:scale-110",
            avatar.color,
            sizeClasses[size],
            selectedAvatar === avatar.id && "ring-4 ring-primary ring-offset-2 ring-offset-background scale-110"
          )}
          title={avatar.name}
        >
          <span className="drop-shadow-sm">{avatar.emoji}</span>
          {selectedAvatar === avatar.id && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function getAvatarById(id: string) {
  return BIG_FIVE_AVATARS.find(a => a.id === id) || BIG_FIVE_AVATARS[0];
}

export { BIG_FIVE_AVATARS };
