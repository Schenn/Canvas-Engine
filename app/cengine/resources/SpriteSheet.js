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

let processSprites = function(spriteCache, source, spriteWidth, spriteHeight, onFinished){
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
  onFinished();
  return sprites;
};

// If sprites are an object, take their data and fill in the rest.
let processSpriteObject = function(spriteCache, spriteWidth, spriteHeight, onFinished) {
  var sprites = {};
  for(var name of Object.keys(spriteCache)){
    console.log(name);
    console.log(spriteCache[name]);
    sprites[name] = Object.assign({}, {width: spriteWidth, height: spriteHeight}, spriteCache[name]);
  }
  onFinished();
  return sprites;
};

/**
 * The SpriteSheet Resource manages creating and accessing specific sprites from its source image
 *
 * Wait until your image is finished loading to set the SpriteSheet source so that the SpriteSheet can properly generate its sprites.
 *  If you use the ResourceManager, than it is handled for you.
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
   * Sprite Height
   *
   * @returns {number}
   */
  get sHeight(){
    return privateProperties[this.id].spriteHeight;
  }

  /**
   * Sprite Height
   * @param {number} height
   */
  set sHeight(height){
    privateProperties[this.id].spriteHeight = height;
  }

  /**
   * Sprite Width
   *
   * @returns {number}
   */
  get sWidth(){
    return privateProperties[this.id].spriteWidth;
  }

  /**
   * Sprite Width
   *
   * @param {number} width
   */
  set sWidth(width){
    privateProperties[this.id].spriteWidth = width;
  }

  /**
   * SpriteSheet Source Image
   *
   * @returns {Image}
   */
  get Source(){
    return privateProperties[this.id].source.src;
  }

  get Sprites(){
    return privateProperties[this.id].sprites;
  }

  /**
   * SpriteSheet Source Image
   *
   * @param {Image} source
   */
  set Source(source){
    if(privateProperties[this.id].source === ""){
      if(source instanceof Image) {
        this.processSprites(source);
      } else {
        throw "Source needs to be a js Image object";
      }
    } else {
      throw "Source already set. Create new SpriteSheet instead.";
    }
  }

  constructor(details){
    let id;
    if(details.source instanceof Image){
      id = details.source.src;
    } else if (details.source instanceof String){
      id = details.source;
    } else {
      id = utilities.randName();
    }
    Object.defineProperties(this, {
      id:properties.lockedProperty(id)
    });

    privateProperties[this.id]={};
    if(!utilities.exists(details.height) || !utilities.exists(details.width)) throw "Missing the width or height of the sprites";
    privateProperties[this.id].spriteHeight = details.height;
    privateProperties[this.id].spriteWidth = details.width;
    privateProperties[this.id].sprites = [];
    privateProperties[this.id].source = "";
    privateProperties[this.id].isProcessing = false;
    privateProperties[this.id].onSpritesLoaded = (utilities.exists(details.onSpritesLoaded)) ? details.onSpritesLoaded : null;

    privateProperties[this.id].spriteCache = (utilities.exists(details.sprites)) ? details.sprites : null;

    if(utilities.exists(details.source)){
      this.Source = details.source;
    }
  }

  /**
   * Process the sprites against an image.
   *
   * @param {Image} img
   */
  processSprites(img)
  {
    privateProperties[this.id].isProcessing = true;
    privateProperties[this.id].source = img;
    let work = ()=>{
      // If we have a spriteCache and it's an object, not an array
      if(utilities.exists(privateProperties[this.id].spriteCache) &&
        Object.keys(privateProperties[this.id].spriteCache).length > 0 &&
        !utilities.isArray(privateProperties[this.id].spriteCache)){

        privateProperties[this.id].sprites = processSpriteObject(privateProperties[this.id].spriteCache,  privateProperties[this.id].spriteHeight,privateProperties[this.id].spriteWidth, ()=>{
          privateProperties[this.id].isProcessing = false;
        });
      }
      else{
        privateProperties[this.id].sprites = processSprites( privateProperties[this.id].spriteCache, privateProperties[this.id].source, privateProperties[this.id].spriteHeight,privateProperties[this.id].spriteWidth, ()=>{
          privateProperties[this.id].isProcessing = false;
        });
      }

    };
    if(img.complete){
      work();

    } else {
      img.addEventListener("load", work);
    }
  }

  /**
   * Get a sprite detail object by its name
   *
   * @param {string} name
   * @returns {{sx: number, sy: number, sWidth: number, sHeight: number}}
   * @todo Wait for spritesheet to finish building
   */
  getSprite(name){
    let self = this;
    if(privateProperties[this.id].isProcessing === true){
      if(utilities.exists(privateProperties[this.id].spriteCache) &&
        !utilities.exists(privateProperties[this.id].spriteCache[name])
      ){
        throw "Sprite: " +name + " Not Found in SpriteSheet Data: "+ self.Source;
      }

      return new Promise((resolve, reject)=>{
        let int= setInterval(()=>{
          if(privateProperties[self.id].isProcessing === false){
            clearInterval(int);
            if(!utilities.exists(privateProperties[this.id].sprites[name])){
              reject(new Error("Sprite: " +name + " Not Found on SpriteSheet: "+ this.Source));
            }

            resolve(privateProperties[self.id].sprites[name]);
          }
        }, 100);

      });
    }
    if(!utilities.exists(privateProperties[this.id].sprites[name])){
      throw "Sprite: " +name + " Not Found on SpriteSheet: "+ this.Source;
    }

    return privateProperties[this.id].sprites[name];
  }
}