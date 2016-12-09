/**
 * @author Steven Chennault <schenn@gmail.com>
 */

import {Component} from "../components/Component.js";
import * as utilities from "../engineParts/utilities.js";
import {properties} from "../engineParts/propertyDefinitions.js";

/**
 * @typedef {object} GeneralTypes~Sprite
 * @property {number} x
 * @property {number} y
 * @property {number} height
 * @property {number} width
 */


const privateProperties = new WeakMap();

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
export class ImageWrapper extends Component{
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

    privateProperties[this.name] = {};
    privateProperties[this.name].sx = 0;
    privateProperties[this.name].sy = 0;
    privateProperties[this.name].sw = 0;
    privateProperties[this.name].sh = 0;
    privateProperties[this.name].cropFromCenter = false;
    privateProperties[this.name].source = "";

    let setProps = (sprite)=>{
      if(utilities.exists(sprite.sx)){
        privateProperties[this.name].sx = sprite.sx;
      } else if (utilities.exists(sprite.x)){
        privateProperties[this.name].sx = sprite.x;
      }

      if(utilities.exists(sprite.sy)){
        privateProperties[this.name].sy = sprite.sy;
      } else if (utilities.exists(sprite.y)){
        privateProperties[this.name].sy = sprite.y;
      }

      if(utilities.exists(sprite.sWidth)){
        privateProperties[this.name].sw = sprite.sWidth;
      } else if(utilities.exists(sprite.width)){
        privateProperties[this.name].sw = sprite.width;
      }


      if(utilities.exists(sprite.sHeight)){
        privateProperties[this.name].sh = sprite.sHeight;
      } else if(utilities.exists(sprite.height)){
        privateProperties[this.name].sh = sprite.height;
      }

      if(utilities.exists(sprite.cropFromCenter)){
        privateProperties[this.name].cropFromCenter = sprite.cropFromCenter;
      }
    };

    if(utilities.exists(params.source)){
      privateProperties[this.name].source = params.source;

      setProps(params);
    } else {
      let keys = Object.keys(params);
      if(keys.length === 1 && utilities.exists(params[keys].source)){
        privateProperties[this.name].source = params[keys].source;
        setProps(params[keys]);
      }
    }

    if(privateProperties[this.name].source === "") {
      console.log(params);
      throw "Source missing from Image Component";
    }

    Object.defineProperties(this, {
      source: properties.defaultProperty(privateProperties[this.name].source, this.propertyCallback),
      sx: properties.defaultProperty(privateProperties[this.name].sx, this.propertyCallback),
      sy: properties.defaultProperty(privateProperties[this.name].sy, this.propertyCallback),
      sWidth: properties.defaultProperty(privateProperties[this.name].sw, this.propertyCallback),
      sHeight: properties.defaultProperty(privateProperties[this.name].sh, this.propertyCallback),
      cropFromCenter: properties.defaultProperty(privateProperties[this.name].cropFromCenter, this.propertyCallback)
    });
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