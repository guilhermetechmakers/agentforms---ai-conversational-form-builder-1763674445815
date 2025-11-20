import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionProgressProps {
  requiredFields: string[];
  completedFields: string[];
}

export function SessionProgress({ requiredFields = [], completedFields = [] }: SessionProgressProps) {
  const progress = requiredFields.length > 0 
    ? (completedFields.length / requiredFields.length) * 100 
    : 0;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Progress</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="space-y-2">
          {requiredFields.map((field) => {
            const isCompleted = completedFields.includes(field);
            return (
              <div key={field} className="flex items-center text-sm">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground mr-2" />
                )}
                <span className={cn(isCompleted ? "text-foreground line-through opacity-70" : "text-muted-foreground")}>
                  {field}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
