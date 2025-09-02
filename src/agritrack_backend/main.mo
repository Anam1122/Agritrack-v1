import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

actor AgriTrack {
  // ===== TYPE DEFINITIONS =====
  public type Product = {
    id : Text;
    name : Text;
    farmLocation : Text;
    harvestDate : Text;
    variety : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type ProductStage = {
    id : Text;
    productId : Text;
    stageType : Text;
    timestamp : Int;
    data : Text;
    actor : Text;
  };

  // ===== STORAGE =====
  var products = HashMap.HashMap<Text, Product>(0, Text.equal, Text.hash);
  var stages = HashMap.HashMap<Text, ProductStage>(0, Text.equal, Text.hash);
  var productCount : Nat = 0;
  var stageCount : Nat = 0;

  // ===== PRODUCT METHODS =====
  public shared ({ caller }) func addProduct(
    name : Text,
    farmLocation : Text, 
    harvestDate : Text,
    variety : Text
  ) : async Result.Result<Text, Text> {
    let productId = generateId("prod");
    let now = Time.now();
    
    let product : Product = {
      id = productId;
      name = name;
      farmLocation = farmLocation;
      harvestDate = harvestDate;
      variety = variety;
      createdAt = now;
      updatedAt = now;
    };
    
    products.put(productId, product);
    productCount += 1;
    #ok(productId);
  };

  public query func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    Iter.toArray(products.vals());
  };

  // ===== PRODUCT STAGE METHODS =====
  public shared ({ caller }) func addProductStage(
    productId : Text,
    stageType : Text,
    data : Text
  ) : async Result.Result<Bool, Text> {
    // Check if product exists
    switch (products.get(productId)) {
      case null { 
        return #err("Product not found: " # productId);
      };
      case (?product) {
        let stageId = generateId("stage");
        let now = Time.now();
        
        let stage : ProductStage = {
          id = stageId;
          productId = productId;
          stageType = stageType;
          timestamp = now;
          data = data;
          actor = Principal.toText(caller);
        };
        
        stages.put(stageId, stage);
        stageCount += 1;
        #ok(true);
      };
    };
  };

  public query func getProductStages(productId : Text) : async [ProductStage] {
    let allStages = Iter.toArray(stages.vals());
    Array.filter(allStages, func (stage : ProductStage) : Bool {
      stage.productId == productId
    });
  };

  public query func getAllStages() : async [ProductStage] {
    Iter.toArray(stages.vals());
  };

  // ===== HELPER METHODS =====
  func generateId(prefix : Text) : Text {
    let timestamp = Int.toText(Time.now());
    let randomPart = Int.toText(productCount + stageCount);
    prefix # "-" # timestamp # "-" # randomPart;
  };

  // ===== ADMIN/DEBUG METHODS =====
  public shared ({ caller }) func resetAllData() : async Bool {
    // Hanya untuk development - hapus di production
    products := HashMap.HashMap<Text, Product>(0, Text.equal, Text.hash);
    stages := HashMap.HashMap<Text, ProductStage>(0, Text.equal, Text.hash);
    productCount := 0;
    stageCount := 0;
    true;
  };

  public query func getStats() : async {
    productCount : Nat;
    stageCount : Nat;
  } {
    {
      productCount = productCount;
      stageCount = stageCount;
    };
  };

  // ===== KEEP GREET FOR TESTING =====
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "! Welcome to AgriTrack Backend";
  };
};
