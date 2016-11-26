/**
 * Created by schenn on 8/6/16.
 */
/**
 * Entity Tracker works by tracking Entities.
 *  This requires an Entity to test
 */
import {Entity} from "entities/Entity.js";
import {EntityTracker} from "engineParts/EntityTracker.js";

  QUnit.module("EngineParts/EntityTracker", {
    before: function(){
      this.entityTracker = new EntityTracker();
      this.a = new Entity({name: "a", z_index:0}, {});
      this.b = new Entity({name: "b", z_index:1}, {});
    }
  },function(){
    /**
     * We're testing the Base Component object
     * @module CanvasEngine/tests/EngineParts/EntityManager
     */

    QUnit.test("Entity Tracker adds ENTITIES only", function(assert){
      let et = this.entityTracker;
      let a = this.a;
      assert.ok(function(){
        et.addEntities([a]);
      }, "Entity added ok");

      et.addEntities([a]);
      assert.propEqual(et.getEntities(["a"])[0],
        a,
        "We gain access to our Entity through a Proxy object when we ask for it.");

      assert.throws(function(){
        et.addEntities([{}]);
      },/Entity/, "Adding a non-entity throws critical error.");
    });

    QUnit.test("Entity Tracker can remove entities", function(assert){
      let et = this.entityTracker;
      et.addEntities([this.a]);
      et.removeEntities(["a"]);
      assert.ok(true, "Remove Entity didn't throw");

      assert.equal(et.getEntities(["a"]).length,0,"Entity wasn't found after being removed.");
    });

    QUnit.test("Entity Tracker can clear its entities", function(assert){
      let et = this.entityTracker;
      et.addEntities([this.a,this.b]);
      let preEnts = et.getEntities(["a","b"]);
      assert.equal(preEnts.length,2, "Entities were added to Entity Tracker.");
      et.clearEntities();
      let ents = et.getEntities(["a","b"]);
      assert.equal(ents.length,0, "No Entities found after clearing");
    });

    QUnit.test("Entity Tracker knows what the highest z-index is.", function(assert){
      let et = this.entityTracker;
      et.addEntities([this.a,this.b]);

      assert.equal(et.maxZ,1, "Maximum Z property is correct");
    });

    QUnit.test("Entity Tracker can retrieve entities by z-index.", function(assert){
      let et = this.entityTracker;

      et.addEntities([this.a,this.b]);

      assert.equal(et.getEntitiesByZ(0)[0],this.a.name, "Got the correct entity");
      assert.equal(et.getEntitiesByZ(0).length, 1, "Got the correct number of entities");

    });

    /**
     QUnit.test("Entity Tracker can find entities based off a specific pixel coordinate", function(assert){

      });
     */

    /**
     QUnit.test("When searching for pixel interactions, Entity Tracker ignores excluded z-indexes.", function(assert){

      });
     */
  });