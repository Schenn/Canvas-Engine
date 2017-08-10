/**
 * Created by schenn on 6/23/16.
 */
import {properties} from "../engineParts/propertyDefinitions.js";
import * as utilities from "../engineParts/utilities.js";
const privateProperties = new WeakMap();


/**
 * @class Component
 * @memberof CanvasEngine.Components
 */
export class Component {

  get propertyCallback(){
    return privateProperties[this.id].propertyCallback;
  }

  get Entity(){
    return privateProperties[this.id].Entity;
  }

  get isInitializing(){
    return privateProperties[this.id].initializing;
  }

  static get utilities(){
    return utilities;
  }

  constructor(entity, propertyCallback=()=>{}){
    let id = 'comp' + utilities.randName();
    Object.defineProperties(this, {
      id: properties.lockedProperty(id)
    });

    privateProperties[this.id] = {
      Entity: entity,
      propertyCallback: propertyCallback,
      initializing: true
    };

  }

  onChange(value){
    if(!this.isInitializing){
      this.propertyCallback(value);
    }
  }

  initialize(){
    privateProperties[this.id].initializing = true;
  }

  initialized(){
    privateProperties[this.id].initializing = false;
  }

  /**
   * Return a basic object representation of this component's data.
   *
   * @abstract
   * @throws If not overridden
   */
  asObject(){
    throw "Class missing override!";
  }

  setProperty(name, value, locked = false){
    properties.observe({
      name:name,
      value:value,
      locked:locked,
      callback: privateProperties[this.id].propertyCallback
    }, this);
  }
}