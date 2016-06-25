/**
 * Created by schenn on 6/23/16.
 */
import properties from "../engineParts/propertyDefinitions.js"

var propCallback = Symbol("PropertyCallback");

class Component {
  constructor(entity, propertyCallback){
    Object.defineProperty(this, "Entity", properties.lockedProperty(entity));
    this[propCallback] = propertyCallback;
  }

  get propertyCallback(){
    return this[propCallback];
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
    properties.observe({name:name, value:value, locked:locked, callback: this[propCallback]}, this);
  }
}

export default Component