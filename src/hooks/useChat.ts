import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import * as api from '@/api/chat';
import type { Message } from '@/types/database/messages';
import { toast } from 'sonner';

export function useChat(agentIdOrSlug: string) {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // 1. Fetch Agent Details
  const { data: agent, isLoading: isLoadingAgent, error: agentError } = useQuery({
    queryKey: ['agent', agentIdOrSlug],
    queryFn: () => {
        // Simple heuristic: if it looks like a UUID, try ID, else Slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(agentIdOrSlug);
        if (isUuid) {
            return api.getAgentById(agentIdOrSlug);
        }
        return api.getAgentBySlug(agentIdOrSlug);
    },
    enabled: !!agentIdOrSlug,
    retry: false
  });

  // 2. Initialize Visitor & Session
  const initializeSession = async (consentGiven: boolean) => {
    try {
      if (!agent) return;

      // Create Visitor (In a real app, check for existing cookie)
      const visitor = await api.createVisitor({
        consent_given: consentGiven,
        browser_info: { userAgent: navigator.userAgent },
      });
      setVisitorId(visitor.id);

      // Create Session
      const session = await api.createSession({
        agent_id: agent.id,
        visitor_id: visitor.id,
        status: 'active',
        metadata: { referrer: document.referrer }
      });
      setSessionId(session.id);
      return session;
    } catch (error) {
      console.error('Failed to initialize session', error);
      toast.error('Failed to start chat session.');
    }
  };

  // 3. Fetch Messages
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', sessionId],
    queryFn: () => api.getMessages(sessionId!),
    enabled: !!sessionId,
  });

  // 4. Subscribe to Realtime Messages
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          queryClient.setQueryData(['messages', sessionId], (old: Message[] = []) => {
            if (old.find(m => m.id === newMessage.id)) return old;
            return [...old, newMessage];
          });
          
          if (newMessage.sender_type === 'agent') {
            setIsTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, queryClient]);

  // 5. Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!sessionId) throw new Error('No active session');
      return api.sendMessage({
        session_id: sessionId,
        sender_type: 'visitor',
        content,
      });
    },
    onSuccess: () => {
      // Simulate Agent Response (Mocking the backend LLM for now)
      setIsTyping(true);
      setTimeout(async () => {
        if (!sessionId) return;
        await api.sendMessage({
            session_id: sessionId,
            sender_type: 'agent',
            content: "Thank you for your message! I'm a demo agent. In a full implementation, I would process your input via LLM.",
        });
      }, 1500);
    },
    onError: () => {
      toast.error('Failed to send message');
    }
  });

  return {
    agent,
    isLoadingAgent,
    agentError,
    messages,
    isLoadingMessages,
    sessionId,
    visitorId,
    initializeSession,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    isTyping
  };
}
