import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string | null;
    totalXp: number;
}

interface UseStreakReturn {
    streak: number;
    longestStreak: number;
    xp: number;
    isLoading: boolean;
    error: Error | null;
    logActivity: () => Promise<{ error: Error | null }>;
    addXp: (amount: number) => Promise<{ error: Error | null }>;
    refetch: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUntypedClient = () => supabase as any;

export function useStreak(): UseStreakReturn {
    const { user, session } = useAuth();
    const [streakData, setStreakData] = useState<StreakData>({
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        totalXp: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchStreak = useCallback(async () => {
        if (!user) {
            setStreakData({ currentStreak: 0, longestStreak: 0, lastActivityDate: null, totalXp: 0 });
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const { data, error: fetchError } = await getUntypedClient()
                .from("user_streaks")
                .select("*")
                .eq("user_id", user.id)
                .maybeSingle();

            if (fetchError) {
                throw fetchError;
            }

            if (data) {
                // Check if streak should be reset (missed a day)
                const lastActivity = data.last_activity_date ? new Date(data.last_activity_date) : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let currentStreak = data.current_streak;

                if (lastActivity) {
                    const lastActivityDay = new Date(lastActivity);
                    lastActivityDay.setHours(0, 0, 0, 0);

                    const diffDays = Math.floor((today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24));

                    // If more than 1 day has passed, streak is broken (but we don't update DB here, just show 0)
                    if (diffDays > 1) {
                        currentStreak = 0;
                    }
                }

                setStreakData({
                    currentStreak,
                    longestStreak: data.longest_streak,
                    lastActivityDate: data.last_activity_date,
                    totalXp: data.total_xp || 0,
                });
            } else {
                // No streak record exists yet
                setStreakData({ currentStreak: 0, longestStreak: 0, lastActivityDate: null, totalXp: 0 });
            }
        } catch (err) {
            const message = getErrorMessage(err);
            if (isAbortError(message)) {
                return;
            }
            setError(err as Error);
            console.error("Error fetching streak:", message);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchStreak();
    }, [fetchStreak]);

    const logActivity = useCallback(async () => {
        if (!user || !session?.access_token) {
            return { error: new Error("Not authenticated") };
        }

        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

            // Insert activity (trigger will handle streak update)
            const { error: insertError } = await getUntypedClient()
                .from("user_activity")
                .upsert(
                    { user_id: user.id, activity_date: today, activity_type: "general" },
                    { onConflict: "user_id,activity_date" }
                );

            if (insertError) {
                throw insertError;
            }

            // Refetch streak data to get updated values
            await fetchStreak();

            return { error: null };
        } catch (err) {
            const message = getErrorMessage(err);
            if (isAbortError(message)) {
                return { error: null };
            }
            console.error("Error logging activity:", message);
            return { error: err as Error };
        }
    }, [fetchStreak, session?.access_token, user]);

    const addXp = async (amount: number) => {
        if (!user) {
            return { error: new Error("Not authenticated") };
        }

        try {
            const { error: rpcError } = await getUntypedClient()
                .rpc("add_user_xp", { p_user_id: user.id, p_amount: amount });

            if (rpcError) {
                throw rpcError;
            }

            // Refetch to get updated XP
            await fetchStreak();

            return { error: null };
        } catch (err) {
            const message = getErrorMessage(err);
            if (isAbortError(message)) {
                return { error: null };
            }
            console.error("Error adding XP:", message);
            return { error: err as Error };
        }
    };

    return {
        streak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        xp: streakData.totalXp,
        isLoading,
        error,
        logActivity,
        addXp,
        refetch: fetchStreak,
    };
}

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === "object" && err !== null && "message" in err) {
        const value = (err as { message?: unknown }).message;
        if (typeof value === "string") {
            return value;
        }
    }
    return String(err);
}

function isAbortError(message: string): boolean {
    return message.includes("AbortError");
}
