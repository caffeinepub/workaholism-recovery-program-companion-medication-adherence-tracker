import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { CallerUserProfile } from '../backend';

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

export function useGetUserProfile(user: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CallerUserProfile | null>({
    queryKey: ['userProfile', user.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserProfile(user);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useBatchGetUserProfiles(principals: Principal[]) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Map<string, CallerUserProfile>>({
    queryKey: ['batchUserProfiles', principals.map((p) => p.toString()).sort()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');

      const profileMap = new Map<string, CallerUserProfile>();

      await Promise.all(
        principals.map(async (principal) => {
          try {
            const profile = await actor.getUserProfile(principal);
            if (profile) {
              profileMap.set(principal.toString(), profile);
            }
          } catch (error) {
            console.error(`Failed to fetch profile for ${principal.toString()}:`, error);
          }
        })
      );

      return profileMap;
    },
    enabled: !!actor && !actorFetching && principals.length > 0,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isAdminCaller();
      } catch (error) {
        console.error('Admin check failed:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
