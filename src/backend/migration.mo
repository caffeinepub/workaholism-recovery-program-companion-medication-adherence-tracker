import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type RecoveryStep = {
    id : Nat;
    title : Text;
    description : Text;
    completed : Bool;
  };

  type Reflection = {
    id : Nat;
    stepId : Nat;
    content : Text;
    timestamp : Time.Time;
  };

  type CheckIn = {
    mood : Text;
    stressLevel : Nat;
    workHours : Nat;
    intention : Text;
    reflection : Text;
    timestamp : Time.Time;
  };

  type Medication = {
    name : Text;
    dose : Text;
    schedule : [Text];
    startDate : ?Time.Time;
    endDate : ?Time.Time;
    instructions : Text;
    prescriber : Text;
  };

  type DoseLog = {
    medicationName : Text;
    scheduledTime : Text;
    takenTime : ?Time.Time;
    status : { #Taken; #Skipped; #Late };
    note : ?Text;
    timestamp : Time.Time;
  };

  type Meeting = {
    date : Time.Time;
    format : Text;
    notes : Text;
    sponsorContactNotes : Text;
    goals : Text;
  };

  type EmergencyContact = {
    name : Text;
    phone : Text;
    relationship : Text;
    notes : Text;
  };

  type CommitmentsPlan = {
    personalCommitments : Text;
    thingsToAvoid : Text;
    atRiskActions : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type CombineResult = {
    id : Nat;
    athleteName : Text;
    timestamp : Time.Time;
    heightInches : ?Nat;
    weightPounds : ?Nat;
    wingspanInches : ?Float;
    handSizeInches : ?Float;
    dash40yd : ?Float;
    dash10yd : ?Float;
    dash20yd : ?Float;
    verticalJumpInches : ?Float;
    broadJumpInches : ?Float;
    benchPressReps : ?Nat;
    shuttle20yd : ?Float;
    threeConeDrill : ?Float;
    creator : Principal;
    isPublic : Bool;
  };

  type CombineState = {
    nextCombineId : Nat;
    publicCombineEntries : Map.Map<Nat, CombineResult>;
    userCombines : Map.Map<Principal, [CombineResult]>;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    checkIns : Map.Map<Principal, [CheckIn]>;
    reflections : Map.Map<Principal, [Reflection]>;
    medications : Map.Map<Principal, [Medication]>;
    doseLogs : Map.Map<Principal, [DoseLog]>;
    recoveryPrograms : Map.Map<Principal, [RecoveryStep]>;
    meetings : Map.Map<Principal, [Meeting]>;
    emergencyContacts : Map.Map<Principal, [EmergencyContact]>;
    commitmentsPlans : Map.Map<Principal, CommitmentsPlan>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    checkIns : Map.Map<Principal, [CheckIn]>;
    reflections : Map.Map<Principal, [Reflection]>;
    medications : Map.Map<Principal, [Medication]>;
    doseLogs : Map.Map<Principal, [DoseLog]>;
    recoveryPrograms : Map.Map<Principal, [RecoveryStep]>;
    meetings : Map.Map<Principal, [Meeting]>;
    emergencyContacts : Map.Map<Principal, [EmergencyContact]>;
    commitmentsPlans : Map.Map<Principal, CommitmentsPlan>;
    combineState : CombineState;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      combineState = {
        nextCombineId = 1;
        publicCombineEntries = Map.empty<Nat, CombineResult>();
        userCombines = Map.empty<Principal, [CombineResult]>();
      };
    };
  };
};
