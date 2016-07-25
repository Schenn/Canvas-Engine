/**
 * @typedef {object} LocalParams~SpriteSheetParams
 * @property {number} height
 * @property {number} width
 * @property {Array|Object} sprites
 *
 */

import * as utilities from "engineParts/utilities.js";
const privateProperties = new WeakMap();

let processSprites = function(spriteCache, source, spriteWidth, spriteHeight){
  var sx = 0, sy= 0, index=0;
  var useCache = utilities.exists(spriteCache);

  let sprites = {};

  while(sy<source.height){
    while(sx < source.width){
      var name = useCache ? spriteCache[index] : index;
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
  for(let {[name]: sprite} in spriteCache){
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
class SpriteSheet {

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
    return privateProperties[this].source;
  }

  /**
   * @param {Image} source
   */
  set Source(source){
    if(privateProperties[this].source === "") {
      privateProperties[this].source = source;
    }
  }

  constructor(details){
    privateProperties[this]={};
    privateProperties[this].spriteHeight = details.height;
    privateProperties[this].spriteWidth = details.width;
    privateProperties[this].sprites = [];
    privateProperties[this].source = "";

    if(typeof(details.sprites !== "undefined")){
      privateProperties[this].spriteCache = details.sprites;
    }
  }

  /**
   * Process the sprites against an image.
   * @param {Image} img
   */
  processSprites(img){
    privateProperties[this].source = img;
    // If we have a spriteCache and it's an object, not an array
    if(utilities.exists(privateProperties[this].spriteCache) &&
      Object.keys(privateProperties[this].spriteCache).length > 0 &&
      !utilities.isArray(privateProperties[this].spriteCache)){

      processSpriteObject();
    }
    else{
      processSprites();
    }
  }

  /**
   * Get a sprite detail object by its name
   * @param {string} name
   * @returns {{sx: number, sy: number, sWidth: number, sHeight: number}}
   */
  getSprite(name){
    return privateProperties[this].sprites[name];
  }
}

export default SpriteSheet;