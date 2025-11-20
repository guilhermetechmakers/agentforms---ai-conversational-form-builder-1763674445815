import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputAreaProps {
  onSend: (content: string) => void;
  isSending: boolean;
  placeholder?: string;
}

export function InputArea({ onSend, isSending, placeholder = "Type a message..." }: InputAreaProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!content.trim() || isSending) return;
    onSend(content);
    setContent('');
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border/40">
      <div className="max-w-3xl mx-auto relative flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full text-muted-foreground hover:text-foreground mb-1"
          title="Add attachment"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="min-h-[44px] w-full resize-none rounded-2xl border-border bg-secondary/50 py-3 pl-4 pr-12 focus:ring-1 focus:ring-primary focus-visible:ring-offset-0"
          />
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSending}
            size="icon"
            className={cn(
              "absolute right-1.5 bottom-1.5 h-8 w-8 rounded-full transition-all duration-200",
              content.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted"
            )}
          >
             {isSending ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
             ) : (
                <ArrowUp className="h-5 w-5" />
             )}
          </Button>
        </div>
      </div>
      <div className="text-center mt-2">
         <p className="text-[10px] text-muted-foreground">
           Powered by AgentForms
         </p>
      </div>
    </div>
  );
}
