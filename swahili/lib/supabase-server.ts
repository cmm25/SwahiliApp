import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createClientJs } from '@supabase/supabase-js';
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. Client for Server Components / Server Actions (User Context)
export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing user sessions.
                    }
                },
            },
        },
    );
};

// 2. Admin Client for Background Agents (Bypass RLS)
// Only use this when you specifically need admin privileges (e.g. Evaluator writing scores)
export const supabaseAdmin = createClientJs(
    supabaseUrl,
    serviceRoleKey || supabaseKey // Fallback to anon key if service role missing (limited access)
);
