import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ConversationSession {
  id: string;
  title: string;
  messages: Message[];
  context: Record<string, any>;
}

const getUntypedClient = () => supabase as any;

export function useConversation() {
  const { user, session: authSession } = useAuth();
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing session on mount
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadSession = async () => {
      try {
        const { data, error } = await getUntypedClient()
          .from("conversation_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSession({
            id: data.id,
            title: data.title,
            messages: data.messages as unknown as Message[], // Cast JSONB to Message[]
            context: data.context as Record<string, any>,
          });
        } else {
          // Initialize with greeting if no session exists
          setSession({
            id: "", // Temporary ID until saved
            title: "Chat with Rafiki",
            messages: [
              {
                role: "assistant",
                content: "Habari! Jina langu ni Rafiki. Ninaweza kukusaidia kujifunza Kiswahili. (Hello! My name is Rafiki. I can help you learn Swahili.)",
                timestamp: new Date().toISOString()
              }
            ],
            context: {}
          });
        }
      } catch (err) {
        console.error("Error loading conversation session:", err);
        setError("Failed to load conversation history.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!user || !authSession) return;

    setError(null);
    setIsLoading(true);

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    const updatedMessages = [...(session?.messages || []), userMessage];
    setSession(prev => prev ? { ...prev, messages: updatedMessages } : null);

    try {
      // 1. Save User Message to DB (Create or Update Session)
      let currentSessionId = session?.id;

      if (currentSessionId) {
        await getUntypedClient()
          .from("conversation_sessions")
          .update({
            messages: updatedMessages as any, // Supabase expects JSON
            updated_at: new Date().toISOString()
          })
          .eq("id", currentSessionId);
      } else {
        const { data, error } = await getUntypedClient()
          .from("conversation_sessions")
          .insert({
            user_id: user.id,
            title: "Chat with Rafiki",
            messages: updatedMessages as any,
            context: {},
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          currentSessionId = data.id;
          setSession({
            id: data.id,
            title: data.title,
            messages: data.messages as unknown as Message[],
            context: data.context as Record<string, any>,
          });
        }
      }

      // 2. Call AI Agent API
      const response = await fetch('/api/agents/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authSession.access_token}`
        },
        body: JSON.stringify({
          message: content,
          history: updatedMessages,
          sessionId: currentSessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Rafiki');
      }

      const data = await response.json();
      const aiMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString()
      };

      // 3. Save AI Message to DB
      const finalMessages = [...updatedMessages, aiMessage];
      
      if (currentSessionId) {
        await getUntypedClient()
          .from("conversation_sessions")
          .update({
            messages: finalMessages as any,
            updated_at: new Date().toISOString()
          })
          .eq("id", currentSessionId);
      }

      setSession(prev => prev ? { ...prev, messages: finalMessages } : null);

    } catch (err) {
      console.error("Chat Error:", err);
      setError("Rafiki is having trouble responding right now. Please try again.");
      // Rollback optimistic update if needed, but for chat usually keeping user input is better
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user) return;
    
    // In a real app, you might want to archive the session instead of deleting
    // For now, we'll just start a fresh local state or create a new session row
    setSession({
      id: "",
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          content: "Habari! Tuanze upya? (Hi! Shall we start over?)",
          timestamp: new Date().toISOString()
        }
      ],
      context: {}
    });
  };

  return { 
    messages: session?.messages || [], 
    sendMessage, 
    isLoading, 
    error,
    clearHistory 
  };
}
