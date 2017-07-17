/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @namespace keyboard
 */
/**
 * @event keyboard#keypress
 * @type {object}
 * @property {number} keyCode
 * @property {number} which
 */

/**
 * @callback Callbacks~onKeyPress
 * @this CanvasEngine.Entities.Entity
 */

import {Component} from "./Component.js";
import * as utilities from "../engineParts/utilities.js";

const privateProperties = new WeakMap();
/**
 * KeyPress listens for key presses and triggers a function call when they occur
 * @class KeyPress
 * @memberof CanvasEngine.Components
 * @param {Object.<string, Callbacks~onKeyPress>} params Key Callbacks
 * @param {CanvasEngine.Entities.Entity} entity
 *
 */
export class KeyPress extends Component{
  constructor(params, entity){
    super(entity);
    privateProperties[this.id] = {
      keyCallbacks: {}
    };

    this.onKeys(params);
    let self=this;

    /**
     * @fires keyboard#keypress
     */
    $(document).on("keypress",
      /**
       * @listens keyboard#keypress
       */
      (event)=>{
        if(utilities.exists(event.key)){
          self.onKeyDown(event.key);
        } else {
          let keyCode = event.keyCode || event.which;
          self.onKeyDown(String.fromCharCode(keyCode));
        }
      }
    );
  }

  onKeyDown(key){
    if(utilities.isFunction(privateProperties[this.id].keyCallbacks[key])){
      privateProperties[this.id].keyCallbacks[key].call(this.Entity);
    }
  }

  /**
   * Add a callback to a key
   *
   * @param {string} key
   * @param {Callbacks~onKeyPress} callback
   */
  onKey(key, callback){
    privateProperties[this.id].keyCallbacks[key] = callback;
  }

  /**
   * Add a collection of key->callbacks
   *
   * @param {Object.<string, Callbacks~onKeyPress>} keys
   */
  onKeys(keys){
    for(let key of Object.keys(keys)){
      this.onKey(key,keys[key]);
    }
  }

}