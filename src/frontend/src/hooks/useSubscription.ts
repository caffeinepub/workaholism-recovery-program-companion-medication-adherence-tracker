import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfileWithPrincipal } from '../backend';

export function useAdminListAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfileWithPrincipal[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminListAllUsers();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useAdminSetUserSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, durationDays }: { user: Principal; durationDays: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminSetUserSubscription(user, BigInt(durationDays));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCheckSubscriptionActive() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['subscriptionActive'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkSubscriptionActive();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
