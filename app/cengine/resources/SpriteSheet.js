/**
 * @typedef {object} LocalParams~SpriteSheetParams
 * @property {number} height
 * @property {number} width
 * @property {Array|Object} sprites
 *
 */

import * as utilities from "engineParts/utilities.js";
import {properties} from "engineParts/propertyDefinitions.js";

const privateProperties = new WeakMap();

let processSprites = function(spriteCache, source, spriteWidth, spriteHeight){
  let sx = 0, sy= 0, index=0;
  let useCache = utilities.exists(spriteCache);

  let sprites = {};

  while(sy<source.height){
    while(sx < source.width){
      let name = useCache ? spriteCache[index] : index;
      sprites[name] = {
        x: sx, y: sy, width: spriteWidth, height: spriteHeight
      };
      sx += spriteWidth;
      index++;
    }
    sy += spriteHeight;
    sx = 0;
  }

  return sprites;
};

// If sprites are an object, take their data and fill in the rest.
let processSpriteObject = function(spriteCache, spriteWidth, spriteHeight) {
  let sprites = {};
  for(let name of Object.keys(spriteCache)){
    let sprite = spriteCache[name];
    sprites[name] = Object.assign({}, {width: spriteWidth, height: spriteHeight}, sprite);
  }

  return sprites;
};

/**
 * The SpriteSheet Resource manages creating and accessing specific sprites from its source image
 *
 * @class
 * @memberOf CanvasEngine.Resources
 * @param {object} details
 * @param {number} details.height
 * @param {number} details.width
 * @param {Array|Object} [details.sprites]
 */
export class SpriteSheet {

  /**
   * @returns {number}
   */
  get sHeight(){
    return privateProperties[this].spriteHeight;
  }

  /**
   * @param {number} height
   */
  set sHeight(height){
    privateProperties[this].spriteHeight = height;
  }

  /**
   * @returns {number}
   */
  get sWidth(){
    return privateProperties[this].spriteWidth;
  }

  /**
   * @param {number} width
   */
  set sWidth(width){
    privateProperties[this].spriteWidth = width;
  }

  /**
   * @returns {Image}
   */
  get Source(){
    return privateProperties[this].source.src;
  }

  /**
   * @param {Image} source
   */
  set Source(source){
    if(privateProperties[this].source === ""){
      if(source instanceof Image) {
        this.processSprites(source);
      } else {
        throw "Source needs to be a js Image object";
      }
    } else {
      throw "Source already set. Create new SpriteSheet instead."
    }
  }

  constructor(details){
    privateProperties[this]={};
    if(!utilities.exists(details.height) || !utilities.exists(details.width)) throw "Missing the width or height of the sprites";
    privateProperties[this].spriteHeight = details.height;
    privateProperties[this].spriteWidth = details.width;
    privateProperties[this].sprites = [];
    privateProperties[this].source = "";
    privateProperties[this].isBuilding = false;

    privateProperties[this].spriteCache = (utilities.exists(details.sprites)) ? details.sprites : null;

    if(utilities.exists(details.source)){
      this.Source = details.source;
    }
  }

  /**
   * Process the sprites against an image.
   * @param {Image} img
   */
  processSprites(img){
    privateProperties[this].source = img;
    privateProperties[this].isBuilding = true;
    // If we have a spriteCache and it's an object, not an array
    if(utilities.exists(privateProperties[this].spriteCache) &&
      Object.keys(privateProperties[this].spriteCache).length > 0 &&
      !utilities.isArray(privateProperties[this].spriteCache)){

      privateProperties[this].sprites = processSpriteObject(privateProperties[this].spriteCache,  privateProperties[this].spriteHeight,privateProperties[this].spriteWidth);
    }
    else{
      privateProperties[this].sprites = processSprites( privateProperties[this].spriteCache, privateProperties[this].source, privateProperties[this].spriteHeight,privateProperties[this].spriteWidth);
    }
  }

  /**
   * Get a sprite detail object by its name
   * @param {string} name
   * @returns {{sx: number, sy: number, sWidth: number, sHeight: number}}
   * @todo Wait for spritesheet to finish building
   */
  getSprite(name){
    if(!utilities.exists(privateProperties[this].sprites[name])) throw "Sprite: " +name + " Not Found on SpriteSheet: "+ this.Source;
    return privateProperties[this].sprites[name];
  }
}