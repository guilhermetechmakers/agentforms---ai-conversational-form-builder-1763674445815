import { useMutation } from '@tanstack/react-query';
import { createSupportTicket } from '@/api/support';
import type { SupportTicketInsert } from '@/types/database/support_tickets';
import { toast } from 'sonner';

export function useCreateSupportTicket() {
  return useMutation({
    mutationFn: (ticket: SupportTicketInsert) => createSupportTicket(ticket),
    onSuccess: () => {
      toast.success('Support ticket created successfully');
      // Invalidate tickets query if we had one (e.g. listing user tickets)
      // queryClient.invalidateQueries({ queryKey: ['myTickets'] });
    },
    onError: (error) => {
      toast.error(`Failed to create ticket: ${error.message}`);
    },
  });
}
