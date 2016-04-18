/**
 * Created by schenn on 4/17/16.
 */
(function(){
  function lockedProperty(val){
    return {
      enumerable: true,
      writable: false,
      configurable: false,
      value: val
    };
  }

  // The default property configuration
  function defaultProperty(privateVar, callback) {
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
        }
        privateVar = val;
        if(CanvasEngine.utilities.isFunction(callback)){
          callback(val);
        }
      }
    };
  }

  CanvasEngine.EntityManager = function(){
    var baseEntityGenerator;
    var make = {};
    var components = {};
    var nComponents = [];

    var baseEntity;
    var baseComponent;

    this.properties = {
      lockedProperty: lockedProperty,
      defaultProperty: defaultProperty
    };

    this.setBaseEntityGenerator = function(generateFunc){
      baseEntityGenerator = generateFunc;
      baseEntity = generateFunc({});
    };

    this.setBaseComponent = function(bc){
      baseComponent = bc;
    };

    this.isEntity = function(ent){
      return baseEntity instanceof ent;
    };

    this.get = function(type, params){
      return make[type](baseEntityGenerator(params), params);
    };

    this.setMake = function(name, func){
      if(Object.keys(make).indexOf(name) === -1 )
        make[name] = func;

      return this;
    };

    this.addComponent = function(name, func, notUnique){
      if(Object.keys(components).indexOf(name) === -1)
        components[name] = func;

      if(notUnique)
        nComponents.push(name);

      return this;
    };

    this.attachComponent = function(entity, component, params){
      if(isString(component)) {
        if (Object.keys(components).indexOf(component) != -1) {
          entity.attachComponent(component, components[component](params, entity));
        }
      } else if(isObject(component)) {
        var name = Object.keys(component);
        var com = component[name];
        if (Object.keys(components).indexOf(com) != -1 && nComponents.indexOf(com) > -1) {
          entity.attachComponent(name, components[com](params, entity));
        }
      }


      return this;
    }
  };
})();