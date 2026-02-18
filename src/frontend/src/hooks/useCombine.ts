import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CombineResult } from '../backend';
import { Principal } from '@dfinity/principal';
import {
  loadGuestEntries,
  getGuestEntry,
  saveGuestEntry,
  updateGuestEntry,
  deleteGuestEntry,
  type GuestCombineEntry,
} from '../utils/combineGuestStorage';

export function useGetCombineEntries() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CombineResult[] | GuestCombineEntry[]>({
    queryKey: ['combineEntries', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) {
        return loadGuestEntries();
      }
      if (!actor) return [];
      return actor.getUserCombineResults(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching || !identity,
  });
}

export function useGetCombineEntry(id: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CombineResult | GuestCombineEntry | null>({
    queryKey: ['combineEntry', id, identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) {
        return getGuestEntry(parseInt(id, 10));
      }
      if (!actor) return null;
      return actor.getCombineResultById(BigInt(id));
    },
    enabled: (!!actor && !isFetching) || !identity,
  });
}

export function useSaveCombineEntry() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      athleteName: string;
      heightInches?: number;
      weightPounds?: number;
      wingspanInches?: number;
      handSizeInches?: number;
      dash40yd?: number;
      dash10yd?: number;
      dash20yd?: number;
      verticalJumpInches?: number;
      broadJumpInches?: number;
      benchPressReps?: number;
      shuttle20yd?: number;
      threeConeDrill?: number;
      note?: string;
      makePublic?: boolean;
    }) => {
      if (!identity) {
        return saveGuestEntry(data);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.saveCombineResult({
        athleteName: data.athleteName,
        heightInches: data.heightInches ? BigInt(data.heightInches) : undefined,
        weightPounds: data.weightPounds ? BigInt(data.weightPounds) : undefined,
        wingspanInches: data.wingspanInches,
        handSizeInches: data.handSizeInches,
        dash40yd: data.dash40yd,
        dash10yd: data.dash10yd,
        dash20yd: data.dash20yd,
        verticalJumpInches: data.verticalJumpInches,
        broadJumpInches: data.broadJumpInches,
        benchPressReps: data.benchPressReps ? BigInt(data.benchPressReps) : undefined,
        shuttle20yd: data.shuttle20yd,
        threeConeDrill: data.threeConeDrill,
        makePublic: data.makePublic || false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combineEntries'] });
    },
  });
}

export function useDeleteCombineEntry() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!identity) {
        return deleteGuestEntry(parseInt(id, 10));
      }
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCombineResult(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combineEntries'] });
    },
  });
}

export function useToggleCombinePublic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleCombinePublicState(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combineEntries'] });
      queryClient.invalidateQueries({ queryKey: ['combineEntry'] });
      queryClient.invalidateQueries({ queryKey: ['publicCombineEntries'] });
    },
  });
}

export function useGetPublicCombineEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<CombineResult[]>({
    queryKey: ['publicCombineEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPublicCombineEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublicCombineEntry(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CombineResult | null>({
    queryKey: ['publicCombineEntry', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCombineResultById(BigInt(id));
    },
    enabled: !!actor && !isFetching,
  });
}
