/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @callback Callbacks~onMouse
 * @param {GeneralTypes~coords} coords Coordinates of the mouse interaction
 * @this {CanvasEngine.Entities.Entity}
 */

import {Component} from "./Component.js";

const privateProperties = new WeakMap();

export class Mouse extends Component {
  constructor(params, entity){
    super(entity);
    privateProperties[this.id] = {};
    privateProperties[this.id].onClick = [];
    privateProperties[this.id].onMouseOver = [];
    privateProperties[this.id].onMouseDown = [];
    privateProperties[this.id].onMouseUp = [];
    privateProperties[this.id].onMouseMove = [];
    privateProperties[this.id].onMouseOut = [];
    let assign = (name)=>{
      if(Component.utilities.isFunction(params[name])){
        privateProperties[this.id][name] = [];
        privateProperties[this.id][name].push(params[name]);
      } else if (Array.isArray(params[name])){
        privateProperties[this.id][name] = params[name];
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
    for(let callback of privateProperties[this.id].onClick){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseOver(args){
    for(let callback of privateProperties[this.id].onMouseOver){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is down on the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseDown(args){
    for(let callback of privateProperties[this.id].onMouseDown){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is released over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseUp(args){
    for(let callback of privateProperties[this.id].onMouseUp){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is moved over the entity
   * @param {GeneralTypes~coords} args
   */
  onMouseMove(args){
    for(let callback of privateProperties[this.id].onMouseMove){
      callback.call(this.Entity, args);
    }
  }

  /**
   * When the mouse is leaves the entity
   */
  onMouseOut(){
    for(let callback of privateProperties[this.id].onMouseOut){
      callback.call(this.Entity);
    }
  }

  /**
   * Add click methods to the click container
   * @param {Callbacks~onMouse[]} methods
   */
  addClickMethods(methods){
    privateProperties[this.id].onClick = privateProperties[this.id].onClick.concat(methods);
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
    mouseMethods.forEach((method)=>{
      if(Component.utilities.isArray(privateProperties[this.id][method])) {
        privateProperties[this.id][method].push(methodContainer[method]);
      }
    });
  }
}