import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";

actor {
  type Item = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  stable var nextId: Nat = 0;
  let itemMap = HashMap.HashMap<Nat, Item>(10, Nat.equal, Nat.hash);

  public func addItem(text: Text) : async Result.Result<Nat, Text> {
    let id = nextId;
    nextId += 1;
    let newItem: Item = {
      id = id;
      text = text;
      completed = false;
    };
    itemMap.put(id, newItem);
    #ok(id)
  };

  public query func getItems() : async [Item] {
    Array.map<(Nat, Item), Item>(Iter.toArray(itemMap.entries()), func (entry) { entry.1 })
  };

  public func markItemComplete(id: Nat) : async Result.Result<(), Text> {
    switch (itemMap.get(id)) {
      case (null) { #err("Item not found") };
      case (?item) {
        let updatedItem: Item = {
          id = item.id;
          text = item.text;
          completed = true;
        };
        itemMap.put(id, updatedItem);
        #ok()
      };
    }
  };

  public func deleteItem(id: Nat) : async Result.Result<(), Text> {
    switch (itemMap.remove(id)) {
      case (null) { #err("Item not found") };
      case (?_) { #ok() };
    }
  };
}
