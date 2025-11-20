import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, FileText, Bot, LifeBuoy, Home } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { logError } from "@/api/error_logs";
import { searchAll, type SearchResult } from "@/api/search";
import { useDebounce } from "@/hooks/use-debounce";

export default function NotFound() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // Log the 404 error
    const log404 = async () => {
      await logError({
        error_page: location.pathname,
        referrer_url: document.referrer || null,
        error_type: '404',
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
    };

    log404();
  }, [location.pathname]);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchAll(debouncedSearchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            AgentForms
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link to="/agent-builder" className="text-muted-foreground hover:text-foreground transition-colors">Builder</Link>
          <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>

        <div className="w-full max-w-2xl mx-auto relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-foreground">
              Page not found
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="h-11 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-8 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all">
              <Link to="/help">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto space-y-4 pt-8"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="search"
                  placeholder="Search for agents or documentation..."
                  className="pl-10 h-12 bg-card/50 backdrop-blur-xl border-white/10 focus:border-primary/50 transition-all rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <AnimatePresence>
              {(searchResults.length > 0 || (isSearching && searchQuery)) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="border-white/10 bg-card/50 backdrop-blur-xl">
                    <CardContent className="p-2">
                      {isSearching ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                          Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <ul className="space-y-1">
                          {searchResults.map((result) => (
                            <li key={`${result.type}-${result.id}`}>
                              <Link
                                to={result.url}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group text-left"
                              >
                                <div className="mt-0.5 h-8 w-8 rounded-md bg-accent/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                  {result.type === 'document' ? (
                                    <FileText className="h-4 w-4" />
                                  ) : (
                                    <Bot className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="overflow-hidden">
                                  <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                    {result.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {result.description}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/40 bg-background/95 backdrop-blur text-center text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
          <Link to="/privacy-terms" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <span className="hidden sm:inline text-border">•</span>
          <Link to="/privacy-terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <span className="hidden sm:inline text-border">•</span>
          <Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link>
        </div>
        <p>© {new Date().getFullYear()} AgentForms. All rights reserved.</p>
      </footer>
    </div>
  );
}
