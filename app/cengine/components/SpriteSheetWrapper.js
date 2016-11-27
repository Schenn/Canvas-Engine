/**
 * @author Steven Chennault <schenn@gmail.com>
 */

import {Component} from "components/Component.js";

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
    privateProperties[this.id].sheet = params.spritesheet;
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
    return privateProperties[this.id].sheet.source();
  }
}
