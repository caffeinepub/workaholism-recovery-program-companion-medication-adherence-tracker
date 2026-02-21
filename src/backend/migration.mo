import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type SubscriptionStatus = {
    #Active : Time.Time;
    #Pending;
    #Expired;
  };

  type OldCallerUserProfile = {
    name : Text;
    subscriptionStatus : SubscriptionStatus;
    isAdmin : Bool;
  };

  type NewCallerUserProfile = {
    name : Text;
    subscriptionStatus : SubscriptionStatus;
    isAdmin : Bool;
    hasPaid : Bool;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldCallerUserProfile>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewCallerUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldCallerUserProfile, NewCallerUserProfile>(
      func(_, oldProfile) {
        { oldProfile with hasPaid = false };
      }
    );
    { userProfiles = newUserProfiles };
  };
};
