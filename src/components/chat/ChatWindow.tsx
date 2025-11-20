import { useEffect, useRef } from 'react';
import type { Message } from '@/types/database/messages';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Agent } from '@/types/database/agents';
import { motion } from 'framer-motion';

interface ChatWindowProps {
  messages: Message[];
  agent: Agent;
  isTyping?: boolean;
}

export function ChatWindow({ messages, agent, isTyping }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1 p-4 md:p-6 h-full">
      <div className="flex flex-col max-w-3xl mx-auto pb-4">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            agentAvatar={agent.visuals?.avatar_url}
            agentName={agent.name}
          />
        ))}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex justify-start mb-6"
          >
             <div className="flex items-center bg-secondary px-4 py-3 rounded-2xl rounded-tl-none space-x-1 shadow-sm ml-11">
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
             </div>
          </motion.div>
        )}
        
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
