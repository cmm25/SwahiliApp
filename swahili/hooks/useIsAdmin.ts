import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AdminState {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useIsAdmin(): AdminState {
  const { user } = useAuth();
  const [state, setState] = useState<AdminState>({
    isAdmin: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function checkAdminRole() {
      if (!user?.id) {
        setState({ isAdmin: false, isLoading: false, error: null });
        return;
      }

      try {
        // Query user_roles table for admin role
        const { data, error } = await (supabase
          .from('user_roles' as never)
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle() as unknown as Promise<{ 
            data: { role: string } | null; 
            error: Error | null 
          }>);

        if (error) {
          console.error('Error checking admin role:', error);
          setState({ isAdmin: false, isLoading: false, error: error.message });
          return;
        }

        setState({
          isAdmin: !!data,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('Failed to check admin status:', err);
        setState({
          isAdmin: false,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    checkAdminRole();
  }, [user?.id]);

  return state;
}
