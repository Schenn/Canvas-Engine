/**
 * Created by schenn on 11/25/16.
 */

/**
 * This test demonstrated that 'this' isn't good enough of a key for private properties.
 *
 * There has to be a more unique value to use.
 *
 * For now, use 'names' on entities and random strings or the filename on spritesheets.
 *
 */

SystemJS.import('engineParts/propertyDefinitions.js').then(function(m) {

  const privateProperties = new WeakMap();

  class pseudo {

    constructor(testValue){
      this.id = testValue;
      privateProperties[this.id] = {};
      privateProperties[this.id].testProp = testValue;
    }

    getTestProp(){
      return privateProperties[this.id].testProp;
    }

  }

  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/EngineParts/EntityManager
   */
  QUnit.module("EngineParts/Properties");

  QUnit.test("Properties Are Present", function(assert){
    let p = new pseudo("a");

    assert.equal("a", p.getTestProp(), "Test value was not found in private property weakmap.");
  });

  QUnit.test("Properties don't override identical object properties", function(assert){
    let a = new pseudo("a");
    let b = new pseudo("b");

    assert.equal("a", a.getTestProp(), "Test value for a should be unique to a.");
    assert.equal("b", b.getTestProp(), "Test value for b should be unique to b.");
  });

});