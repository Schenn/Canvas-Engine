/**
 * Created by schenn on 6/23/16.
 */
import {properties} from "engineParts/propertyDefinitions.js";
import * as utilities from "engineParts/utilities.js";
const privateProperties = new WeakMap();


/**
 * @class Component
 * @memberof CanvasEngine.Components
 */
export class Component {
  constructor(entity, propertyCallback){
    let id = 'comp' + utilities.randName();
    Object.defineProperties(this, {
      id: properties.lockedProperty(id)
    });

    privateProperties[this.id] = {};
    privateProperties[this.id].Entity = entity;
    privateProperties[this.id].propertyCallback = propertyCallback;
  }

  get propertyCallback(){
    return privateProperties[this.id].propertyCallback;
  }

  get Entity(){
    return privateProperties[this.id].Entity;
  }

  /**
   * Return a basic object representation of this component's data.
   *
   * @abstract
   */
  asObject(){
    throw "Not Implemented Yet!";
  }

  setProperty(name, value, locked = false){
    properties.observe({name:name, value:value, locked:locked, callback: privateProperties[this.id].propertyCallback}, this);
  }
}