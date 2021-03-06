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


import {getClassList} from "../EntityList.js";
import {getComponentList} from "../ComponentList.js";
import * as utilities from "./utilities.js";

const privateProperties = new WeakMap();

/**
 * Entity Manager maintains the information needed for creating new Entities and Components.
 *
 * @class
 */
export class EntityManager {

  get ResourceManager(){
    return privateProperties[this].ResourceManager;
  }

  get EntityTracker(){
    return privateProperties[this].EntityTracker;
  }


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
    if(params.image){
      params.image = this.ResourceManager.getImage(params.image);
    }
    if(params.spritesheet && typeof(params.spritesheet) === "string"){
      let sheetName = params.spritesheet;
      params.spritesheet= {};
      params.spritesheet[sheetName] = this.ResourceManager.getSpriteSheet(sheetName);
    } else if(params.spritesheets){
      let refNames = Object.keys(params.spritesheets);

      refNames.forEach((refName)=>{
        let sheetName = params.spritesheets[refName];

        if(typeof(sheetName) === 'string') {
          params.spritesheets[refName] = this.ResourceManager.getSpriteSheet(sheetName);
        } else {
          console.log(sheetName);
          console.log(refName);
        }
      });
    }

    // Make sure that the z_index is set properly
    if(!utilities.exists(params.z_index)){
      params.z_index = privateProperties[this].EntityTracker.maxZ;
    }

    // Create the entity
    if(!privateProperties[this].entities.has(type)){
      throw "Invalid type provided:" + type + " Check the Entity List to ensure you've added the entity you're trying to create.";
    }

    /**
     * constructor for class determined by 'type'
     */
    let constr = privateProperties[this].entities.get(type);
    let entity= new constr(params, this);

    // Attach the click and other event handling components.
    if(params.onClick ||
      params.onMouseOver ||
      params.onMouseUp ||
      params.onMouseDown ||
      params.onMouseMove){

      this.attachComponent(entity, "Mouse", params);
    }

    if(params.keys){
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
    let thisComConst;
    // component === "componentName"
    if(typeof(component) === "string"){
      if(privateProperties[this].components.has(component)){
        thisComConst = privateProperties[this].components.get(component);
        entity.attachComponent(component, new thisComConst(params, entity));
      }
    } else if (component instanceof privateProperties[this].components.get("BaseComponent")){
      entity.attachComponent(component.constructor.name, component);
    } else if (typeof(component) === "object") {
      for(let com of Object.keys(component)){
        if(typeof(component[com]) === "object"){
          /** component = {"componentName" : {"name to use" : data }} */
          let names = Object.keys(component[com]);
          for(let name of names){
            thisComConst = privateProperties[this].components.get(com);
            entity.attachComponent(name, new thisComConst(component[com][name], entity));
          }
        } else if(typeof(component[com] === "string")){
          /** component = {"componentName" : "name to use"} */
          thisComConst = privateProperties[this].components.get(com);
          entity.attachComponent(component[com], thisComConst(params, entity));
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