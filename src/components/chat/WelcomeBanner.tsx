import { useState } from 'react';
import type { Agent } from '@/types/database/agents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface WelcomeBannerProps {
  agent: Agent;
  onStart: () => void;
}

export function WelcomeBanner({ agent, onStart }: WelcomeBannerProps) {
  const [consent, setConsent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="flex flex-col items-center text-center space-y-4 pb-2">
            <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
              <AvatarImage src={agent.visuals?.avatar_url} />
              <AvatarFallback className="bg-accent text-accent-foreground text-xl">
                {agent.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{agent.name}</h1>
              <p className="text-muted-foreground mt-2">{agent.visuals?.welcome_message || "Hello! I'm here to help you."}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground border border-border/50">
              <p>{agent.description || "I can help you gather information and answer your questions."}</p>
            </div>
            
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox 
                id="consent" 
                checked={consent} 
                onCheckedChange={(c) => setConsent(c === true)}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground leading-tight cursor-pointer">
                I agree to the <a href="#" className="underline hover:text-primary">Privacy Policy</a> and consent to having this conversation processed by AI.
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg" 
              disabled={!consent}
              onClick={onStart}
            >
              Start Conversation
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
