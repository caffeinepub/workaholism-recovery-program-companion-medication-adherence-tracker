import Map "mo:core/Map";
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
    timestamp : Int;
  };

  type CheckIn = {
    mood : Text;
    stressLevel : Nat;
    workHours : Nat;
    intention : Text;
    reflection : Text;
    timestamp : Int;
  };

  type Medication = {
    name : Text;
    dose : Text;
    schedule : [Text];
    startDate : ?Int;
    endDate : ?Int;
    instructions : Text;
    prescriber : Text;
  };

  type DoseLog = {
    medicationName : Text;
    scheduledTime : Text;
    takenTime : ?Int;
    status : { #Taken; #Skipped; #Late };
    note : ?Text;
    timestamp : Int;
  };

  type Meeting = {
    date : Int;
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

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    checkIns : Map.Map<Principal, [CheckIn]>;
    reflections : Map.Map<Principal, [Reflection]>;
    medications : Map.Map<Principal, [Medication]>;
    doseLogs : Map.Map<Principal, [DoseLog]>;
    recoveryPrograms : Map.Map<Principal, [RecoveryStep]>;
    meetings : Map.Map<Principal, [Meeting]>;
    emergencyContacts : Map.Map<Principal, [EmergencyContact]>;
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
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      commitmentsPlans = Map.empty<Principal, CommitmentsPlan>()
    };
  };
};
