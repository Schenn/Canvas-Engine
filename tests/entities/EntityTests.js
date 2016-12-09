/**
 * Created by schenn on 8/6/16.
 */
SystemJS.import('entities/Entity.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/Entities/Entity
   */
  QUnit.module("Entities/Entity");

  QUnit.test("Entity Requires EntityManager", function(assert){
    assert.throws(function(){
      let entity = new m.Entity();
    }, /defined/, "Entity won't construct without a reference to an EntityManager instance");

    assert.ok(function(){
      let entity = new m.Entity({},{});
    }, "Entity WILL construct with a plain object as an argument");
  });

  QUnit.test("Entity Properties are unique to Entity", function(assert){
    let a = new m.Entity({},{p:"a"});
    let b = new m.Entity({}, {p:"b"});

    assert.equal(a.EntityManager.p, "a", "A.EntityManager, a property on A, should be unique to A.");
    assert.equal(b.EntityManager.p, "b", "A.EntityManager, a property on B, should be unique to B.");

  });

});