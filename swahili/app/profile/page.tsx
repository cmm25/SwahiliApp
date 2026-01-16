'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { SketchCard } from "@/components/shared/SketchCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { LevelProgress } from "@/components/shared/LevelProgress";
import { StreakBadge } from "@/components/shared/StreakBadge";
import { XPBadge } from "@/components/shared/XPBadge";
import { AchievementBadge, BadgeType } from "@/components/shared/AchievementBadge";
import { LogOut, Edit2 } from "lucide-react";
import { SketchButton } from "@/components/shared/SketchButton";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useStreak } from "@/hooks/useStreak";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const allBadges: BadgeType[] = ["first_lesson", "streak_7", "streak_30", "words_100", "words_500", "conversation_10", "perfect_quiz", "daily_goal", "explorer", "champion"];
const unlockedBadges: BadgeType[] = ["first_lesson", "streak_7", "words_100"];

export default function Profile() {
  const { streak, xp } = useStreak();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "Mwanafunzi",
    avatar: "lion",
  });

  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Calculate level from XP
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXP = xp % 500;
  const requiredLevelXP = 500;

  const handleSaveProfile = async (data: { displayName: string; avatar: string }) => {
    // UI only - stores in local state
    setProfile(data);
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <PageHeader
          title="Wasifu"
          subtitle="Your learning profile"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <SketchCard className="md:col-span-1 text-center relative group">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="absolute top-3 right-3 p-2 rounded-full bg-accent/20 hover:bg-accent/40 transition-colors opacity-0 group-hover:opacity-100"
              title="Edit Profile"
            >
              <Edit2 size={16} className="text-accent" />
            </button>

            {/* Avatar */}
            <div className="flex justify-center">
              <ProfileAvatar avatarId={profile.avatar} size="xl" />
            </div>

            <h2 className="font-hand text-2xl mt-4">{profile.displayName}</h2>
            <p className="font-hand-secondary text-sm text-muted-foreground">
              {user?.email || "Joined January 2026"}
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <StreakBadge streak={streak} size="md" />
              <XPBadge xp={xp} size="md" />
            </div>

            {/* Edit Profile Button */}
            <SketchButton
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit2 size={14} className="mr-1" />
              Edit Profile
            </SketchButton>
          </SketchCard>

          <SketchCard className="md:col-span-2">
            <h3 className="font-hand text-xl mb-4">Maendeleo (Progress)</h3>
            <LevelProgress level={level} currentXP={currentLevelXP} requiredXP={requiredLevelXP} />
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div>
                <p className="font-hand text-2xl text-accent">42</p>
                <p className="font-hand-secondary text-xs text-muted-foreground">Lessons</p>
              </div>
              <div>
                <p className="font-hand text-2xl text-success">156</p>
                <p className="font-hand-secondary text-xs text-muted-foreground">Words</p>
              </div>
              <div>
                <p className="font-hand text-2xl text-warning">12h</p>
                <p className="font-hand-secondary text-xs text-muted-foreground">Time</p>
              </div>
            </div>
          </SketchCard>

          <SketchCard className="md:col-span-3">
            <h3 className="font-hand text-xl mb-4">Mafanikio (Achievements)</h3>
            <div className="flex flex-wrap gap-4">
              {allBadges.map((badge) => (
                <AchievementBadge key={badge} type={badge} unlocked={unlockedBadges.includes(badge)} showLabel />
              ))}
            </div>
          </SketchCard>
        </div>

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          initialData={profile}
          onSave={handleSaveProfile}
        />
      </AppLayout>
    </ProtectedRoute>
  );
}
