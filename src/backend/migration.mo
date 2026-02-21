import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldCombineResult = {
    id : Nat;
    athleteName : Text;
    timestamp : Int;
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

  type OldCombineState = {
    nextCombineId : Nat;
    publicCombineEntries : Map.Map<Nat, OldCombineResult>;
    userCombines : Map.Map<Principal, [OldCombineResult]>;
  };

  type OldActor = {
    combineState : OldCombineState;
  };

  type CombineMeasurement = {
    value : ?Float;
    verified : Bool;
    notes : ?Text;
    attemptNumber : ?Nat;
    equipmentUsed : ?Text;
    measurementType : Text;
  };

  type NewCombineResult = {
    id : Nat;
    athleteName : Text;
    timestamp : Int;
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

  type NewCombineState = {
    nextCombineId : Nat;
    publicCombineEntries : Map.Map<Nat, NewCombineResult>;
    userCombines : Map.Map<Principal, [NewCombineResult]>;
  };

  type NewActor = {
    combineState : NewCombineState;
  };

  func convertMeasurementFromNat(value : ?Nat) : ?Float {
    switch (value) {
      case (null) { null };
      case (?val) { ?val.toInt().toFloat() };
    };
  };

  func convertBool(_val : Bool) : Bool {
    true;
  };

  func convertOldToNew(oldResult : OldCombineResult) : NewCombineResult {
    {
      oldResult with
      height = {
        value = convertMeasurementFromNat(oldResult.heightInches);
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "heightInches";
      };
      weight = {
        value = convertMeasurementFromNat(oldResult.weightPounds);
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "weightPounds";
      };
      wingspan = {
        value = oldResult.wingspanInches;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "wingspanInches";
      };
      handSize = {
        value = oldResult.handSizeInches;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "handSizeInches";
      };
      dash40yd = {
        value = oldResult.dash40yd;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "40ydDash";
      };
      dash10yd = {
        value = oldResult.dash10yd;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "10ydDash";
      };
      dash20yd = {
        value = oldResult.dash20yd;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "20ydDash";
      };
      verticalJump = {
        value = oldResult.verticalJumpInches;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "verticalJump";
      };
      broadJump = {
        value = oldResult.broadJumpInches;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "broadJump";
      };
      benchPressReps = {
        value = convertMeasurementFromNat(oldResult.benchPressReps);
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "benchPress";
      };
      shuttle20yd = {
        value = oldResult.shuttle20yd;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "20ydShuttle";
      };
      threeConeDrill = {
        value = oldResult.threeConeDrill;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "threeCone";
      };
      shuttle60yd = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "60ydShuttle";
      };
      shuttleProAgility = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "proAgility";
      };
      armLength = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "armLength";
      };
      bodyFatPercentage = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "bodyFat";
      };
      bmi = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "bmi";
      };
      standingReach = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "standingReach";
      };
      seatedRow = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "seatedRow";
      };
      squat = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "squat";
      };
      powerClean = {
        value = null;
        verified = true;
        notes = null;
        attemptNumber = null;
        equipmentUsed = null;
        measurementType = "powerClean";
      };
      developerNotes = null;
      passedMedical = convertBool(true);
    };
  };

  public func run(old : OldActor) : NewActor {
    let newPublicCombineEntries = old.combineState.publicCombineEntries.map<Nat, OldCombineResult, NewCombineResult>(
      func(_id, oldResult) { convertOldToNew(oldResult) }
    );

    let newUserCombines = old.combineState.userCombines.map<Principal, [OldCombineResult], [NewCombineResult]>(
      func(_user, oldResults) {
        oldResults.map(convertOldToNew);
      }
    );

    {
      combineState = {
        old.combineState with
        publicCombineEntries = newPublicCombineEntries;
        userCombines = newUserCombines;
      };
    };
  };
};
