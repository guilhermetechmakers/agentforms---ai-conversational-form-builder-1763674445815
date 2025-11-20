import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpHeader } from '@/components/help/HelpHeader';
import { DocSearch } from '@/components/help/DocSearch';
import { FaqSection } from '@/components/help/FaqSection';
import { SamplePrompts } from '@/components/help/SamplePrompts';
import { SupportForm } from '@/components/help/SupportForm';
import { CommunityLinks } from '@/components/help/CommunityLinks';
import { useHelpDocuments, useFaqs, useSamplePrompts } from '@/hooks/useHelp';

export default function AboutHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  
  return (
    <div className="min-h-screen bg-background pb-12">
      <HelpHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <Tabs defaultValue="docs" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="docs">Guides</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="docs" className="m-0">
                   <DocsTabContent query={debouncedQuery} />
                </TabsContent>
                <TabsContent value="faqs" className="m-0">
                   <FaqsTabContent query={debouncedQuery} />
                </TabsContent>
                <TabsContent value="prompts" className="m-0">
                   <PromptsTabContent /> 
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="lg:hidden">
                <SupportForm />
            </div>
          </div>
          
          <div className="hidden space-y-8 lg:block">
            <CommunityLinks />
            <SupportForm />
          </div>
          
          <div className="lg:hidden">
             <CommunityLinks />
          </div>
        </div>
      </div>
    </div>
  );
}

function DocsTabContent({ query }: { query: string }) {
    const { data: docs, isLoading } = useHelpDocuments(query);
    return <DocSearch docs={docs || []} isLoading={isLoading} searchQuery={query} />;
}

function FaqsTabContent({ query }: { query: string }) {
    const { data: faqs, isLoading } = useFaqs(query);
    return <FaqSection faqs={faqs || []} isLoading={isLoading} />;
}

function PromptsTabContent() {
    const { data: prompts, isLoading } = useSamplePrompts();
    return <SamplePrompts prompts={prompts || []} isLoading={isLoading} />;
}
