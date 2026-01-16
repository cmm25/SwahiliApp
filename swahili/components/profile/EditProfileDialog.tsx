'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SketchButton } from "@/components/shared/SketchButton";
import { AvatarSelector } from "./AvatarSelector";
import { ProfileAvatar } from "./ProfileAvatar";
import { toast } from "sonner";

interface ProfileData {
  displayName: string;
  avatar: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProfileData;
  onSave: (data: ProfileData) => Promise<void>;
}

export function EditProfileDialog({ 
  open, 
  onOpenChange, 
  initialData,
  onSave 
}: EditProfileDialogProps) {
  const [displayName, setDisplayName] = useState(initialData.displayName);
  const [avatar, setAvatar] = useState(initialData.avatar);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error("Please enter a display name");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ displayName: displayName.trim(), avatar });
      toast.success("Profile updated successfully! 🎉");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Edit Your Profile ✏️
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose your Big Five avatar and update your name
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <ProfileAvatar avatarId={avatar} size="xl" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background px-2 py-0.5 rounded-full border text-xs font-medium">
                Preview
              </div>
            </div>
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="text-center block text-sm font-medium">
              Choose Your Spirit Animal
            </Label>
            <AvatarSelector
              selectedAvatar={avatar}
              onSelect={setAvatar}
              size="md"
            />
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name..."
              className="text-center text-lg"
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground text-center">
              This is how others will see you
            </p>
          </div>

          {/* Save Button */}
          <SketchButton
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save Changes 💾"}
          </SketchButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
