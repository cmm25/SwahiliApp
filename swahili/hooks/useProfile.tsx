'use client';

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: { display_name?: string; avatar?: string }) => Promise<{ error: Error | null }>;
  refetch: () => Promise<void>;
}

// Helper to get untyped supabase client for tables not yet in generated types
const getUntypedClient = () => supabase as any;

export function useProfile(): UseProfileReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await getUntypedClient()
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError) {
        // Profile might not exist yet (new user)
        if (fetchError.code === "PGRST116") {
          setProfile(null);
        } else {
          throw fetchError;
        }
      } else {
        setProfile(data as Profile);
      }
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: { display_name?: string; avatar?: string }) => {
    if (!user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      // Use upsert to handle cases where profile might not exist (e.g. trigger failed)
      const { error: updateError } = await getUntypedClient()
        .from("profiles")
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (updateError) throw updateError;

      // Refetch to get updated data
      await fetchProfile();
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
