import { Users, Map, FileClock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CommunityLinks() {
  const links = [
    {
      title: 'Community Forum',
      icon: Users,
      description: 'Connect with other builders',
      href: '#',
    },
    {
      title: 'Product Roadmap',
      icon: Map,
      description: 'See what we are building',
      href: '#',
    },
    {
      title: 'Changelog',
      icon: FileClock,
      description: 'Latest updates and fixes',
      href: '#',
    },
  ];

  return (
    <Card className="border-muted bg-card/50 h-fit sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Community Resources</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {links.map((link) => (
          <Button
            key={link.title}
            variant="outline"
            className="h-auto w-full justify-start gap-4 whitespace-normal p-4 text-left hover:border-primary hover:bg-muted/50"
            asChild
          >
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <div className="rounded-full bg-primary/10 p-2">
                <link.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold flex items-center gap-2">
                  {link.title}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {link.description}
                </p>
              </div>
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
