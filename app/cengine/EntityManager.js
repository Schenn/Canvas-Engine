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
    var dependentEntities = {};

    var baseEntity;

    this.properties = {
      lockedProperty: lockedProperty,
      defaultProperty: defaultProperty
    };

    this.setBaseEntityGenerator = function(generateFunc){
      baseEntityGenerator = generateFunc;
      baseEntity = generateFunc({});
    };

    this.isEntity = function(ent){
      return baseEntity instanceof ent;
    };

    this.create = function(type, params){

      var createType = function(aType){
        return make[aType](baseEntityGenerator(params), params);
      };

      if(!CanvasEngine.utilities.exists(dependentEntities[type])) {
        return createType(type);
      } else {
        return make[type](createType(dependentEntities[type]), params);
      }
    };

    this.createFromJson = function(jso){
      return this.create(jso.type, jso);
    };

    this.setMake = function(name, func, from){
      if(Object.keys(make).indexOf(name) === -1 ){
        make[name] = func;
      }

      if(CanvasEngine.utilities.exists(from)){
        dependentEntities[name]=from;
      }
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
      if($.type(component) == "string") {
        if (Object.keys(components).indexOf(component) != -1) {
          entity.attachComponent(component, components[component](params, entity));
        }
      } else if($.type(component) == "object" || $.type(component) == "function") {
        var com = Object.keys(component);
        if($.type(component[com]) == "object" || $.type(component) == "function"){
          // Is a collection of names and data. Each tuple should be added as a component
          $.each(component[com], function(name, p){
            entity.attachComponent(name, components[com](p, entity));
          });
        } else if($.type(component[com]) == "string"){
          var name = component[name];
          if (Object.keys(components).indexOf(com) != -1 && nComponents.indexOf(com) > -1) {
            entity.attachComponent(name, components[com](params, entity));
          }
        }

      }


      return this;
    };
  };
})();