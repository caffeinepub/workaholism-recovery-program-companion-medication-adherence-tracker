import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CombineResult, CombineMeasurement } from '../backend';
import { Principal } from '@dfinity/principal';
import {
  loadGuestEntries,
  getGuestEntry,
  saveGuestEntry,
  updateGuestEntry,
  deleteGuestEntry,
  type GuestCombineEntry,
} from '../utils/combineGuestStorage';

function createMeasurement(value: number | undefined, type: string): CombineMeasurement {
  return {
    value: value,
    verified: true,
    notes: undefined,
    attemptNumber: undefined,
    equipmentUsed: undefined,
    measurementType: type,
  };
}

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
    enabled: (!!actor && !isFetching) || !identity,
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
      armLength?: number;
      dash40yd?: number;
      dash10yd?: number;
      dash20yd?: number;
      verticalJumpInches?: number;
      broadJumpInches?: number;
      benchPressReps?: number;
      shuttle20yd?: number;
      threeConeDrill?: number;
      shuttle60yd?: number;
      shuttleProAgility?: number;
      bodyFatPercentage?: number;
      bmi?: number;
      standingReach?: number;
      seatedRow?: number;
      squat?: number;
      powerClean?: number;
      note?: string;
      makePublic?: boolean;
    }) => {
      if (!identity) {
        return saveGuestEntry(data);
      }
      if (!actor) throw new Error('Actor not available');
      return actor.saveCombineResult({
        athleteName: data.athleteName,
        height: createMeasurement(data.heightInches, 'heightInches'),
        weight: createMeasurement(data.weightPounds, 'weightPounds'),
        wingspan: createMeasurement(data.wingspanInches, 'wingspanInches'),
        handSize: createMeasurement(data.handSizeInches, 'handSizeInches'),
        armLength: createMeasurement(data.armLength, 'armLength'),
        dash40yd: createMeasurement(data.dash40yd, '40ydDash'),
        dash10yd: createMeasurement(data.dash10yd, '10ydDash'),
        dash20yd: createMeasurement(data.dash20yd, '20ydDash'),
        verticalJump: createMeasurement(data.verticalJumpInches, 'verticalJump'),
        broadJump: createMeasurement(data.broadJumpInches, 'broadJump'),
        benchPressReps: createMeasurement(data.benchPressReps, 'benchPress'),
        shuttle20yd: createMeasurement(data.shuttle20yd, '20ydShuttle'),
        threeConeDrill: createMeasurement(data.threeConeDrill, 'threeCone'),
        shuttle60yd: createMeasurement(data.shuttle60yd, '60ydShuttle'),
        shuttleProAgility: createMeasurement(data.shuttleProAgility, 'proAgility'),
        bodyFatPercentage: createMeasurement(data.bodyFatPercentage, 'bodyFat'),
        bmi: createMeasurement(data.bmi, 'bmi'),
        standingReach: createMeasurement(data.standingReach, 'standingReach'),
        seatedRow: createMeasurement(data.seatedRow, 'seatedRow'),
        squat: createMeasurement(data.squat, 'squat'),
        powerClean: createMeasurement(data.powerClean, 'powerClean'),
        developerNotes: data.note,
        passedMedical: true,
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
