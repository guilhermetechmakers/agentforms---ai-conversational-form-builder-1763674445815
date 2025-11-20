import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, FileText, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useCreateUserRequest, useUserRequests } from "@/hooks/useLegal";
import { toast } from "sonner";

// Form Schema
const requestFormSchema = z.object({
  requestType: z.enum(["data_deletion", "information_inquiry"], {
    message: "Please select a request type.",
  }),
  requestContent: z.string().min(10, {
    message: "Request content must be at least 10 characters.",
  }),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

export default function PrivacyTerms() {
  const [userId, setUserId] = useState<string | null>(null);
  const { mutate: submitRequest, isPending } = useCreateUserRequest();
  const { data: requests } = useUserRequests(userId || undefined);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestType: "information_inquiry",
      requestContent: "",
    },
  });

  function onSubmit(data: RequestFormValues) {
    if (!userId) {
      toast.error("You must be logged in to submit a request.");
      return;
    }

    submitRequest({
      user_id: userId,
      request_type: data.requestType,
      request_content: data.requestContent,
    }, {
      onSuccess: () => {
        form.reset();
      }
    });
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 max-w-4xl space-y-8"
    >
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Privacy & Terms</h1>
        <p className="text-lg text-muted-foreground">
          We are committed to protecting your privacy and ensuring transparency in how we handle your data.
          Please review our policies below.
        </p>
      </div>

      {/* Navigation / TOC */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => scrollToSection("privacy-policy")}>
          <Lock className="mr-2 h-4 w-4" /> Privacy Policy
        </Button>
        <Button variant="outline" onClick={() => scrollToSection("terms-of-service")}>
          <FileText className="mr-2 h-4 w-4" /> Terms of Service
        </Button>
        <Button variant="outline" onClick={() => scrollToSection("cookie-policy")}>
          <AlertCircle className="mr-2 h-4 w-4" /> Cookie Policy
        </Button>
        <Button variant="outline" onClick={() => scrollToSection("legal-requests")}>
          <Mail className="mr-2 h-4 w-4" /> Legal Requests
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-8">
        {/* Privacy Policy */}
        <Card id="privacy-policy" className="scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              Privacy Policy
            </CardTitle>
            <CardDescription>Last updated: November 2025</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
            <h3>1. Data Collection</h3>
            <p>
              We collect information you provide directly to us, such as when you create an account, use our interactive features, or communicate with us. This may include your name, email address, and payment information. We also automatically collect certain information when you use our services, including your IP address, device type, and usage data.
            </p>
            <h3>2. Data Usage</h3>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you. We may also use this data to analyze trends and personalize your experience.
            </p>
            <h3>3. Data Sharing</h3>
            <p>
              We do not share your personal information with third parties except as described in this policy. We may share data with service providers who perform services on our behalf, or when required by law.
            </p>
            <h3>4. Data Retention</h3>
            <p>
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy. You may request deletion of your data at any time.
            </p>
          </CardContent>
        </Card>

        {/* Terms of Service */}
        <Card id="terms-of-service" className="scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Terms of Service
            </CardTitle>
            <CardDescription>Please read these terms carefully before using our service.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
            </p>
            <h3>2. User Responsibilities</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to use our services for any illegal or unauthorized purpose.
            </p>
            <h3>3. Prohibited Uses</h3>
            <p>
              You may not use our services to transmit any malware, spam, or other harmful content. You may not attempt to gain unauthorized access to our systems or interfere with the proper working of our services.
            </p>
            <h3>4. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Policy */}
        <Card id="cookie-policy" className="scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              Cookie Policy
            </CardTitle>
            <CardDescription>How we use cookies and similar technologies.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
            <p>
              We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </CardContent>
        </Card>

        {/* Legal Requests */}
        <div id="legal-requests" className="scroll-mt-20">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="contact-form" className="border-none">
              <Card>
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardHeader className="p-0 w-full text-left">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      Contact for Legal Requests
                    </CardTitle>
                    <CardDescription>
                      Submit a request regarding your data or other legal inquiries.
                    </CardDescription>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="mt-4 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="bg-muted/50 p-4 rounded-lg text-sm flex-1 mr-4">
                        <p>
                          For general support, please visit our Help Center. Use this form strictly for legal inquiries such as GDPR data deletion requests or information inquiries.
                          <br />
                          Or email us directly at: <a href="mailto:legal@agentforms.ai" className="text-primary hover:underline">legal@agentforms.ai</a>
                        </p>
                      </div>
                      {userId && (
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                              View My Requests
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>My Legal Requests</SheetTitle>
                              <SheetDescription>
                                History of your data deletion and information inquiries.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                              <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                                <div className="space-y-4">
                                  {requests?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                      No requests found.
                                    </p>
                                  ) : (
                                    requests?.map((req) => (
                                      <div key={req.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                                            {req.request_type.replace('_', ' ')}
                                          </span>
                                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                            req.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                            req.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                          }`}>
                                            {req.status}
                                          </span>
                                        </div>
                                        <p className="text-sm line-clamp-3">{req.request_content}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(req.created_at).toLocaleDateString()}
                                        </p>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </ScrollArea>
                            </div>
                          </SheetContent>
                        </Sheet>
                      )}
                    </div>

                    {!userId ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/30 rounded-lg border border-dashed">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          You must be logged in to submit a verified legal request via this form.
                        </p>
                        <Button asChild variant="secondary">
                          <a href="/login">Log In</a>
                        </Button>
                      </div>
                    ) : (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="requestType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Request Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a request type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="information_inquiry">Information Inquiry</SelectItem>
                                    <SelectItem value="data_deletion">Data Deletion (GDPR/CCPA)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Select the category that best describes your legal request.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="requestContent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Request Details</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please provide detailed information about your request..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Include specific details to help us process your request efficiently.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" disabled={isPending}>
                            {isPending ? (
                              <>Processing...</>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Submit Request
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t pt-8 mt-12">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a href="/help" className="hover:text-foreground transition-colors">Help Center</a>
          <span>&middot;</span>
          <a href="/" className="hover:text-foreground transition-colors">Dashboard</a>
          <span>&middot;</span>
          <a href="mailto:contact@agentforms.ai" className="hover:text-foreground transition-colors">Contact Support</a>
        </div>
      </div>
    </motion.div>
  );
}
