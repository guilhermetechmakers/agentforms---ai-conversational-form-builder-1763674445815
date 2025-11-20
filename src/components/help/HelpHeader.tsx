import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HelpHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function HelpHeader({ searchQuery, onSearchChange }: HelpHeaderProps) {
  return (
    <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-12">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl text-primary">
          How can we help?
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Find guides, FAQs, and sample prompts to help you build better agents.
        </p>
        <div className="relative w-full max-w-xl mt-4">
          <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for answers..."
            className="h-12 w-full rounded-full border-muted bg-background pl-12 text-lg shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
