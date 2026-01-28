'use client';

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function useConversation() {
    const { session } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Habari! Jina langu ni Rafiki. Ninaweza kukusaidia kujifunza Kiswahili. (Hello! My name is Rafiki. I can help you learn Swahili.)' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sessionIdRef = useRef<string | null>(null);

    if (sessionIdRef.current === null && typeof window !== 'undefined') {
        const storageKey = 'rafiki_session_id';
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            sessionIdRef.current = stored;
        } else {
            const newId =
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                    ? crypto.randomUUID()
                    : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            localStorage.setItem(storageKey, newId);
            sessionIdRef.current = newId;
        }
    }

    const sendMessage = useCallback(async (content: string) => {
        if (!session?.access_token) {
            setError("You must be logged in to chat.");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Add user message immediately for UI responsiveness
            const userMessage: Message = { role: 'user', content };
            setMessages(prev => [...prev, userMessage]);

            // Call the API
            const response = await fetch('/api/agents/conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    message: content,
                    history: messages, // Send previous context
                    sessionId: sessionIdRef.current ?? undefined
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from Rafiki');
            }

            const data = await response.json();
            const aiMessage: Message = { role: 'assistant', content: data.content };

            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error("Chat Error:", err);
            setError("Rafiki is having trouble responding right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [messages, session]);

    const clearHistory = useCallback(() => {
        setMessages([
            { role: 'assistant', content: 'Habari! Tuanze upya? (Hi! Shall we start over?)' }
        ]);
    }, []);

    return {
        messages,
        sendMessage,
        isLoading,
        error,
        clearHistory
    };
}
