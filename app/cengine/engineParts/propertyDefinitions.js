/**
 * Created by schenn on 6/23/16.
 */
let propertyDefinitions = {
  defaultProperty: function (privateVar, callback) {
    return {
      enumerable: true,
      configurable: false,
      get: function () {
        return privateVar;
      },
      set: function (val) {
        if(typeof(privateVar)=="number"){
          val = Number(val);
        } else if (typeof(privateVar) == "string"){
          val = val.toString();
        } else if(typeof(privateVar) == "boolean"){
          val = Boolean(val);
        }
        privateVar = val;
        if(CanvasEngine.utilities.isFunction(callback)){
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
        // Call the callback with the passed value
        if(CanvasEngine.utilities.isFunction(callback)){
          callback(val);
        }
      }
    };
  },
  proxy: function(privateVar){
    return new Proxy(privateVar, {
      get: function(privateVar, index){
        return privateVar[index];
      }
    });
  },
  observe: function({name, value, locked=false, callback}, object){
    var prop = (locked === true)? this.lockedProperty(value, callback) : this.defaultProperty(value, callback);
    Object.defineProperty(object, name, prop);
  }
};

export var properties = new Proxy(propertyDefinitions, {
  get: function(definitions, name){
    return definitions[name];
  }
});