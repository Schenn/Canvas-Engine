
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

  /**
   * Static accessor to reduce the amount of imports used.
   */
  static get utilities(){
    return utilities;
  }

  /**
   * Your component should override, then call this method.
   *  This method sets the link between the component and the Entity and identifies
   *  the component instance. So it is required.
   *
   * @abstract
   * @override
   * @param entity The Entity derived thing to attach this component to.
   * @param propertyCallback defaults to an empty function so that the app doesn't waste time checking.
   */
  constructor(entity, propertyCallback=()=>{}){

    // Set an 'id' property but don't let others change it.
    // In addition, since the value is used to determine context,
    //  We can't just use a generic getter here.  It would need something
    // to get and a way to identify it as the instance's value over a class
    // weakmap reference.
    if(new.target === Component){
      throw "Cannot instantiate a Component. You have to override it.";
    }
    let id = `comp${utilities.randName()}`;
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
    this.onChange(this);
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

  /**
   * Set an additional property on this object which will trigger the
   *  property change callback triggers.
   *
   * @param name
   * @param value
   * @param locked
   */
  setProperty(name, value, locked = false){
    properties.observe({
      name:name,
      value:value,
      locked:locked,
      callback: privateProperties[this.id].propertyCallback
    }, this);
  }
}