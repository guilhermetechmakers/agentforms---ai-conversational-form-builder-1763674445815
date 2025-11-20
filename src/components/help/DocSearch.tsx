import { FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HelpDocument } from '@/types/database/help_documents';
import { Skeleton } from '@/components/ui/skeleton';

interface DocSearchProps {
  docs: HelpDocument[];
  isLoading: boolean;
  searchQuery: string;
}

export function DocSearch({ docs, isLoading, searchQuery }: DocSearchProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No documents found matching "{searchQuery}".</p>
      </div>
    );
  }

  // Group by category if not searching (or even if searching, but flat list might be better for search)
  // For simplicity, I'll display as cards.
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {docs.map((doc) => (
        <Card key={doc.id} className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-muted bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold group-hover:text-primary transition-colors">
              <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              {doc.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {doc.content}
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              Read Guide <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
