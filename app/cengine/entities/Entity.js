/**
 * Created by schenn on 3/30/16.
 */

(function(){
  // These properties are used but can only be set once

  var EM = CanvasEngine.EntityManager;
  var utils = CanvasEngine.utilities;

  /**
   * The Entity Class is the actual class for all the living objects in the Engine.
   *  It contains the base properties required for existing and the methods for communicating with its components and subentities.
   *
   * @param params
   * @constructor
   */
  function Entity(params){
    var components = {};
    var subEntities = {};

    // Fixed Public Properties
    // The z_index and name cannot be changed.
    Object.defineProperties(this, {
      z_index:EM.properties.lockedProperty(params.z_index || 0),
      name:EM.properties.lockedProperty(params.name || utils.randName())
    });

    if(params.hasOwnProperty("z_index")){
      delete params.z_index;
    }

    /**
     * Attach a component to this entity;
     *
     * @param name the name of the component
     * @param component the instantiated component
     */
    this.attachComponent = function(name, component){
      if(!this.hasComponent(name)) {
        components[name] = component;
      }
    };

    /**
     * Attach a subentity to this entity
     *  A subentity is simply another entity.
     *  This allows complex entities made up of multiple entities to be constructed.
     * @param subEntity
     */
    this.attachSubEntity = function(subEntity){
      subEntities[subEntity.name] = subEntity;
    };

    /**
     * Does the entity have a component?
     * @param componentName
     * @returns {boolean}
     */
    this.hasComponent = function(componentName){
      return Object.keys(components).indexOf(componentName)>-1;
    };

    /**
     * Tell every component to do a function.
     *    If it can't, that's ok just go to the next component.
     *
     * @param funcName
     * @param args
     */
    this.broadcastToComponents = function(funcName, args){
      $.each(components, function(name, component){
        if(utils.isFunction(component[funcName])){
          component[funcName].call(component,args);
        }
      });

      // Tell the subentities to tell their components to do the function as well.
      $.each(subEntities, function(name, entity){
        entity.broadcastToComponents(funcName,args);
      });
    };

    /**
     * Tell a specific function to do a function,
     *    maybe with arguments.
     *
     * @param componentName
     * @param funcName
     * @param args
     */
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

    /**
     * Get data from a component
     *
     * @param componentName
     * @param funcName
     * @param args
     * @returns {*}
     */
    this.getFromComponent = function(componentName, funcName, args){
      if(utils.exists(components[componentName]) &&
        utils.isFunction(components[componentName][funcName])){

        if(utils.exists(args)) {
          return components[componentName][funcName].call(components[componentName],args);
        }else {
          return components[componentName][funcName].call(components[componentName]);
        }
      }
      else {
        // Error handle
      }
    };

    /**
     * Tell a subentity to try to run a function,
     *    maybe with args
     *
     * @param entityName
     * @param funcName
     * @param args
     */
    this.messageToSubEntity = function(entityName, funcName, args){
      if(utils.exists(subEntities[entityName]) &&
        utils.isFunction(subEntities[entityName][funcName])){

        if(utils.exists(args)) {
          subEntities[entityName][funcName].call(subEntities[entityName], args);
        }else {
          subEntities[entityName][funcName].call(subEntities[entityName]);
        }
      }
    };

    /**
     * Get the current state of the components on this entity.
     *    Leaves the original components untouched. Nothing you do to these values will affect a component.
     */
    this.getComponentList = function(){
      return $.extend({}, components);
    };

  }

  // Tell the EntityManager how to build a base entity.
  EM.setBaseEntityGenerator(function(params){
    return new Entity(params);
  });
})();
