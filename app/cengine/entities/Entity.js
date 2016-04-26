/**
 * Created by schenn on 3/30/16.
 */

(function(){
  // These properties are used but can only be set once

  var EM = CanvasEngine.EntityManager;
  var utils = CanvasEngine.utilities;

  function Entity(params){
    var components = {};
    var subEntities = {};

    // Fixed Public Properties
    Object.defineProperties(this, {
      z_index:EM.properties.lockedProperty(params.z_index || 0),
      name:EM.properties.lockedProperty(params.name || utils.randName())
    });

    if(params.hasOwnProperty("z_index")){
      delete params.z_index;
    }

    this.attachComponent = function(name, component){
      if(!this.hasComponent(name)) {
        components[name] = component;
      }
    };

    this.attachSubEntity = function(subEntity){
      subEntities[subEntity.name] = subEntity;
    };

    this.hasComponent = function(componentName){
      return Object.keys(components).indexOf(componentName)>-1;
    };

    this.broadcastToComponents = function(funcName, args){
      $.each(components, function(name, component){
        if(utils.isFunction(component[funcName])){
          component[funcName].call(component,args);
        }
      });

      $.each(subEntities, function(name, entity){
        entity.broadcastToComponents(funcName,args);
      });
    };

    this.messageToComponent = function(componentName, funcName, args){
      if(utils.exists(components[componentName]) &&
        utils.isFunction(components[componentName][funcName])){

        if(utils.exists(args)) {
          components[componentName][funcName].call(components[componentName], args);
        }else {
          components[componentName][funcName].call(components[componentName]);
        }
      }
    };

    this.getFromComponent = function(componentName, funcName, args){
      if(utils.exists(components[componentName]) &&
        utils.isFunction(components[componentName][funcName])){

        if(utils.exists(args)) {
          return components[componentName][funcName].call(components[componentName],args);
        }else {
          return components[componentName][funcName].call(components[componentName]);
        }
      }
    };

  }

  EM.setBaseEntityGenerator(function(params){
    return new Entity(params);
  });
})();
