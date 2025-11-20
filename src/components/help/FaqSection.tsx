import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Faq } from '@/types/database/faqs';
import { Skeleton } from '@/components/ui/skeleton';

interface FaqSectionProps {
  faqs: Faq[];
  isLoading: boolean;
}

export function FaqSection({ faqs, isLoading }: FaqSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No FAQs found.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-left text-base hover:text-primary transition-colors">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
