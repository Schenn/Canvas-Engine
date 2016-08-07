/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @callback Callbacks~onImageLoad
 */
/**
 * @callback Callbacks~onResourcesLoaded
 */

import * as utilities from "engineParts/utilities.js";

import {SpriteSheet} from "resources/SpriteSheet.js";

const privateProperties = new WeakMap();

/**
 * @class ResourceManager
 * @memberof CanvasEngine
 * @inner
 */
export class ResourceManager {
  constructor(){
    privateProperties[this] ={};
    privateProperties[this].sounds = new Map();
    privateProperties[this].images = new Map();
    privateProperties[this].spriteSheets = new Map();
    privateProperties[this].imagePath = "";

    privateProperties[this].onLoad = null;
    privateProperties[this].allAdded = false;
    privateProperties[this].resourcesLoaded = new Map();

    privateProperties[this].Resources = {
      SpriteSheet: SpriteSheet
    };
  }
  /**
   * Set the base image path
   * @param {string} path
   */
  set ImagePath(path){
    privateProperties[this].imagePath = path;
  }

  /**
   * @returns {string}
   */
  get ImagePath(){
    return privateProperties[this].imagePath;
  }

  /**
   * Are all resources finished loading
   * @returns {boolean}
   */
  get ResourcesAreLoaded() {
    if(privateProperties[this].allAdded) {
      privateProperties[this].resourcesLoaded.forEach((isLoaded)=>{
        if(!isLoaded) {
          return false;
        }
      });
      return true;
    }
    return true;
  }

  /**
   * Add a sound to the collection
   * @todo Sounds
   * @param {string} name
   * @param {*} sound
   * @param {*} load
   */
  addSound(name, sound, load) {

  }

  /**
   * Add an image to the collection of images
   *
   * @param {string} name The name to give the image
   * @param {string} path The filepath the image lives at
   * @param {Callbacks~onImageLoad} [load] A method to fire when the image is loaded.
   */
  addImage(name, path, load){
    var image = new Image();
    privateProperties[this].images[name] = image;
    privateProperties[this].resourcesLoaded.set(name, false);
    var triggerOnLoad = ()=>{
      if(this.ResourcesAreLoaded &&
        privateProperties[this].resourcesLoaded.get(name) === true){
        load.call(image);
        this.triggerCallback();
      }
    };

    image.addEventListener("load", function(){
      privateProperties[this].resourcesLoaded[name] = true;
      triggerOnLoad();
    });
    image.addEventListener("load", load);

    image.src = privateProperties[this].imagePath +"/"+path;

    if(image.complete){
      if (utilities.isFunction(load)){
        load(image);
      }
      triggerOnLoad();
    }
  }

/**
* Add a spritesheet to the canvas engine
*  A spritesheet contains information about how an image breaks down into a collection of sprites.
* @param {string} name The name of the SpriteSheet
* @param {string} path The path to the SpriteSheet image
* @param {LocalParams~SpriteSheetParams} details The spritesheets details
*/
  addSpriteSheet(name, path, details){
  console.log(privateProperties[this].Resources);
    privateProperties[this].spriteSheets[name] = new privateProperties[this].Resources.SpriteSheet(details);
    privateProperties[this].resourcesLoaded[name+"sheet"] = false;
    this.addImage(name, path, ()=>{
      privateProperties[this].spriteSheets[name].processSprites(privateProperties[this].images[name]);
      privateProperties[this].resourcesLoaded[name+"sheet"] = true;
      this.triggerCallback();
    });

  }

  /**
   * Get a SpriteSheet from storage
   * @param {string} name
   * @returns {CanvasEngine.Resources.SpriteSheet}
   */
  getSpriteSheet (name){
    return privateProperties[this].spriteSheets.get(name);
  }

  /**
   * Get an image from storage
   * @param {string} name
   * @returns {Image}
   */
  getImage(name){
    return privateProperties[this].images.get(name);
  }

  /**
   * Get a sound from storage
   * @param {string} name
   * @returns {*}
   */
  getSound(name){
    return privateProperties[this].sounds.get(name);
  }


  /**
   * Tell the ResourceManager that we aren't going to be adding any more resources
   *  by the time the current collection finishes loading.
   */
  finishedAddingResources(){
    privateProperties[this].allAdded = true;
    this.triggerCallback();
  }

  /**
   * Set the callback to trigger when all the resources are loaded.
   *
   * @param {Callbacks~onResourcesLoaded} callback
   */
  onResourcesLoaded (callback){
    privateProperties[this].onLoad = callback;
  }

  /**
   * Trigger the resources have loaded callback
   */
  triggerCallback(){
    if(this.ResourcesAreLoaded && utilities.isFunction(privateProperties[this].onLoad)){
      privateProperties[this].onLoad();
    }
  }

  /**
   * Load a collection of resources
   * This method assumes the resource collection IS the full set of resources
   *  (at least the full set of resources which are needed for the onResourcesLoaded callback)
   *
   * @param {Array.<Object.<string,{name:string, source:string, details: Object}>>} resourceCollection
   * @param {Callbacks~onResourcesLoaded} resourcesLoadedCallback
   */
  loadResourceCollection(resourceCollection, resourcesLoadedCallback){
    this.onResourcesLoaded(resourcesLoadedCallback);
    for(var i =0; i<resourceCollection.length; i++){
      var type = Object.keys(resourceCollection[i])[0];
      var data = resourceCollection[i][type];
      switch(type.toLowerCase()){
        case "spritesheet":
          this.addSpriteSheet(data.name,data.source,data.details);
          break;
        case "image":
          this.addImage(data.name,data.source,data.details);
          break;
        case "sound":
          this.addSound(data.name,data.source,data.details);
          break;
        default:
          break;
      }
    }
    this.finishedAddingResources();
  }
}