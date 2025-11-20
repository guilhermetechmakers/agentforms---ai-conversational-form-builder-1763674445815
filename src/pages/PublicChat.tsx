import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '@/hooks/useChat';
import { WelcomeBanner } from '@/components/chat/WelcomeBanner';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { InputArea } from '@/components/chat/InputArea';
import { SessionProgress } from '@/components/chat/SessionProgress';
import { EndScreen } from '@/components/chat/EndScreen';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from 'sonner';

export default function PublicChat() {
  const { agentSlug } = useParams<{ agentSlug: string }>();
  const { 
    agent, 
    isLoadingAgent, 
    agentError, 
    messages, 
    sessionId, 
    initializeSession, 
    sendMessage, 
    isSending,
    isTyping 
  } = useChat(agentSlug || '');

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sessionCompleted] = useState(false);

  if (isLoadingAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md px-4">
           <Skeleton className="h-12 w-12 rounded-full mx-auto" />
           <Skeleton className="h-8 w-3/4 mx-auto" />
           <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (agentError || !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-center p-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Agent Not Found</h1>
          <p className="text-muted-foreground">The agent you are looking for does not exist or is not available.</p>
        </div>
      </div>
    );
  }

  // 1. Show Welcome Banner if no session
  if (!sessionId) {
    return <WelcomeBanner agent={agent} onStart={() => initializeSession(true)} />;
  }

  // 3. Show End Screen
  if (sessionCompleted) {
    return <EndScreen />;
  }

  // 2. Show Chat Interface
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster />
      
      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden absolute top-4 right-4 z-50">
        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[300px]">
            <SessionProgress 
              requiredFields={Object.keys(agent.schema?.properties || {})} 
              completedFields={[]} // TODO: Connect to actual validation logic
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 border-r border-border bg-secondary/10 p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
               {agent.name.substring(0,2)}
            </div>
            {agent.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {agent.description}
          </p>
        </div>
        <SessionProgress 
           requiredFields={Object.keys(agent.schema?.properties || {})} 
           completedFields={[]} 
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 relative">
                    <ChatWindow 
                        messages={messages} 
                        agent={agent} 
                        isTyping={isTyping}
                    />
                    {/* Gradient overlay for scroll cue */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
        
        <div className="z-20">
            <InputArea 
                onSend={sendMessage} 
                isSending={isSending} 
            />
        </div>
      </div>
    </div>
  );
}
