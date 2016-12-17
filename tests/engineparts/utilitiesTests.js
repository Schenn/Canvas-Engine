/**
 * Created by schenn on 7/25/16.
 */
/**
 * Load the utilities file through SystemJS and test it.
 * We do it this way to as this will be the method by which the end user retrieves the library
 *  as the es6 Import statements are yet to be implemented.
 */
/**
 * @module CanvasEngine/tests/EngineParts/Utilities
 */

SystemJS.import('engineParts/utilities.js').then(function(m) {

  QUnit.module("EngineParts:Utilities", {}, ()=>{
    /**
     * Test the Exists method
     *
     * Exists determines if a variable isn't undefined or null.
     *
     * @function CanvasEngine/tests/EngineParts/Utilities~exists
     * @see CanvasEngine/EngineParts/Utilities~exists
     */
    QUnit.test("Exists", function(assert){
      let x;
      assert.ok(m.exists(true), "true exists");
      assert.notOk(m.exists(x), "x is still undefined");

      x=10;
      assert.ok(m.exists(x), "x now has a value");
    });

    /**
     * Test the orDefault method
     *
     * orDefault returns a value based on whether or not a given variable is set already.
     *
     * @function CanvasEngine/tests/EngineParts/Utilities~orDefault
     * @see CanvasEngine/EngineParts/Utilities~orDefault
     */
    QUnit.test("orDefault", function(assert){
      assert.equal(10, m.orDefault(10, 100), "10 is a value, we don't get the default of 100");

      let x;
      assert.equal(10, m.orDefault(x, 10), "x has no value, got default of 10");
      assert.notEqual(10, x, "x's value didn't change");

      x=10;
      assert.equal(10, m.orDefault(x, 100), "x has a value now, it is 10");
      assert.notEqual(100, m.orDefault(x, 100), "x has a value now, we don't get the default");

    });

    /**
     * Test the isArray method
     *
     * Determines if a value is an array
     *
     * @function CanvasEngine/tests/EngineParts/Utilities~isArray
     * @see CanvasEngine/EngineParts/Utilities~isArray
     */
    QUnit.test("isArray", function(assert){
      let x = [];
      let y = [1,2,3];
      let z;

      assert.ok(m.isArray(x), "x is an array, even when empty");
      assert.ok(m.isArray(y), "y is an array with values");
      assert.notOk(m.isArray(z), "z is undefined");

      z = 10;
      assert.notOk(m.isArray(z), "z is a number");
      z = "10";
      assert.notOk(m.isArray(z), "z is a string");

    });

    /**
     * Test the cleanArray method
     *
     * Clean Array removes empty indexes from an array, then returns it.
     *
     * @function CanvasEngine/tests/EngineParts/Utilities~cleanArray
     * @see CanvasEngine/EngineParts/Utilities~cleanArary
     */
    QUnit.test("cleanArray", function(assert){
      let y = x = ["a","b","c","d","e"];

      delete y[2];

      assert.notEqual(y.keys(), x.keys(), "Index 2 removed from y");
      assert.equal(y.length, x.length, "Even though the value was deleted, the arrays are the same length");

      y = m.cleanArray(y);
      assert.notEqual(y.length, x.length, "y has been cleaned, the undefined entry has been removed.");
      assert.equal(y[0], x[0], "y[0] is equal to x[0]");
      assert.equal(y[1], x[1], "y[1] is equal to x[1]");
      assert.equal(y[2], x[3], "y[2] is equal to x[3]");
      assert.equal(y[3], x[4], "y[3] is equal to x[4]");

      assert.throws(y[4], "y has no index 4, so Array throws a key undefined");

    });

    /**
     * Test the randName method
     *
     * randName generates a random string to be used for naming things.
     *
     * @function CanvasEngine/tests/EngineParts/Utilities~randName
     * @see CanvasEngine/EngineParts/Utilities~randName
     */
    QUnit.test("randName", function(assert){
      assert.ok(m.randName(), "We get a not null value from the randName method.");
    });

    /**
     * Test the parseJsonArray method
     *
     * parseJsonArray converts a json encoded array of json encoded objects into a js array of proper json objects.
     *
     * @function CanvasEngine/tests/EngineParts/Utilities~parseJsonArray
     * @see CanvasEngine/EngineParts/Utilities~parseJsonArray
     */
    QUnit.test("parseJsonArray", function(assert){
      var j = '["{\\"a\\":1,\\"b\\":2,\\"c\\":3}","{\\"d\\":4,\\"e\\":5,\\"f\\":6}"]';

      assert.ok($.parseJSON(j), "j does parse as json");
      assert.notEqual($.parseJSON(j), j, "j isn't the same string as before");

      let k = $.parseJSON(j);

      assert.equal(k[0],'{"a":1,"b":2,"c":3}', "Using parseJSON leaves stringified objects as strings");

      let l = m.parseJsonArray(j);

      assert.notEqual(l[0], k[0], "parseJsonArray also parses the stringified objects within the array.");
      assert.equal(l[0].a,1, "The stringified object is now an object with relevant values.");


    });

  });

});