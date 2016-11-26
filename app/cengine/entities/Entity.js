/**
 * @author Steven Chennault <schenn@gmail.com>
 *
 */

import {properties} from "engineParts/propertyDefinitions.js";
import * as utilities from "engineParts/utilities.js";
import {Component} from "components/Component.js";

const privateProperties =new WeakMap();

/**
 * The Entity Class is the actual class for all the living objects in the Engine.
 *  It contains the base properties required for existing and the methods for communicating with its components and subentities.
 *
 * @class Entity
 * @memberOf CanvasEngine.Entities
 * @property {number} z_index
 * @property {string} name
 * @param {Map} params Map
 * @param {string} [params.name]
 * @param {number} [params.z_index]
 * @param {CanvasEngine.EntityManager} EM
 */
export class Entity{
  get EntityManager() {
    return properties.proxy(privateProperties[this].EntityManager);
  }

  /**
   * Get the current state of the components on this entity.
   *    Leaves the original components untouched.
   *
   * @return {Proxy<Map>}
   */
  get componentList(){
    return properties.proxy(privateProperties[this].components);
  }

  constructor(params, EM){
    let name = params.name || utilities.randName();
    privateProperties[name] = {};
    privateProperties[name].EntityManager = EM;
    /**
     * @link{CanvasEngine.Components} provide their own self-contained functionality and are used by their parent
     *  entity to perform tasks.
     *
     * @inner
     * @type Map
     */
    privateProperties[name].components = new Map();
    /**
     * subEntities are regular @link{CanvasEngine.Entities} which belong to another.
     *
     * @inner
     * @type Map
     */
    privateProperties[name].subEntities = new Map();

    Object.defineProperties(this, {
      /**
       * @type number
       * @instance
       * @memberof Entity
       */
      z_index:properties.lockedProperty(params.z_index || 0),
      /**
       * @type string
       * @instance
       * @memberof Entity
       */
      name:properties.lockedProperty(name)
    });
    Promise.resolve(Component);
  }
  /**
   * Attach a component to this entity;
   *
   * @param {string} name the name of the component
   * @param {Component} comp the instantiated component @see{CanvasEngine.Components}
   */
  attachComponent(name, comp){
    if(!privateProperties[this.name].components.has(name) && comp instanceof Component){
      privateProperties[this.name].components.set(name, comp);
    }
  }
  /**
   * Attach a sub-entity to this entity
   *  A sub-entity is simply another entity.
   *  This allows complex entities made up of multiple entities to be constructed.
   *  Warning: BroadcastToComponent iterates over subEntities.
   *    If you want to disconnect an inner entity from outside messages, don't attach it as a sub-entity.
   *
   * @param {string} name
   * @param {Entity} entity
   */
  attachSubEntity(name, entity){
    if(entity instanceof this){
      privateProperties[this.name].subEntities.set(name, entity);
    }
  }

  /**
   * Does the entity have a component?
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasComponent(name) {
    return privateProperties[this.name].components.has(name);
  }

  /**
   * Does the entity have a sub-entity?
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasSubEntity(name){
    return privateProperties[this.name].subEntities.has(name);
  }

  /**
   * Tell every component to do a function.
   *    If it can't, that's ok just go to the next component.
   *
   * @param {string} funcName
   * @param {*} [args]
   */
  broadcastToComponent(funcName, args){
    privateProperties[this.name].components.forEach(function(name, component){
      if(utilities.isFunction(privateProperties[this.name].components[funcName])){
        component[funcName].call(component,args);
      }
    });

    privateProperties[this.name].subEntities.forEach(function(name, entity){
      entity.broadcastToComponents(funcName,args);
    });

  }

  /**
   * Tell a specific component to do something, maybe with arguments.
   *
   * @param {string} componentName
   * @param {string} funcName
   * @param {*} [args]
   */
  messageToComponent(componentName, funcName, args){
    if(utilities.exists(privateProperties[this.name].components[componentName]) &&
      utilities.isFunction(privateProperties[this.name].components[componentName][funcName])){

      if(utilities.exists(args)) {
        privateProperties[this.name].components[componentName][funcName].call(privateProperties[this.name].components[componentName], args);
      }else {
        privateProperties[this.name].components[componentName][funcName].call(privateProperties[this.name].components[componentName]);
      }
    }
  }

  /**
   * Get data from a component
   *
   * @param {string} componentName
   * @param {string} funcName
   * @param {*} [args]
   * @throws Will throw an error if the Entity does not have the given component or the component doesn't have the given function
   * @returns {*}
   */
  getFromComponent(componentName, funcName, args){
    if(utilities.exists(privateProperties[this.name].components[componentName]) &&
      utilities.isFunction(privateProperties[this.name].components[componentName][funcName])){

      if(utilities.exists(args)) {
        return privateProperties[this.name].components[componentName][funcName].call(privateProperties[this.name].components[componentName],args);
      }else {
        return privateProperties[this.name].components[componentName][funcName].call(privateProperties[this.name].components[componentName]);
      }
    }
    else {
      throw this.name + " Does not have component: "+ componentName;
    }
  }

  /**
   * Get or set a property on a component
   *
   * @param {string} componentName
   * @param {string} propertyName
   * @param {*} [value]
   * @returns {*}
   */
  componentProperty(componentName, propertyName, value){
    if(utilities.exists(value) && privateProperties[this.name].components[componentName].hasOwnProperty(propertyName)){
      privateProperties[this.name].components[componentName][propertyName] = value;
    }

    return privateProperties[this.name].components[componentName][propertyName];
  }

  /**
   * Tell a specific sub-entity to do something
   *
   * @param {string} entityName
   * @param {string} funcName
   * @param {*} [args]
   */
  messageToSubEntity(entityName, funcName, args){
    if(utilities.exists(privateProperties[this.name].subEntities[entityName]) &&
      utilities.isFunction(privateProperties[this.name].subEntities[entityName][funcName])){

      if(utilities.exists(args)) {
        privateProperties[this.name].subEntities[entityName][funcName].call(privateProperties[this.name].subEntities[entityName], args);
      }else {
        privateProperties[this.name].subEntities[entityName][funcName].call(privateProperties[this.name].subEntities[entityName]);
      }
    }
  }
}
