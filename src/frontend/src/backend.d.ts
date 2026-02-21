import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
    bmi: CombineMeasurement;
    weight: CombineMeasurement;
    passedMedical: boolean;
    height: CombineMeasurement;
    powerClean: CombineMeasurement;
    verticalJump: CombineMeasurement;
    creator: Principal;
    dash10yd: CombineMeasurement;
    dash20yd: CombineMeasurement;
    dash40yd: CombineMeasurement;
    wingspan: CombineMeasurement;
    threeConeDrill: CombineMeasurement;
    benchPressReps: CombineMeasurement;
    squat: CombineMeasurement;
    developerNotes?: string;
    shuttleProAgility: CombineMeasurement;
    shuttle20yd: CombineMeasurement;
    timestamp: Time;
    shuttle60yd: CombineMeasurement;
    isPublic: boolean;
    handSize: CombineMeasurement;
    broadJump: CombineMeasurement;
    seatedRow: CombineMeasurement;
    athleteName: string;
    armLength: CombineMeasurement;
    standingReach: CombineMeasurement;
    bodyFatPercentage: CombineMeasurement;
}
export interface EmergencyContact {
    relationship: string;
    name: string;
    notes: string;
    phone: string;
}
export interface UserProfileWithPrincipal {
    principal: Principal;
    hasPaid: boolean;
    name: string;
    subscriptionStatus: SubscriptionStatus;
    isAdmin: boolean;
}
export interface Reflection {
    id: bigint;
    stepId: bigint;
    content: string;
    timestamp: Time;
}
export interface CallerUserProfile {
    hasPaid: boolean;
    name: string;
    subscriptionStatus: SubscriptionStatus;
    isAdmin: boolean;
}
export interface CombineMeasurement {
    verified: boolean;
    value?: number;
    equipmentUsed?: string;
    notes?: string;
    measurementType: string;
    attemptNumber?: bigint;
}
export interface DoseLog {
    status: Variant_Skipped_Late_Taken;
    medicationName: string;
    scheduledTime: string;
    note?: string;
    takenTime?: Time;
    timestamp: Time;
}
export interface CheckIn {
    stressLevel: bigint;
    mood: string;
    timestamp: Time;
    reflection: string;
    workHours: bigint;
    intention: string;
}
export type SubscriptionStatus = {
    __kind__: "Active";
    Active: Time;
} | {
    __kind__: "Expired";
    Expired: null;
} | {
    __kind__: "Pending";
    Pending: null;
};
export interface CommitmentsPlan {
    thingsToAvoid: string;
    atRiskActions: string;
    personalCommitments: string;
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
    adminListAllUsers(): Promise<Array<UserProfileWithPrincipal>>;
    adminSetUserSubscription(user: Principal, durationDays: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkSubscriptionActive(): Promise<boolean>;
    deleteCombineResult(id: bigint): Promise<boolean>;
    getAllPublicCombineEntries(): Promise<Array<CombineResult>>;
    getAllRecoverySteps(): Promise<Array<RecoveryStep>>;
    getCallerUserProfile(): Promise<CallerUserProfile | null>;
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
    getUserPaymentStatus(user: Principal): Promise<boolean>;
    getUserProfile(user: Principal): Promise<CallerUserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logCheckIn(checkIn: CheckIn): Promise<void>;
    logDose(doseLog: DoseLog): Promise<void>;
    saveCallerUserProfile(profile: CallerUserProfile): Promise<void>;
    saveCombineResult(resultInput: {
        bmi: CombineMeasurement;
        weight: CombineMeasurement;
        passedMedical: boolean;
        height: CombineMeasurement;
        powerClean: CombineMeasurement;
        verticalJump: CombineMeasurement;
        dash10yd: CombineMeasurement;
        dash20yd: CombineMeasurement;
        dash40yd: CombineMeasurement;
        wingspan: CombineMeasurement;
        threeConeDrill: CombineMeasurement;
        benchPressReps: CombineMeasurement;
        squat: CombineMeasurement;
        developerNotes?: string;
        shuttleProAgility: CombineMeasurement;
        shuttle20yd: CombineMeasurement;
        shuttle60yd: CombineMeasurement;
        makePublic: boolean;
        handSize: CombineMeasurement;
        broadJump: CombineMeasurement;
        seatedRow: CombineMeasurement;
        athleteName: string;
        armLength: CombineMeasurement;
        standingReach: CombineMeasurement;
        bodyFatPercentage: CombineMeasurement;
    }): Promise<CombineResult>;
    saveCommitmentsPlan(plan: CommitmentsPlan): Promise<void>;
    saveReflection(reflection: Reflection): Promise<void>;
    toggleCombinePublicState(id: bigint): Promise<boolean>;
    togglePaymentStatus(user: Principal): Promise<boolean>;
}
