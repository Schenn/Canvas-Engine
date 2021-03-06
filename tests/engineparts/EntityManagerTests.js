/**
 * Created by schenn on 8/6/16.
 */

SystemJS.import('engineParts/EntityManager.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/EngineParts/EntityManager
   */
  QUnit.module("EngineParts/EntityManager", {}, ()=>{
    QUnit.test("EntityManager Won't Construct", function(assert){
      assert.throws(function(){
        let em = new m.EntityManager();
      }, /provided/, "EntityManager won't construct without it's dependencies");
    });


    QUnit.test("EntityManager can construct with pseudo objects", function(assert){
      let em = new m.EntityManager({},{});
      assert.ok(em, "EM should have constructed ok.");
    });

  });

});