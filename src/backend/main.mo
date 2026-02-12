import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use migratable actor pattern to persist data and update logic
(with migration = Migration.run)
actor {
  public type RecoveryStep = {
    id : Nat;
    title : Text;
    description : Text;
    completed : Bool;
  };

  public type Reflection = {
    id : Nat;
    stepId : Nat;
    content : Text;
    timestamp : Time.Time;
  };

  public type CheckIn = {
    mood : Text;
    stressLevel : Nat; // 1-10 scale
    workHours : Nat;
    intention : Text;
    reflection : Text;
    timestamp : Time.Time;
  };

  public type Medication = {
    name : Text;
    dose : Text;
    schedule : [Text]; // Times per day as strings
    startDate : ?Time.Time;
    endDate : ?Time.Time;
    instructions : Text;
    prescriber : Text;
  };

  public type DoseLog = {
    medicationName : Text;
    scheduledTime : Text; // e.g., "8:00 AM"
    takenTime : ?Time.Time;
    status : { #Taken; #Skipped; #Late };
    note : ?Text;
    timestamp : Time.Time;
  };

  public type Meeting = {
    date : Time.Time;
    format : Text;
    notes : Text;
    sponsorContactNotes : Text;
    goals : Text;
  };

  public type EmergencyContact = {
    name : Text;
    phone : Text;
    relationship : Text;
    notes : Text;
  };

  public type CommitmentsPlan = {
    personalCommitments : Text;
    thingsToAvoid : Text;
    atRiskActions : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let checkIns = Map.empty<Principal, [CheckIn]>();
  let reflections = Map.empty<Principal, [Reflection]>();
  let medications = Map.empty<Principal, [Medication]>();
  let doseLogs = Map.empty<Principal, [DoseLog]>();
  let recoveryPrograms = Map.empty<Principal, [RecoveryStep]>();
  let meetings = Map.empty<Principal, [Meeting]>();
  let emergencyContacts = Map.empty<Principal, [EmergencyContact]>();
  let commitmentsPlans = Map.empty<Principal, CommitmentsPlan>();

  module RecoveryStep {
    public func compare(step1 : RecoveryStep, step2 : RecoveryStep) : Order.Order {
      Text.compare(step1.title, step2.title);
    };
  };

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Commitments & Boundaries Plan Functions
  public shared ({ caller }) func saveCommitmentsPlan(plan : CommitmentsPlan) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save commitments plans");
    };
    commitmentsPlans.add(caller, plan);
  };

  public query ({ caller }) func getCommitmentsPlan() : async ?CommitmentsPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access commitments plans");
    };
    commitmentsPlans.get(caller);
  };

  // Recovery program functions
  public query ({ caller }) func getAllRecoverySteps() : async [RecoveryStep] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access recovery steps");
    };
    switch (recoveryPrograms.get(caller)) {
      case (null) { [] };
      case (?steps) {
        steps.sort();
      };
    };
  };

  // Reflection functions
  public shared ({ caller }) func saveReflection(reflection : Reflection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save reflections");
    };
    let userReflections = switch (reflections.get(caller)) {
      case (?current) { current };
      case (null) { [] };
    };
    let updatedReflections = userReflections.concat([reflection]);
    reflections.add(caller, updatedReflections);
  };

  public query ({ caller }) func getReflections() : async [Reflection] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access reflections");
    };
    switch (reflections.get(caller)) {
      case (null) { [] };
      case (?reflectionList) { reflectionList };
    };
  };

  // Check-in functions
  public shared ({ caller }) func logCheckIn(checkIn : CheckIn) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log check-ins");
    };
    let userCheckIns = switch (checkIns.get(caller)) {
      case (?current) { current };
      case (null) { [] };
    };
    let updatedCheckIns = userCheckIns.concat([checkIn]);
    checkIns.add(caller, updatedCheckIns);
  };

  public query ({ caller }) func getCheckIns() : async [CheckIn] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access check-ins");
    };
    switch (checkIns.get(caller)) {
      case (null) { [] };
      case (?userCheckIns) { userCheckIns };
    };
  };

  // Medication functions
  public shared ({ caller }) func addMedication(medicine : Medication) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add medications");
    };
    let userMeds = switch (medications.get(caller)) {
      case (?current) { current };
      case (null) { [] };
    };
    let updatedMeds = userMeds.concat([medicine]);
    medications.add(caller, updatedMeds);
  };

  public query ({ caller }) func getMedications() : async [Medication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access medications");
    };
    switch (medications.get(caller)) {
      case (null) { [] };
      case (?medList) { medList };
    };
  };

  // Dose log functions
  public shared ({ caller }) func logDose(doseLog : DoseLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log doses");
    };
    let userLogs = switch (doseLogs.get(caller)) {
      case (?current) { current };
      case (null) { [] };
    };
    let updatedLogs = userLogs.concat([doseLog]);
    doseLogs.add(caller, updatedLogs);
  };

  public query ({ caller }) func getDoseLogs() : async [DoseLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access dose logs");
    };
    switch (doseLogs.get(caller)) {
      case (null) { [] };
      case (?doseLogs) { doseLogs };
    };
  };

  // Meeting functions
  public shared ({ caller }) func addMeeting(meeting : Meeting) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add meetings");
    };
    let userMeetings = switch (meetings.get(caller)) {
      case (?current) { current };
      case (null) { [] };
    };
    let updatedMeetings = userMeetings.concat([meeting]);
    meetings.add(caller, updatedMeetings);
  };

  public query ({ caller }) func getMeetings() : async [Meeting] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access meetings");
    };
    switch (meetings.get(caller)) {
      case (null) { [] };
      case (?meetingList) { meetingList };
    };
  };

  // Emergency contact functions
  public shared ({ caller }) func addEmergencyContact(contact : EmergencyContact) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add emergency contacts");
    };
    let userContacts = switch (emergencyContacts.get(caller)) {
      case (?current) { current };
      case (null) { [] };
    };
    let updatedContacts = userContacts.concat([contact]);
    emergencyContacts.add(caller, updatedContacts);
  };

  public query ({ caller }) func getEmergencyContacts() : async [EmergencyContact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access emergency contacts");
    };
    switch (emergencyContacts.get(caller)) {
      case (null) { [] };
      case (?contactList) { contactList };
    };
  };

  // Export user data function
  public query ({ caller }) func getUserData() : async {
    reflections : [Reflection];
    checkIns : [CheckIn];
    medications : [Medication];
    doseLogs : [DoseLog];
    recoverySteps : [RecoveryStep];
    meetings : [Meeting];
    emergencyContacts : [EmergencyContact];
    commitmentsPlan : ?CommitmentsPlan;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can export their data");
    };
    {
      reflections = switch (reflections.get(caller)) {
        case (null) { [] };
        case (?reflectionList) { reflectionList };
      };
      checkIns = switch (checkIns.get(caller)) {
        case (null) { [] };
        case (?checkInsData) { checkInsData };
      };
      medications = switch (medications.get(caller)) {
        case (null) { [] };
        case (?medData) { medData };
      };
      doseLogs = switch (doseLogs.get(caller)) {
        case (null) { [] };
        case (?doseLogsData) { doseLogsData };
      };
      recoverySteps = switch (recoveryPrograms.get(caller)) {
        case (null) { [] };
        case (?steps) { steps };
      };
      meetings = switch (meetings.get(caller)) {
        case (null) { [] };
        case (?meetingsData) { meetingsData };
      };
      emergencyContacts = switch (emergencyContacts.get(caller)) {
        case (null) { [] };
        case (?contacts) { contacts };
      };
      commitmentsPlan = commitmentsPlans.get(caller);
    };
  };
};
