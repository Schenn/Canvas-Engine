/**
 * @author Steven Chennault <schenn@gmail.com>
 */

import Component from "Component.js"
import * as utilities from "../engineParts/utilities.js"

/**
 * @typedef {object} GeneralTypes~Sprite
 * @property {number} x
 * @property {number} y
 * @property {number} height
 * @property {number} width
 */


/**
 * Constructs an Image Component
 *
 * @class ImageWrapper
 * @memberof CanvasEngine.Components
 * @classdesc The Image Component maintains a JS Image Object and the values which represent a selection on the image.
 * @property {Image} source
 * @property {number} sx
 * @property {number} sy
 * @property {number} sWidth
 * @property {number} sHeight
 * @property {boolean} cropFromCenter
 */
class ImageWrapper extends Component{
  /**
   * @param {Object} params
   * @param {Image} params.source
   * @param {boolean} [params.cropFromCenter]
   * @param {Callbacks~onPropertyChanged} params.callback
   * @param {number} [params.sx]
   * @param {number} [params.sy]
   * @param {number} [params.sWidth]
   * @param {number} [params.sHeight]
   *
   * @param {CanvasEngine.Entities.Entity} entity
   */
  constructor(params, entity){
    super(entity, params.callback);
    var source = params.source,
      sx= utilities.exists(params.sx) ? params.sx : 0,
      sy= utilities.exists(params.sy) ? params.sy : 0,
      sw= utilities.exists(params.sWidth) ? params.sWidth : 0,
      sh= utilities.exists(params.sHeight) ? params.sHeight : 0,
      cropFromCenter = utilities.exists(params.cropFromCenter) ? params.cropFromCenter : false;

    this.setProperty("source", source);
    this.setProperty("sx", sx);
    this.setProperty("sy", sy);
    this.setProperty("sWidth", sw);
    this.setProperty("sHeight", sh);
    this.setProperty("cropFromCenter", cropFromCenter);
  }

  /**
   * Get the component as an object
   * Returns the Image unless there's an active selection on the image.
   *
   * @returns {{source: Image} | { sx: number, sy:number, sWidth: number, sHeight: number, cropFromCenter: boolean, source: Image}}
   */
  asObject(){
    if(this.sWidth > 0 && this.sHeight > 0){
      return {source: this.source, sx: this.sx, sy: this.sy, sWidth: this.sWidth, sHeight: this.sHeight};
    } else {
      return {
        source: this.source
      };
    }

  }

  /**
   * Set the current sprite data onto the image.
   *
   * @param {GeneralTypes~Sprite} sprite
   */
  setSprite(sprite){
    this.sx = sprite.x;
    this.sy = sprite.y;
    this.sWidth = sprite.width;
    this.sHeight = sprite.height;
  }
}

export default ImageWrapper