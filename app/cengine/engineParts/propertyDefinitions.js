/**
 * Property Definitions can be used by Object.setProperty to define standard object propeties.
 *
 * default Property is an object property that behaves as a normal object property in
 *  that it is enumerable, semi-typed, and can perform some action when the value is set.
 *
 * locked Property is a read only property. It cannot be changed after its been set,
 *  however, attempting to set the property can still trigger an action with the new value
 *  if a callback has been provided.
 */
let propertyDefinition = {
  defaultProperty: function (privateVar, callback) {
    return {
      enumerable: true,
      configurable: false,
      get: function () {
        return privateVar;
      },
      set: function (val) {
        // Use the type of the original variable to coerce the incoming value to that type.
        if(typeof(privateVar) === "number"){
          val = Number(val);
        } else if (typeof(privateVar) === "string"){
          val = val.toString();
        } else if(typeof(privateVar) === "boolean"){
          val = Boolean(val);
        }
        privateVar = val;
        if($.isFunction(callback)){
          callback(val);
        }
      }
    };
  },
  lockedProperty: function (privateVar, callback) {
    return {
      enumerable: true,
      configurable: false,
      get: function () {
        return privateVar;
      },
      set: function (val) {
        // Don't change the private variable.
        // Call the callback with the passed value.
        if($.isFunction(callback)){
          callback(val);
        }
      }
    };
  },
  // Wrap content in a proxy and provide a getter to that object
  proxy: function(privateVar){
    return new Proxy(privateVar, {
      get: function(privateVar, index){
        return privateVar[index];
      }
    });
  },
  // Watch a given property for a value change.
  //  If it changes, trigger a callback.
  observe: function({name, value, locked=false, callback}, object){
    let prop = (locked === true) ?
        this.lockedProperty(value, callback) :
        this.defaultProperty(value, callback);
    Object.defineProperty(object, name, prop);
  }
};

/**
 * Export a getter to prevent other tools from overriding the content of the
 *  property definitions.
 */
export const propertyDefinitions = new Proxy(propertyDefinitions, {
  get: function(definitions, name){
    return definitions[name];
  }
});