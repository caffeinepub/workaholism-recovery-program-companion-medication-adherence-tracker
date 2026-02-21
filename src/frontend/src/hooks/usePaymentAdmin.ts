import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfileWithPrincipal } from '../backend';

export function useAdminListAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfileWithPrincipal[]>({
    queryKey: ['allUsersPayment'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminListAllUsers();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useTogglePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.togglePaymentStatus(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsersPayment'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserPaymentStatus(user: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['userPaymentStatus', user.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserPaymentStatus(user);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
