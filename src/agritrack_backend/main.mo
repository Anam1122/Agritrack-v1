import Int "mo:base/Int";
import Text "mo:base/Text";

actor AgriTrack {
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
