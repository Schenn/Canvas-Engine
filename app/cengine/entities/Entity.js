/**
 * @author Steven Chennault <schenn@gmail.com>
 *
 */

(function(CanvasEngine){
  // These properties are used but can only be set once

  var EM = CanvasEngine.EntityManager;
  var utils = CanvasEngine.utilities;

  /**
   * The Entity Class is the actual class for all the living objects in the Engine.
   *  It contains the base properties required for existing and the methods for communicating with its components and subentities.
   *
   * @class
   * @property {number} z_index
   * @property {string} name
   * @memberOf CanvasEngine.Entities
   *
   * @param {object} params
   * @param {string} [params.name]
   * @param {number} [params.z_index]
   *
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
     * @param {string} name the name of the component
     * @param {object} component the instantiated component
     */
    this.attachComponent = function(name, component){
      if(!this.hasComponent(name)) {
        components[name] = component;
      }
    };

    /**
     * Attach a sub-entity to this entity
     *  A sub-entity is simply another entity.
     *  This allows complex entities made up of multiple entities to be constructed.
     *  Warning: BroadcastToComponent iterates over subEntities.
     *    If you want to disconnect an inner entity from outside messages, don't attach it as a sub-entity.
     *
     * @param {CanvasEngine.Entities.Entity} subEntity
     */
    this.attachSubEntity = function(subEntity){
      subEntities[subEntity.name] = subEntity;
    };

    /**
     * Does the entity have a component?
     *
     * @param {string} componentName
     * @returns {boolean}
     */
    this.hasComponent = function(componentName){
      return Object.keys(components).indexOf(componentName)>-1;
    };

    /**
     * Tell every component to do a function.
     *    If it can't, that's ok just go to the next component.
     *
     * @param {string} funcName
     * @param {*} [args]
     */
    this.broadcastToComponents = function(funcName, args){
      $.each(components, function(name, component){
        if(utils.isFunction(component[funcName])){
          component[funcName].call(component,args);
        }
      });

      // Tell the sub-entities to tell their components to do the function as well.
      $.each(subEntities, function(name, entity){
        entity.broadcastToComponents(funcName,args);
      });
    };

    /**
     * Tell a specific component to do something, maybe with arguments.
     *
     * @param {string} componentName
     * @param {string} funcName
     * @param {*} [args]
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
     * @param {string} componentName
     * @param {string} funcName
     * @param {*} [args]
     * @throws Will throw an error if the Entity does not have the given component or the component doesn't have the given function
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
        throw this.name + " Does not have component: "+ componentName;
      }
    };

    /**
     * Get or set a property on a component
     *
     * @param {string} componentName
     * @param {string} propertyName
     * @param {*} [value]
     * @returns {*}
     */
    this.componentProperty = function(componentName, propertyName, value){
      if(utils.exists(value) && components[componentName].hasOwnProperty(propertyName)){
        components[componentName][propertyName] = value;
      }

      return components[componentName][propertyName];
    };

    /**
     * Tell a specific sub-entity to do something
     *
     * @param {string} entityName
     * @param {string} funcName
     * @param {*} [args]
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
     *    Leaves the original components untouched.
     *
     * @return {Array.<object>}
     */
    this.getComponentList = function(){
      return $.extend({}, components);
    };

  }

  // Tell the EntityManager how to build a base entity.
  EM.setBaseEntityGenerator(function(params){
    return new Entity(params);
  });
})(window.CanvasEngine);
