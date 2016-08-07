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
      let entity = new Entity();
    }, /defined/, "Entity won't construct without a reference to an EntityManager instance");

    assert.ok(function(){
      let entity = new Entity({},{});
    }, "Entity WILL construct with a plain object as an argument");
  });

});