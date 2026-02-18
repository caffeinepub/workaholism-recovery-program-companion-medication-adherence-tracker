import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CommitmentsPlan {
    thingsToAvoid: string;
    atRiskActions: string;
    personalCommitments: string;
}
export interface CheckIn {
    stressLevel: bigint;
    mood: string;
    timestamp: Time;
    reflection: string;
    workHours: bigint;
    intention: string;
}
export interface RecoveryStep {
    id: bigint;
    title: string;
    completed: boolean;
    description: string;
}
export type Time = bigint;
export interface Meeting {
    date: Time;
    goals: string;
    notes: string;
    sponsorContactNotes: string;
    format: string;
}
export interface CombineResult {
    id: bigint;
    creator: Principal;
    dash10yd?: number;
    dash20yd?: number;
    dash40yd?: number;
    heightInches?: bigint;
    wingspanInches?: number;
    threeConeDrill?: number;
    handSizeInches?: number;
    weightPounds?: bigint;
    benchPressReps?: bigint;
    broadJumpInches?: number;
    shuttle20yd?: number;
    timestamp: Time;
    isPublic: boolean;
    verticalJumpInches?: number;
    athleteName: string;
}
export interface EmergencyContact {
    relationship: string;
    name: string;
    notes: string;
    phone: string;
}
export interface Reflection {
    id: bigint;
    stepId: bigint;
    content: string;
    timestamp: Time;
}
export interface DoseLog {
    status: Variant_Skipped_Late_Taken;
    medicationName: string;
    scheduledTime: string;
    note?: string;
    takenTime?: Time;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
export interface Medication {
    endDate?: Time;
    dose: string;
    name: string;
    instructions: string;
    schedule: Array<string>;
    prescriber: string;
    startDate?: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_Skipped_Late_Taken {
    Skipped = "Skipped",
    Late = "Late",
    Taken = "Taken"
}
export interface backendInterface {
    addEmergencyContact(contact: EmergencyContact): Promise<void>;
    addMedication(medicine: Medication): Promise<void>;
    addMeeting(meeting: Meeting): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCombineResult(id: bigint): Promise<boolean>;
    getAllPublicCombineEntries(): Promise<Array<CombineResult>>;
    getAllRecoverySteps(): Promise<Array<RecoveryStep>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCheckIns(): Promise<Array<CheckIn>>;
    getCombineResultById(id: bigint): Promise<CombineResult | null>;
    getCommitmentsPlan(): Promise<CommitmentsPlan | null>;
    getDoseLogs(): Promise<Array<DoseLog>>;
    getEmergencyContacts(): Promise<Array<EmergencyContact>>;
    getMedications(): Promise<Array<Medication>>;
    getMeetings(): Promise<Array<Meeting>>;
    getReflections(): Promise<Array<Reflection>>;
    getUserCombineResults(user: Principal): Promise<Array<CombineResult>>;
    getUserData(): Promise<{
        meetings: Array<Meeting>;
        emergencyContacts: Array<EmergencyContact>;
        reflections: Array<Reflection>;
        medications: Array<Medication>;
        checkIns: Array<CheckIn>;
        doseLogs: Array<DoseLog>;
        commitmentsPlan?: CommitmentsPlan;
        recoverySteps: Array<RecoveryStep>;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logCheckIn(checkIn: CheckIn): Promise<void>;
    logDose(doseLog: DoseLog): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCombineResult(resultInput: {
        dash10yd?: number;
        dash20yd?: number;
        dash40yd?: number;
        heightInches?: bigint;
        wingspanInches?: number;
        threeConeDrill?: number;
        handSizeInches?: number;
        weightPounds?: bigint;
        benchPressReps?: bigint;
        broadJumpInches?: number;
        shuttle20yd?: number;
        makePublic: boolean;
        verticalJumpInches?: number;
        athleteName: string;
    }): Promise<CombineResult>;
    saveCommitmentsPlan(plan: CommitmentsPlan): Promise<void>;
    saveReflection(reflection: Reflection): Promise<void>;
    toggleCombinePublicState(id: bigint): Promise<boolean>;
}
