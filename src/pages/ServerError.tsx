import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, RefreshCw, Home, Bot, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react"; // Using motion/react as per instructions
import { createErrorReport } from "@/api/error_reports";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ServerError() {
  const [isReporting, setIsReporting] = useState(false);
  const [reportDetails, setReportDetails] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  
  // Generate a session ID or retrieve from storage/context if available
  // For this error page, we'll just use a generated one or placeholder if not available
  const sessionId = "session_" + Math.random().toString(36).substring(2, 15);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleReportSubmit = async () => {
    if (!reportDetails.trim()) {
      toast.error("Please provide some details about what you were doing.");
      return;
    }

    setIsReporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await createErrorReport({
        user_id: user?.id || null,
        session_id: sessionId,
        error_details: reportDetails,
        status: 'open',
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });

      setReportSuccess(true);
      toast.success("Report submitted successfully");
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

  const handleCloseReport = () => {
    setReportOpen(false);
    // Reset state after closing
    setTimeout(() => {
      setReportSuccess(false);
      setReportDetails("");
    }, 300);
  };

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
          <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[100px]" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[100px]" />
        </div>

        <div className="w-full max-w-2xl mx-auto relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2 flex flex-col items-center"
          >
            <div className="h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6 animate-pulse">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20">
              500 Error
            </h1>
            <h2 className="text-2xl font-semibold text-foreground">
              Something went wrong
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We apologize for the inconvenience. An unexpected error occurred on our servers. 
              Our team has been notified.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" onClick={handleRetry} className="h-11 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Dialog open={reportOpen} onOpenChange={setReportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="h-11 px-8 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Report Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                {reportSuccess ? (
                  <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <DialogHeader>
                      <DialogTitle>Report Submitted</DialogTitle>
                      <DialogDescription>
                        Thank you for your feedback. We'll investigate this issue shortly.
                      </DialogDescription>
                    </DialogHeader>
                    <Button onClick={handleCloseReport} className="mt-4">
                      Close
                    </Button>
                  </div>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Report Server Issue</DialogTitle>
                      <DialogDescription>
                        Please describe what you were doing when the error occurred. This helps us fix it faster.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="details">Error Details</Label>
                        <Textarea
                          id="details"
                          placeholder="I was trying to..."
                          value={reportDetails}
                          onChange={(e) => setReportDetails(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Session ID</Label>
                        <div className="text-xs font-mono bg-muted p-2 rounded select-all">
                          {sessionId}
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setReportOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleReportSubmit} disabled={isReporting}>
                        {isReporting ? "Submitting..." : "Submit Report"}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-8"
          >
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
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
