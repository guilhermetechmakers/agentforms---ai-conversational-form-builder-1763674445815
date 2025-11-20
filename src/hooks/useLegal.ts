import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUserRequest, getUserRequests } from '@/api/legal';
import type { UserRequestInsert } from '@/types/database/user_requests';
import { toast } from 'sonner';

export function useCreateUserRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UserRequestInsert) => createUserRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRequests'] });
      toast.success('Request submitted successfully. We will get back to you shortly.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit request: ${error.message}`);
    },
  });
}

export function useUserRequests(userId: string | undefined) {
  return useQuery({
    queryKey: ['userRequests', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return getUserRequests(userId);
    },
    enabled: !!userId,
  });
}
