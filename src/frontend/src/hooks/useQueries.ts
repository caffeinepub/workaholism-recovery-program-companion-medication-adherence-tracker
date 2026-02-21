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

  return useQuery<Map<string, CallerUserProfile | null>>({
    queryKey: ['userProfiles', principals.map((p) => p.toString()).sort()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const results = new Map<string, CallerUserProfile | null>();
      await Promise.all(
        principals.map(async (principal) => {
          try {
            const profile = await actor.getUserProfile(principal);
            results.set(principal.toString(), profile);
          } catch (error) {
            console.error(`Failed to fetch profile for ${principal.toString()}:`, error);
            results.set(principal.toString(), null);
          }
        })
      );
      return results;
    },
    enabled: !!actor && !actorFetching && principals.length > 0,
    retry: false,
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isAdminCaller();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}

import { useInternetIdentity } from './useInternetIdentity';
