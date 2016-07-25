/**
 * Created by schenn on 6/23/16.
 */
import {properties} from "engineParts/propertyDefinitions.js";

const privateProperties = new WeakMap();


/**
 * @class Component
 * @memberof CanvasEngine.Components
 */
export class Component {
  constructor(entity, propertyCallback){
    privateProperties[this] = {};
    privateProperties[this].Entity = entity;
    privateProperties[this].propertyCallback = propertyCallback;
  }

  get propertyCallback(){
    return privateProperties[this].propertyCallback;
  }

  get Entity(){
    return privateProperties[this].Entity;
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
    properties.observe({name:name, value:value, locked:locked, callback: privateProperties[this].propertyCallback}, this);
  }
}