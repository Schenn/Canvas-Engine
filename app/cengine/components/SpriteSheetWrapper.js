/**
 * @author Steven Chennault <schenn@gmail.com>
 */

import {Component} from "./Component.js";
import * as utilities from "../engineParts/utilities.js";

const privateProperties = new WeakMap();

/**
 * The SpriteSheet component handles interactions with a SpriteSheet resource.
 * @memberOf CanvasEngine.Components
 */
export class SpriteSheetWrapper extends Component{
  /**
   * @param {{spritesheet: CanvasEngine.Resources.SpriteSheet }} params
   * @param {CanvasEngine.Entities.Entity} entity
   */
  constructor(params, entity){
    super(entity);
    privateProperties[this.id] = {};
    if(utilities.exists(params.Sprites) && utilities.exists(params.Source)){
      privateProperties[this.id].sheet = params;
    } else {
      if(utilities.exists(params.spritesheet)){
        if(utilities.exists(params.spritesheet.Sprites) && utilities.exists(params.spritesheet.Source)){
          privateProperties[this.id].sheet = params.spritesheet;
        } else {
          let name = Object.keys(params.spritesheet)[0];
          privateProperties[this.id].sheet = params.spritesheet[name];
        }
      }  else {
        let keys = Object.keys(params);
        if(keys.length === 1){
          let name = keys[0];
          let content = params[name];
          if(utilities.exists(content.Sprites) && utilities.exists(content.Source)){
            privateProperties[this.id].sheet = content;
          } else if(utilities.exists(content.spritesheet)){
            privateProperties[this.id].sheet = content.spritesheet;
          }
        }
      }
    }
  }

  /**
   * Get Sprite Info by name
   *
   * @param {string | number} name
   * @returns {GeneralTypes~Sprite}
   */
  getSprite(name){
    return privateProperties[this.id].sheet.getSprite(name);
  }

  /**
   * Get the sprite height
   * @returns {number}
   */
  sHeight(){
    return privateProperties[this.id].sheet.sHeight();
  }

  /**
   * Get the sprite width
   * @returns {number}
   */
  sWidth(){
    return privateProperties[this.id].sheet.sWidth();
  }

  /**
   * Get the sprite source image
   * @returns {Image}
   */
  source(){
    return privateProperties[this.id].sheet.Source;
  }
}
