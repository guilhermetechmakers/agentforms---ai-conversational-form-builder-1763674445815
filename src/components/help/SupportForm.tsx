import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCreateSupportTicket } from '@/hooks/useSupport';

const ticketSchema = z.object({
  issue_description: z.string().min(10, 'Description must be at least 10 characters'),
  session_id: z.string().optional(), // In a real app, might validate UUID format if provided
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export function SupportForm() {
  const { mutate: createTicket, isPending } = useCreateSupportTicket();
  const [success, setSuccess] = useState(false);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      issue_description: '',
      session_id: '',
    },
  });

  function onSubmit(data: TicketFormValues) {
    createTicket(
      {
        issue_description: data.issue_description,
        session_id: data.session_id || null,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          form.reset();
          setTimeout(() => setSuccess(false), 5000);
        },
      }
    );
  }

  return (
    <Card className="border-muted bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Contact Support
        </CardTitle>
        <CardDescription>
          Need help with a specific issue? Submit a ticket and we'll get back to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="rounded-lg bg-green-500/10 p-6 text-center text-green-500">
            <h3 className="mb-2 font-semibold">Ticket Submitted!</h3>
            <p className="text-sm">Thank you for contacting us. We have received your request.</p>
            <Button 
              variant="link" 
              onClick={() => setSuccess(false)} 
              className="mt-4 text-green-500 underline"
            >
              Submit another ticket
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="issue_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How can we help?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your issue in detail..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="session_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. uuid-..." {...field} />
                    </FormControl>
                    <FormDescription>
                      If this is regarding a specific chat session, please include the ID.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
