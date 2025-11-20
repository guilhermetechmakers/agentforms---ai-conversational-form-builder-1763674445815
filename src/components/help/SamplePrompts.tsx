import { Copy, Check, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { SamplePrompt } from '@/types/database/sample_prompts';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface SamplePromptsProps {
  prompts: SamplePrompt[];
  isLoading: boolean;
}

export function SamplePrompts({ prompts, isLoading }: SamplePromptsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No sample prompts found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {prompts.map((prompt) => (
        <Card key={prompt.id} className="relative overflow-hidden border-muted bg-card/50 transition-all hover:border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <CardTitle className="text-base">{prompt.title}</CardTitle>
            </div>
            {prompt.description && (
              <CardDescription>{prompt.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="relative rounded-md bg-muted/50 p-4 font-mono text-sm text-muted-foreground">
              {prompt.example}
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard(prompt.example, prompt.id)}
              >
                {copiedId === prompt.id ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy prompt</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
