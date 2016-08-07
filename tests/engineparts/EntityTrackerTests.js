/**
 * Created by schenn on 8/6/16.
 */
SystemJS.import('engineParts/EntityTracker.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/EngineParts/EntityManager
   */
  QUnit.module("EngineParts/EntityTracker");

  QUnit.test("EntityTracker Constructor", function(assert){
    assert.ok(function(){
      let et = new m.EntityTracker();
    }, "EntityTracker Constructs without any arguments.");
  });

});