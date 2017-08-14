/**
 * @author Steven Chennault <schenn@gmail.com>
 */

import {Component} from "./Component.js";

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

  set section(section){

    this.initialize();
    if(Component.utilities.exists(section.sx)) {
      this.sx = section.sx;
    } else if(Component.utilities.exists(section.x)){
      this.sx = section.x;
    }

    if(Component.utilities.exists(section.sy)){
      this.sy = section.sy;
    } else if (Component.utilities.exists(section.y)){
      this.sy = section.y;
    }

    if(Component.utilities.exists(section.sWidth)){
      this.sWidth = section.sWidth;
    } else if(Component.utilities.exists(section.width)){
      this.sWidth = section.width;
    }

    if(Component.utilities.exists(section.sHeight)){
      this.sHeight = section.sHeight;
    } else if(Component.utilities.exists(section.height)){
      this.sHeight = section.height;
    }

    if(Component.utilities.exists(section.cropFromCenter)){
      this.cropFromCenter = section.cropFromCenter;
    }

    this.initialized();
  }

  get source(){
    return privateProperties[this.id].source;
  }

  set source(source){
    privateProperties[this.id].source = source instanceof Image ?
        source.src :
        source;

    this.onChange(source);
  }

  get sx(){
    return privateProperties[this.id].sx;
  }

  set sx(sx){
    if(sx < 0){
      throw "Got a negative sx for this Image Component.";
    }
    privateProperties[this.id].sx = sx;
    this.onChange(sx);
  }

  get sy(){
    return privateProperties[this.id].sy;
  }

  set sy(sy){
    if(sy < 0){
      throw "Got an negative sy for an image component: " + sy;
    }
    privateProperties[this.id].sy = sy;
    this.onChange(sy);
  }

  get sWidth(){
    return privateProperties[this.id].sw;
  }

  set sWidth(sWidth){
    if(sWidth < 0){
      throw "Got a negative width for this Image Component.";
    }
    privateProperties[this.id].sw = sWidth;
    this.onChange(sWidth);
  }

  get sHeight(){
    return privateProperties[this.id].sh;
  }

  set sHeight(sHeight){
    if(sHeight < 0){
      throw "Got a negative height for this Image Component.";
    }
    privateProperties[this.id].sh = sHeight;
    this.onChange(sHeight);
  }

  get cropFromCenter(){
    return privateProperties[this.id].cropFromCenter;
  }

  set cropFromCenter(crop){
    privateProperties[this.id].cropFromCenter = crop;
    this.onChange(crop);
  }

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

    privateProperties[this.id] = {
      sx: 0,
      sy: 0,
      sw: 0,
      sh: 0,
      cropFromCenter: false,
      source: "",
    };

    if(Component.utilities.exists(params.source)){
      this.source = params.source;
      if(params.sprite){
        this.section = params.sprite;
      }
    } else {
      if(Component.utilities.exists(params.image)){
        this.source = params.image;
      } else {
        let keys = Object.keys(params);
        if(keys.length === 1 && Component.utilities.exists(params[keys].source)){
          this.source = params[keys].source;
          if(params[keys].sprite){
            this.section = params[keys].sprite;
          }
        }
      }
    }

    if(this.source === "") {
      console.log(privateProperties[this.id]);
      throw "Source missing from Image Component";
    }

    this.initialized();
  }

  /**
   * Get the component as an object
   * Returns the Image unless there's an active selection on the image.
   *
   * @returns {{source: Image} | { sx: number, sy:number, sWidth: number, sHeight: number, cropFromCenter: boolean, source: Image}}
   */
  asObject(){
    if(this.sWidth > 0 && this.sHeight > 0){
      return {
        source: this.source,
        sx: this.sx,
        sy: this.sy,
        sWidth: this.sWidth,
        sHeight: this.sHeight
      };
    }

    return {
      source: this.source
    };

  }

  /**
   * Set the current sprite data onto the image.
   *
   * @param {GeneralTypes~Sprite} sprite
   */
  setSprite(sprite){
    this.section = sprite;
  }
}