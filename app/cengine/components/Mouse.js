/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @callback Callbacks~onMouse
 * @param {GeneralTypes~coords} coords Coordinates of the mouse interaction
 * @this {CanvasEngine.Entities.Entity}
 */

import Component from "Component.js"
import * as utilities from "../engineParts/utilities"

let onClick = Symbol("onClick");
let onMouseOver = Symbol("onMouseOver");
let onMouseDown = Symbol("onMouseDown");
let onMouseUp = Symbol("onMouseUp");
let onMouseMove = Symbol("onMouseMove");
let onMouseOut = Symbol("onMouseOut");


class Mouse extends Component {
  constructor(params, entity){
    super(entity);

    this[onClick] = [];
    this[onMouseOver] = [];
    this[onMouseDown] = [];
    this[onMouseUp] = [];
    this[onMouseMove] = [];
    this[onMouseOut] = [];

    if(utilities.isFunction(params.onClick)){
      this[onClick].push(params.onClick);
    } else if(Array.isArray(params.onClick)){
      this[onClick] = this[onClick].concat(params.onClick);
    }

    if(utilities.isFunction(params.onMouseOver)){
      this[onMouseOver].push(params.onMouseOver);
    } else if(Array.isArray(params.onMouseOver)){
      this[onMouseOver] = this[onMouseOver].concat(params.onMouseOver);
    }

    if(utilities.isFunction(params.onMouseDown)){
      this[onMouseDown].push(params.onMouseDown);
    } else if(Array.isArray(params.onMouseDown)){
      this[onMouseDown] = this[onMouseDown].concat(params.onMouseDown);
    }

    if(utilities.isFunction(params.onMouseUp)){
      this[onMouseUp].push(params.onMouseUp);
    } else if(Array.isArray(params.onMouseUp)){
      this[onMouseUp] = this[onMouseUp].concat(params.onMouseUp);
    }

    if(utilities.isFunction(params.onMouseOut)){
      this[onMouseOut].push(params.onMouseOut);
    } else if(Array.isArray(params.onMouseOut)){
      this[onMouseOut] = this[onMouseOut].concat(params.onMouseOut);
    }
  }

  /**
   * When clicked...
   * @param {GeneralTypes~coords} args
   */
  Click(args){
    for(let callback of this[onClick]){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseOver(args){
    for(let callback of this[onMouseOver]){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is down on the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseDown(args){
    for(let callback of this[onMouseDown]){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is released over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseUp(args){
    for(let callback of this[onMouseUp]){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is moved over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseMove(args){
    for(let callback of this[onMouseMove]){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is leaves the entity
   */
  onMouseOut(){
    for(let callback of this[onMouseOut]){
      callback.call(this.Entity);
    }
  }

  /**
   * Add click methods to the click container
   * @param {Callbacks~onMouse[]} methods
   */
  addClickMethods(methods){
    this[onClick] = this[onClick].concat(methods);
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
      if(this.hasOwnProperty(method) && utilities.isArray(this[method])) {
        this[method].push(methodContainer[method]);
      }
    }
  };
}

export default Mouse;