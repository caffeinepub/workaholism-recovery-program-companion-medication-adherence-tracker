import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CallerUserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<CallerUserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CallerUserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProfile(principal: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<CallerUserProfile | null>({
    queryKey: ['userProfile', principal.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetUserProfiles(principals: Principal[]) {
  const { actor, isFetching } = useActor();

  return useQuery<Map<string, CallerUserProfile | null>>({
    queryKey: ['userProfiles', principals.map((p) => p.toString()).sort()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const profileMap = new Map<string, CallerUserProfile | null>();
      await Promise.all(
        principals.map(async (principal) => {
          try {
            const profile = await actor.getUserProfile(principal);
            profileMap.set(principal.toString(), profile);
          } catch (error) {
            console.error(`Failed to fetch profile for ${principal.toString()}:`, error);
            profileMap.set(principal.toString(), null);
          }
        })
      );
      return profileMap;
    },
    enabled: !!actor && !isFetching && principals.length > 0,
    retry: false,
  });
}

export function useIsPaymentBlocked() {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  return {
    isBlocked: !isLoading && isFetched && userProfile !== null && userProfile !== undefined && !userProfile.hasPaid && !userProfile.isAdmin,
    isLoading,
  };
}
