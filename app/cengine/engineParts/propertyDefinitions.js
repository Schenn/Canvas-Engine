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
  lockedProperty: function (privateVar) {
    return {
      enumerable: true,
      configurable: false,
      get: function () {
        return privateVar;
      },
      set: function (val) {
        // Do Nothing
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

let properties = new Proxy(propertyDefinitions, {
  get: function(definitions, name){
    return definitions[name];
  }
});

export default properties;

export const privateProperties = (function(){
  let props = new WeakMap();

  let handler = {
    get: function(props, thing){
      if(!props.has(thing)){
        props.set(thing, {});
      }

      let propHandler = {
        get: function(privateProps, prop){
          return privateProps[prop];
        },
        set: function(privateProps, prop, val){
          privateProps[prop] = val;
          return this;
        }
      };


      return new Proxy(props.get(thing), propHandler);
    }
  };

  return new Proxy(props, handler);
})();