import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use migratable actor pattern to persist data and update logic

actor {
  //-----------------------------TYPES---------------------------------
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
    stressLevel : Nat;
    workHours : Nat;
    intention : Text;
    reflection : Text;
    timestamp : Time.Time;
  };

  public type Medication = {
    name : Text;
    dose : Text;
    schedule : [Text];
    startDate : ?Time.Time;
    endDate : ?Time.Time;
    instructions : Text;
    prescriber : Text;
  };

  public type DoseLog = {
    medicationName : Text;
    scheduledTime : Text;
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

  // Combine types
  public type CombineResult = {
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
  var combineState = {
    nextCombineId = 1;
    publicCombineEntries = Map.empty<Nat, CombineResult>();
    userCombines = Map.empty<Principal, [CombineResult]>();
  };

  module RecoveryStep {
    public func compare(step1 : RecoveryStep, step2 : RecoveryStep) : Order.Order {
      Text.compare(step1.title, step2.title);
    };
  };

  //-------------------------USER SYSTEM---------------------------------
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

  //-------------------------COMMITMENTS SYSTEM---------------------------------
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

  //-----------------------RECOVERY SYSTEM-------------------------------------
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

  //------------------------REFLECTION SYSTEM------------------------------
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

  //--------------------------CHECKIN SYSTEM-------------------------------
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

  //-------------------------MEDICATION SYSTEM-------------------------------
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

  //----------------------------DOSE LOG SYSTEM-----------------------------------
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

  //------------------------------MEETING SYSTEM-----------------------------------
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

  //-------------------------EMERGENCY CONTACTS--------------------------------
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

  //----------------------------------EXPORT USER DATA SYSTEM---------------------------
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

  //----------------------------------COMBINE SYSTEM-----------------------

  public shared ({ caller }) func saveCombineResult(resultInput : {
    athleteName : Text;
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
    makePublic : Bool;
  }) : async CombineResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record combine results");
    };

    let newResult = {
      id = combineState.nextCombineId;
      athleteName = resultInput.athleteName;
      timestamp = Time.now();
      heightInches = resultInput.heightInches;
      weightPounds = resultInput.weightPounds;
      wingspanInches = resultInput.wingspanInches;
      handSizeInches = resultInput.handSizeInches;
      dash40yd = resultInput.dash40yd;
      dash10yd = resultInput.dash10yd;
      dash20yd = resultInput.dash20yd;
      verticalJumpInches = resultInput.verticalJumpInches;
      broadJumpInches = resultInput.broadJumpInches;
      benchPressReps = resultInput.benchPressReps;
      shuttle20yd = resultInput.shuttle20yd;
      threeConeDrill = resultInput.threeConeDrill;
      creator = caller;
      isPublic = resultInput.makePublic;
    };

    // Update user's combine list
    let existingCombines = switch (combineState.userCombines.get(caller)) {
      case (?combines) { combines };
      case (null) { [] };
    };
    let updatedCombines = existingCombines.concat([newResult]);
    combineState.userCombines.add(caller, updatedCombines);

    // If public, update public entries
    if (resultInput.makePublic) {
      combineState.publicCombineEntries.add(combineState.nextCombineId, newResult);
    };

    combineState := {
      combineState with
      nextCombineId = combineState.nextCombineId + 1
    };

    newResult;
  };

  // Retrieve a user's combine entries (private + public)
  // Users can view their own entries (all), others can only see public entries
  public query ({ caller }) func getUserCombineResults(user : Principal) : async [CombineResult] {
    let entries = switch (combineState.userCombines.get(user)) {
      case (null) { [] };
      case (?results) { results };
    };

    // Owner can see all their entries
    if (caller == user) { return entries };

    // Others (including guests) can only see public entries
    let publicEntries = entries.filter(func(c) { c.isPublic });
    publicEntries;
  };

  // Fetch a single result by id (public entries viewable by anyone, private only by creator)
  // This supports share links - public entries are viewable without login
  public query ({ caller }) func getCombineResultById(id : Nat) : async ?CombineResult {
    // First check if it's a public entry (accessible to everyone including guests)
    switch (combineState.publicCombineEntries.get(id)) {
      case (?publicResult) { ?publicResult };
      case (null) {
        switch (combineState.userCombines.get(caller)) {
          case (?results) {
            let matches = results.filter(func(result) { result.id == id and result.creator == caller });
            switch (matches.size()) {
              case (0) { null };
              case (_) { ?matches[0] };
            };
          };
          case (null) { null };
        };
      };
    };
  };

  // Fetch all public combine entries
  public query ({ caller }) func getAllPublicCombineEntries() : async [CombineResult] {
    combineState.publicCombineEntries.values().toArray();
  };

  // Delete a combine result - only the creator can delete their own entries
  public shared ({ caller }) func deleteCombineResult(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete combine results");
    };

    let userCombines = combineState.userCombines.get(caller);
    switch (userCombines) {
      case (null) { false };
      case (?combines) {
        let keeps = combines.filter(func(c) { c.id != id });
        let deletes = combines.filter(func(c) { c.id == id });
        switch (deletes.size()) {
          case (0) { false };
          case (_) {
            combineState.userCombines.add(caller, keeps);
            combineState.publicCombineEntries.remove(id);
            true;
          };
        };
      };
    };
  };

  // Toggle public/private state - only the creator can modify their own entries
  public shared ({ caller }) func toggleCombinePublicState(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify combine results");
    };

    let userCombines = combineState.userCombines.get(caller);
    switch (userCombines) {
      case (null) { false };
      case (?combines) {
        let targetResults = combines.filter(func(c) { c.id == id });
        if (targetResults.size() == 0) { return false };
        let target = targetResults[0];

        let newResult = { target with isPublic = not target.isPublic };
        let updatedCombines = combines.map(
          func(c) {
            if (c.id == id) { newResult } else { c };
          }
        );
        combineState.userCombines.add(caller, updatedCombines);

        if (newResult.isPublic) {
          combineState.publicCombineEntries.add(id, newResult);
        } else {
          combineState.publicCombineEntries.remove(id);
        };

        true;
      };
    };
  };
};
