/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @namespace LocalParams
 */
/**
 * @namespace EntityParams
 */
/**
 * @namespace ComponentParams
 */
/**
 * @namespace Callbacks
 */
/**
 * Optional CreateParams which trigger specific functionality
 *
 * @typedef {object} LocalParams~CreateParams
 * @property {string | Image } [image] - The name of the Image resource to utilize
 * @property {string | Object } [spritesheet] - The name of the SpriteSheet resource to utilize
 * @property {string | Array } [spritesheets] - A collection of spritesheets to utilize.
 * @property {number} [z_index] - The z-index the entity will live at
 * @property {Object} [keys] - The alphanumeric keys that your entity will listen for and their callback methods.
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onClick] - The callback method(s) your entity will trigger when clicked.
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onMouseDown] - The callback method(s) your entity will trigger when the mouse is down over it.
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onMouseUp] - The callback method(s) your entity will trigger when the mouse button is released over it.
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onMouseOver] - The callback method(s) your entity will trigger when the mouse is sitting over it
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onMouseMove] - The callback method(s) your entity will trigger when the mouse is moving over it.
 *
 */

/**
 * @callback Callbacks~onPropertyChanged
 * @param {*} value The new Value
 */


import {getClassList} from "EntityList.js";
import {getComponentList} from "ComponentList.js";
import * as utilities from "engineParts/utilities.js";
import {properties} from "engineParts/propertyDefinitions.js";

const privateProperties = new WeakMap();

export class EntityManager {
  constructor(ResourceManager, EntityTracker) {
    if(!utilities.exists(ResourceManager)) throw "No ResourceManager provided";
    if(!utilities.exists(EntityTracker)) throw "No EntityTracker provided";
    privateProperties[this] = {};
    Promise.resolve(getClassList);
    Promise.resolve(getComponentList);
    privateProperties[this].entities = getClassList();
    privateProperties[this].components = getComponentList();
    privateProperties[this].baseEntity = privateProperties[this].entities.get("BaseEntity");
    privateProperties[this].ResourceManager = ResourceManager;
    privateProperties[this].EntityTracker = EntityTracker;

  }
  isEntity(ent){
    return ent instanceof privateProperties[this].baseEntity;
  }

  /**
   * Create an entity
   *
   * Use json to create a fully formed entity based on the parameters sent across.
   *
   * @param {string} type the type of entity to create
   * @param {LocalParams~CreateParams} params The data needed to create that entity and its components
   *
   * @memberof CanvasEngine~EntityManager
   * @returns {Entity} The requested Entity
   */
  create(type, params){

    // Replace image, sound and SpriteSheet params with their values from the ResourceManager
    if(utilities.exists(params.image)){
      params.image = privateProperties[this].ResourceManager.getImage(params.image);
    }

    if(utilities.exists(params.spritesheet) && typeof(params.spritesheet) === "string"){
      params.spritesheet = privateProperties[this].ResourceManager.getSpriteSheet(params.spritesheet);
    } else if(utilities.exists(params.spritesheets)){
      params.spritesheets.forEach((sheetName, refName)=>{
        if(typeof(sheetName) === 'string') {
          params.spritesheets[refName] = privateProperties[this].ResourceManager.getSpriteSheet(sheetName);
        }
      });
    }

    // Make sure that the z_index is set properly
    if(!utilities.exists(params.z_index)){
      params.z_index = privateProperties[this].EntityTracker.maxZ;
    }

    // Create the entity
    let entity;
    entity = new (privateProperties[this].entities.get(type))(params, this);

    // Attach the click and other event handling components.
    if(utilities.exists(params.onClick) ||
      utilities.exists(params.onMouseOver) ||
      utilities.exists(params.onMouseUp) ||
      utilities.exists(params.onMouseDown) ||
      utilities.exists(params.onMouseMove)){

      this.attachComponent(entity, "Mouse", params);
    }

    if(utilities.exists(params.keys)){
      this.attachComponent(entity, "KeyPress", params.keys);
    }

    return entity;
  }

  /**
   * Attach a component to an entity
   *
   * Attach a component or components to a given entity.
   *
   * @memberof CanvasEngine~EntityManager
   * @param {Entity} entity The entity to attach components to.
   * @param {string | Component | Object.<string, object> | Object.<string, string> } component The components to add.
   * @param {Object} [params] The arguments for the components. Optional if you use the Object.<string, Object> argument.
   *
   * @returns {EntityManager}
   */
  attachComponent(entity, component, params){
    // component === "componentName"
    if(typeof(component) == "string"){
      if(privateProperties[this].components.has(component)){
        entity.attachComponent(component, new (privateProperties[this].components.get(component))(params, entity));
      }
    } else if (component instanceof privateProperties[this].components.get("BaseComponent")){
      entity.attachComponent(component.constructor.name, component);
    } else if (typeof(component) == "object") {
      for(let com of Object.keys(component)){
        if(typeof(component[com]) == "object"){
          /** component = {"componentName" : {"name to use" : data }} */
          let names = Object.keys(component[com]);
          for(let name of names){
            entity.attachComponent(name, new (privateProperties[this].components.get(component[com]))(params, entity));
          }
        } else if(typeof(component[com]== "string")){
          /** component = {"componentName" : "name to use"} */
          entity.attachComponent(component[com], new (privateProperties[this].components.get(com))(params, entity));
        }
      }
    }

    return this;
  }

  /**
   * Convert an array of json data to an array of Entities
   *
   * @param {object[]} screenMap The array of entity constructor data.
   * @return {Entity[]}
   */
  fromMap(screenMap){

    let entities = [];

    for(let data of screenMap){
      entities.push(this.create(data.type, data));
    }

    return entities;
  }
}