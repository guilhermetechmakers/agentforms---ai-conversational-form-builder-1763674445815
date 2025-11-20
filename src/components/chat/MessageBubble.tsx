import type { Message } from '@/types/database/messages';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  agentAvatar?: string;
  agentName?: string;
}

export function MessageBubble({ message, agentAvatar, agentName }: MessageBubbleProps) {
  const isAgent = message.sender_type === 'agent';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-6",
        isAgent ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn("flex max-w-[80%] md:max-w-[70%]", isAgent ? "flex-row" : "flex-row-reverse")}>
        {/* Avatar for Agent only */}
        {isAgent && (
          <div className="flex-shrink-0 mr-3 mt-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={agentAvatar} />
              <AvatarFallback className="text-xs">{agentName?.substring(0,2)}</AvatarFallback>
            </Avatar>
          </div>
        )}

        <div className={cn("flex flex-col", isAgent ? "items-start" : "items-end")}>
          <div 
            className={cn(
              "relative px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
              isAgent 
                ? "bg-secondary text-secondary-foreground rounded-tl-none" 
                : "bg-primary text-primary-foreground rounded-tr-none"
            )}
          >
            {message.content}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 px-1">
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
