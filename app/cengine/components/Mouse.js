/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @callback Callbacks~onMouse
 * @param {GeneralTypes~coords} coords Coordinates of the mouse interaction
 * @this {CanvasEngine.Entities.Entity}
 */

import Component from "Component.js";
import * as utilities from "../engineParts/utilities";

import privateProperties from "../engineParts/propertyDefinitions.js";

class Mouse extends Component {
  constructor(params, entity){
    super(entity);

    privateProperties[this].onClick = [];
    privateProperties[this].onMouseOver = [];
    privateProperties[this].onMouseDown = [];
    privateProperties[this].onMouseUp = [];
    privateProperties[this].onMouseMove = [];
    privateProperties[this].onMouseOut = [];

    let assign = function(name){
      if(utilities.isFunction(params[name])){
        privateProperties[this][name] = [];
        privateProperties[this][name].push(params[name]);
      } else if (Array.isArray(params[name])){
        privateProperties[this][name] = params[name];
      }
    };

    assign.bind(this);
    assign("onClick");
    assign("onMouseOver");
    assign("onMouseDown");
    assign("onMouseUp");
    assign("onMouseOut");

  }

  /**
   * When clicked...
   * @param {GeneralTypes~coords} args
   */
  Click(args){
    for(let callback of privateProperties[this].onClick){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseOver(args){
    for(let callback of privateProperties[this].onMouseOver){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is down on the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseDown(args){
    for(let callback of privateProperties[this].onMouseDown){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is released over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseUp(args){
    for(let callback of privateProperties[this].onMouseUp){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is moved over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseMove(args){
    for(let callback of privateProperties[this].onMouseMove){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is leaves the entity
   */
  onMouseOut(){
    for(let callback of privateProperties[this].onMouseOut){
      callback.call(this.Entity);
    }
  }

  /**
   * Add click methods to the click container
   * @param {Callbacks~onMouse[]} methods
   */
  addClickMethods(methods){
    privateProperties[this].onClick = privateProperties[this].onClick.concat(methods);
  }

  /**
   * Add Methods for the other mouse callbacks
   *
   * @param {Object} methodContainer
   * @param {Callbacks~onMouse | Callbacks~onMouse[]} [methodContainer.onClick]
   * @param {Callbacks~onMouse | Callbacks~onMouse[]} [methodContainer.onMouseOver]
   * @param {Callbacks~onMouse | Callbacks~onMouse[]} [methodContainer.onMouseDown]
   * @param {Callbacks~onMouse | Callbacks~onMouse[]} [methodContainer.onMouseUp]
   * @param {Callbacks~onMouse | Callbacks~onMouse[]} [methodContainer.onMouseOut]
   */
  addMouseMethods(methodContainer){
    let mouseMethods = Object.keys(methodContainer);
    for(let method in mouseMethods){
      if(utilities.isArray(this[method])) {
        privateProperties[this][method].push(methodContainer[method]);
      }
    }
  }
}

export default Mouse;