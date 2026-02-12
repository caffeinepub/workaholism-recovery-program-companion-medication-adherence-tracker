import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  RecoveryStep,
  Reflection,
  CheckIn,
  Medication,
  DoseLog,
  Meeting,
  EmergencyContact,
  CommitmentsPlan,
} from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
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
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetRecoverySteps() {
  const { actor, isFetching } = useActor();

  return useQuery<RecoveryStep[]>({
    queryKey: ['recoverySteps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecoverySteps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReflections() {
  const { actor, isFetching } = useActor();

  return useQuery<Reflection[]>({
    queryKey: ['reflections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReflections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveReflection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reflection: Reflection) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveReflection(reflection);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
    },
  });
}

export function useGetCheckIns() {
  const { actor, isFetching } = useActor();

  return useQuery<CheckIn[]>({
    queryKey: ['checkIns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCheckIns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogCheckIn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkIn: CheckIn) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logCheckIn(checkIn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkIns'] });
    },
  });
}

export function useGetMedications() {
  const { actor, isFetching } = useActor();

  return useQuery<Medication[]>({
    queryKey: ['medications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMedications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMedication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medication: Medication) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMedication(medication);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}

export function useGetDoseLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<DoseLog[]>({
    queryKey: ['doseLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDoseLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogDose() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doseLog: DoseLog) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logDose(doseLog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doseLogs'] });
    },
  });
}

export function useGetMeetings() {
  const { actor, isFetching } = useActor();

  return useQuery<Meeting[]>({
    queryKey: ['meetings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMeetings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMeeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meeting: Meeting) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMeeting(meeting);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useGetEmergencyContacts() {
  const { actor, isFetching } = useActor();

  return useQuery<EmergencyContact[]>({
    queryKey: ['emergencyContacts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmergencyContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEmergencyContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: EmergencyContact) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEmergencyContact(contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyContacts'] });
    },
  });
}

export function useGetUserData() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCommitmentsPlan() {
  const { actor, isFetching } = useActor();

  return useQuery<CommitmentsPlan | null>({
    queryKey: ['commitmentsPlan'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCommitmentsPlan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCommitmentsPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: CommitmentsPlan) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCommitmentsPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commitmentsPlan'] });
    },
  });
}
