import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EndScreenProps {
  onDownload?: () => void;
}

export function EndScreen({ onDownload }: EndScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="text-center border-none shadow-lg bg-secondary/30 backdrop-blur">
          <CardHeader className="flex flex-col items-center pb-2">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">Session Completed</h2>
            <p className="text-muted-foreground">Thank you for your time!</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm text-muted-foreground">
              We have received your responses. You can close this window now.
            </p>
            {onDownload && (
              <Button variant="outline" className="w-full" onClick={onDownload}>
                Download Conversation
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
