import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Migration "migration";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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

  public type SubscriptionStatus = {
    #Active : Time.Time;
    #Pending;
    #Expired;
  };

  public type CallerUserProfile = {
    name : Text;
    subscriptionStatus : SubscriptionStatus;
    isAdmin : Bool;
    hasPaid : Bool;
  };

  public type UserProfileWithPrincipal = {
    principal : Principal;
    name : Text;
    subscriptionStatus : SubscriptionStatus;
    isAdmin : Bool;
    hasPaid : Bool;
  };

  type CombineMeasurement = {
    value : ?Float;
    verified : Bool;
    notes : ?Text;
    attemptNumber : ?Nat;
    equipmentUsed : ?Text;
    measurementType : Text;
  };

  public type CombineResult = {
    id : Nat;
    athleteName : Text;
    timestamp : Time.Time;
    height : CombineMeasurement;
    weight : CombineMeasurement;
    wingspan : CombineMeasurement;
    handSize : CombineMeasurement;
    dash40yd : CombineMeasurement;
    dash10yd : CombineMeasurement;
    dash20yd : CombineMeasurement;
    verticalJump : CombineMeasurement;
    broadJump : CombineMeasurement;
    benchPressReps : CombineMeasurement;
    shuttle20yd : CombineMeasurement;
    threeConeDrill : CombineMeasurement;
    shuttle60yd : CombineMeasurement;
    shuttleProAgility : CombineMeasurement;
    armLength : CombineMeasurement;
    bodyFatPercentage : CombineMeasurement;
    bmi : CombineMeasurement;
    standingReach : CombineMeasurement;
    seatedRow : CombineMeasurement;
    squat : CombineMeasurement;
    powerClean : CombineMeasurement;
    developerNotes : ?Text;
    passedMedical : Bool;
    isPublic : Bool;
    creator : Principal;
  };

  type CombineState = {
    nextCombineId : Nat;
    publicCombineEntries : Map.Map<Nat, CombineResult>;
    userCombines : Map.Map<Principal, [CombineResult]>;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, CallerUserProfile>();
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

  public query ({ caller }) func getCallerUserProfile() : async ?CallerUserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?CallerUserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : CallerUserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Preserve existing payment status and admin status
    let existingProfile = userProfiles.get(caller);
    let existingHasPaid = switch (existingProfile) {
      case (?existing) { existing.hasPaid };
      case (null) { false };
    };

    let updatedProfile = {
      profile with
      subscriptionStatus = #Pending;
      isAdmin = false;
      hasPaid = existingHasPaid;
    };

    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func togglePaymentStatus(user : Principal) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can toggle payment status");
    };

    switch (userProfiles.get(user)) {
      case (?profile) {
        let updatedProfile = { profile with hasPaid = not profile.hasPaid };
        userProfiles.add(user, updatedProfile);
        updatedProfile.hasPaid;
      };
      case (null) {
        Runtime.trap("User not found");
      };
    };
  };

  public query ({ caller }) func getUserPaymentStatus(user : Principal) : async Bool {
    // Only admins can check other users' payment status
    // Users can only check their own payment status
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own payment status");
    };

    switch (userProfiles.get(user)) {
      case (?profile) { profile.hasPaid };
      case (null) {
        false;
      };
    };
  };

  public shared ({ caller }) func adminSetUserSubscription(user : Principal, durationDays : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set user subscriptions");
    };

    let userProfile = switch (userProfiles.get(user)) {
      case (?profile) { profile };
      case (null) {
        let emptyProfile = {
          name = "";
          subscriptionStatus = #Pending;
          isAdmin = false;
          hasPaid = false;
        };
        userProfiles.add(user, emptyProfile);
        emptyProfile;
      };
    };

    let expiryTime = Time.now() + (durationDays * 86400_000_000_000);
    let updatedProfile = {
      userProfile with
      subscriptionStatus = #Active(expiryTime);
    };

    userProfiles.add(user, updatedProfile);
  };

  public query ({ caller }) func adminListAllUsers() : async [UserProfileWithPrincipal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };

    let profiles = userProfiles.entries().toArray();
    profiles.map<(Principal, CallerUserProfile), UserProfileWithPrincipal>(
      func((principal, profile)) {
        {
          principal = principal;
          name = profile.name;
          subscriptionStatus = profile.subscriptionStatus;
          isAdmin = profile.isAdmin;
          hasPaid = profile.hasPaid;
        };
      }
    );
  };

  public query ({ caller }) func checkSubscriptionActive() : async Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.subscriptionStatus) {
          case (#Active(expiryTime)) {
            Time.now() <= expiryTime;
          };
          case (#Pending) { false };
          case (#Expired) { false };
        };
      };
    };
  };

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

  public query ({ caller }) func getAllRecoverySteps() : async [RecoveryStep] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access recovery steps");
    };
    switch (recoveryPrograms.get(caller)) {
      case (null) { [] };
      case (?steps) { steps.sort() };
    };
  };

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

  public shared ({ caller }) func saveCombineResult(resultInput : {
    athleteName : Text;
    height : CombineMeasurement;
    weight : CombineMeasurement;
    wingspan : CombineMeasurement;
    handSize : CombineMeasurement;
    dash40yd : CombineMeasurement;
    dash10yd : CombineMeasurement;
    dash20yd : CombineMeasurement;
    verticalJump : CombineMeasurement;
    broadJump : CombineMeasurement;
    benchPressReps : CombineMeasurement;
    shuttle20yd : CombineMeasurement;
    threeConeDrill : CombineMeasurement;
    shuttle60yd : CombineMeasurement;
    shuttleProAgility : CombineMeasurement;
    armLength : CombineMeasurement;
    bodyFatPercentage : CombineMeasurement;
    bmi : CombineMeasurement;
    standingReach : CombineMeasurement;
    seatedRow : CombineMeasurement;
    squat : CombineMeasurement;
    powerClean : CombineMeasurement;
    developerNotes : ?Text;
    passedMedical : Bool;
    makePublic : Bool;
  }) : async CombineResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record combine results");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.subscriptionStatus) {
          case (#Active(expiryTime)) {
            if (Time.now() > expiryTime) {
              Runtime.trap("Subscription expired. Please renew to access this feature.");
            };
          };
          case (#Pending) {
            Runtime.trap("Pending subscription. Access denied until payment is complete.");
          };
          case (#Expired) {
            Runtime.trap("Subscription expired. Please renew to access this feature.");
          };
        };
      };
      case (null) {
        Runtime.trap("User profile not found. Cannot verify subscription.");
      };
    };

    let newResult = {
      id = combineState.nextCombineId;
      athleteName = resultInput.athleteName;
      timestamp = Time.now();
      height = resultInput.height;
      weight = resultInput.weight;
      wingspan = resultInput.wingspan;
      handSize = resultInput.handSize;
      dash40yd = resultInput.dash40yd;
      dash10yd = resultInput.dash10yd;
      dash20yd = resultInput.dash20yd;
      verticalJump = resultInput.verticalJump;
      broadJump = resultInput.broadJump;
      benchPressReps = resultInput.benchPressReps;
      shuttle20yd = resultInput.shuttle20yd;
      threeConeDrill = resultInput.threeConeDrill;
      shuttle60yd = resultInput.shuttle60yd;
      shuttleProAgility = resultInput.shuttleProAgility;
      armLength = resultInput.armLength;
      bodyFatPercentage = resultInput.bodyFatPercentage;
      bmi = resultInput.bmi;
      standingReach = resultInput.standingReach;
      seatedRow = resultInput.seatedRow;
      squat = resultInput.squat;
      powerClean = resultInput.powerClean;
      developerNotes = resultInput.developerNotes;
      passedMedical = resultInput.passedMedical;
      isPublic = resultInput.makePublic;
      creator = caller;
    };

    let existingCombines = switch (combineState.userCombines.get(caller)) {
      case (?combines) { combines };
      case (null) { [] };
    };
    let updatedCombines = existingCombines.concat([newResult]);
    combineState.userCombines.add(caller, updatedCombines);

    if (resultInput.makePublic) {
      combineState.publicCombineEntries.add(combineState.nextCombineId, newResult);
    };

    combineState := {
      combineState with
      nextCombineId = combineState.nextCombineId + 1
    };

    newResult;
  };

  public query ({ caller }) func getUserCombineResults(user : Principal) : async [CombineResult] {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.subscriptionStatus) {
          case (#Active(expiryTime)) {
            if (Time.now() > expiryTime) {
              Runtime.trap("Subscription expired. Please renew to access this feature.");
            };
          };
          case (#Pending) {
            Runtime.trap("Pending subscription. Access denied until payment is complete.");
          };
          case (#Expired) {
            Runtime.trap("Subscription expired. Please renew to access this feature.");
          };
        };
      };
      case (null) {
        Runtime.trap("User profile not found. Cannot verify subscription.");
      };
    };

    let entries = switch (combineState.userCombines.get(user)) {
      case (null) { [] };
      case (?results) { results };
    };

    if (caller == user) { return entries };

    let publicEntries = entries.filter(func(c) { c.isPublic });
    publicEntries;
  };

  public query ({ caller }) func getCombineResultById(id : Nat) : async ?CombineResult {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.subscriptionStatus) {
          case (#Active(expiryTime)) {
            if (Time.now() > expiryTime) {
              Runtime.trap("Subscription expired. Please renew to access this feature.");
            };
          };
          case (#Pending) {
            Runtime.trap("Pending subscription. Access denied until payment is complete.");
          };
          case (#Expired) {
            Runtime.trap("Subscription expired. Please renew to access this feature.");
          };
        };
      };
      case (null) {
        Runtime.trap("User profile not found. Cannot verify subscription.");
      };
    };

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

  public query ({ caller }) func getAllPublicCombineEntries() : async [CombineResult] {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.subscriptionStatus) {
          case (#Active(expiryTime)) {
            if (Time.now() > expiryTime) {
              Runtime.trap("Subscription expired. Please renew to access this feature.");
            };
          };
          case (#Pending) {
            Runtime.trap("Pending subscription. Access denied until payment is complete.");
          };
          case (#Expired) {
            Runtime.trap("Subscription expired. Please renew to access this feature.");
          };
        };
      };
      case (null) {
        Runtime.trap("User profile not found. Cannot verify subscription.");
      };
    };

    combineState.publicCombineEntries.values().toArray();
  };

  public shared ({ caller }) func deleteCombineResult(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete combine results");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.subscriptionStatus) {
          case (#Active(expiryTime)) {
            if (Time.now() > expiryTime) {
              Runtime.trap("Subscription expired. Please renew to access this feature.");
            };
          };
          case (#Pending) {
            Runtime.trap("Pending subscription. Access denied until payment is complete.");
          };
          case (#Expired) {
            Runtime.trap("Subscription expired. Please renew to access this feature.");
          };
        };
      };
      case (null) {
        Runtime.trap("User profile not found. Cannot verify subscription.");
      };
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

  public shared ({ caller }) func toggleCombinePublicState(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify combine results");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.subscriptionStatus) {
          case (#Active(expiryTime)) {
            if (Time.now() > expiryTime) {
              Runtime.trap("Subscription expired. Please renew to access this feature.");
            };
          };
          case (#Pending) {
            Runtime.trap("Pending subscription. Access denied until payment is complete.");
          };
          case (#Expired) {
            Runtime.trap("Subscription expired. Please renew to access this feature.");
          };
        };
      };
      case (null) {
        Runtime.trap("User profile not found. Cannot verify subscription.");
      };
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
