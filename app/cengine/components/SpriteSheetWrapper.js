/**
 * @author Steven Chennault <schenn@gmail.com>
 */

import Component from "Component.js"

let Sheet = Symbol("Sheet");

/**
 * The SpriteSheet component handles interactions with a SpriteSheet resource.
 * @memberOf CanvasEngine.Components
 */
class SpriteSheetWrapper extends Component{
  /**
   * @param {{spritesheet: CanvasEngine.Resources.SpriteSheet }} params
   * @param {CanvasEngine.Entities.Entity} entity
   */
  constructor(params, entity){
    super(entity);
    this[sheet] = params.spritesheet;
  }

  /**
   * Get Sprite Info by name
   *
   * @param {string | number} name
   * @returns {GeneralTypes~Sprite}
   */
  getSprite(name){
    return this[sheet].getSprite(name);
  }

  /**
   * Get the sprite height
   * @returns {number}
   */
  sHeight(){
    return this[sheet].sHeight();
  }

  /**
   * Get the sprite width
   * @returns {number}
   */
  sWidth(){
    return this[sheet].sWidth();
  }

  /**
   * Get the sprite source image
   * @returns {Image}
   */
  source(){
    return this[sheet].source();
  }
}

export default SpriteSheetWrapper