/**
 * @author Steven Chennault <schenn@gmail.com>
 *
 */

import {properties} from "../engineParts/propertyDefinitions.js";
import * as utilities from "../engineParts/utilities.js";
import {Component} from "../components/Component.js";

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
    return properties.proxy(privateProperties[this.name].EntityManager);
  }

  /**
   * Get the current state of the components on this entity.
   *    Leaves the original components untouched.
   *
   * @return {Proxy<Map>}
   */
  get componentList(){
    return properties.proxy(privateProperties[this.name].components);
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
    if(entity instanceof Entity){
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
  broadcastToComponents(funcName, args){
    privateProperties[this.name].components.forEach((component, name)=>{

      if(utilities.isFunction(component[funcName])){
        component[funcName].call(component,args);
      }
    });

    privateProperties[this.name].subEntities.forEach((entity, name)=>{
      entity.broadcastToComponents(funcName,args);
    });

  }

  /**
   * Ask a component to do something, or get a value from its properties.
   * Replaces messageToComponent and getFromComponent.
   *
   * @param componentName
   * @param funcName
   * @param args
   * @returns {*}
   */
  askComponent(componentName, funcName, args) {
    const comp = privateProperties[this.name].components.get(componentName);
    if (comp) {
      if (typeof comp[funcName] === "function") {
        return comp[funcName].call(comp, args);
      } else if (typeof comp[funcName] !== "undefined") {
        return comp[funcName];
      }
    }
    throw new Error(`${this.name} does not have component: ${componentName}`);
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
    let comp = privateProperties[this.name].components.get(componentName);
    if(utilities.exists(value) && typeof comp[propertyName] !== "undefined"){
      comp[propertyName] = value;
    }

    return comp[propertyName];
  }

  /**
   * Tell a specific sub-entity to do something
   *
   * @param {string} entityName
   * @param {string} funcName
   * @param {*} [args]
   */
  messageToSubEntity(entityName, funcName, args){
    let subEntity = privateProperties[this.name].subEntities.get(entityName);
    if(utilities.exists(subEntity) &&
      utilities.isFunction(subEntity[funcName])){

      if(utilities.exists(args)) {
        subEntity[funcName].call(subEntity, args);
      }else {
        subEntity[funcName].call(subEntity);
      }
    }
  }
}
