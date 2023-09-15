/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @callback Callbacks~onImageLoad
 */
/**
 * @callback Callbacks~onResourcesLoaded
 */

import * as utilities from "./utilities.js";

import {SpriteSheet} from "../resources/SpriteSheet.js";

import {properties} from "./propertyDefinitions.js";

const privateProperties = new WeakMap();

/**
 * Manages the information for loading resources such as
 *  images, spritesheets, sounds, video files, etc.
 *
 *  @todo Sounds, Videos, etc
 *
 * @class ResourceManager
 * @memberof CanvasEngine
 * @inner
 */
export class ResourceManager {
  constructor(){
    let id = "ResourceManager:" + utilities.randName(2);

    Object.defineProperties(this, {
      id:properties.lockedProperty(id)
    });

    privateProperties[this.id] ={};
    privateProperties[this.id].sounds = new Map();
    privateProperties[this.id].images = new Map();
    privateProperties[this.id].spriteSheets = new Map();
    privateProperties[this.id].imagePath = "";

    privateProperties[this.id].onLoad = null;
    privateProperties[this.id].allAdded = false;
    privateProperties[this.id].resourcesLoaded = new Map();

    privateProperties[this.id].Resources = {
      SpriteSheet: SpriteSheet
    };
  }
  /**
   * Set the base image path which the app will load from
   *
   * @param {string} path
   */
  set ImagePath(path){
    privateProperties[this.id].imagePath = path;
  }

  /**
   * The current path the app loads images from
   *
   * @returns {string}
   */
  get ImagePath(){
    return privateProperties[this.id].imagePath;
  }

  /**
   * Are all resources finished loading
   *
   * @returns {boolean}
   */
  get ResourcesAreLoaded() {
    if(privateProperties[this.id].allAdded) {
      let ret = true;
      privateProperties[this.id].resourcesLoaded.forEach((isLoaded)=>{
        if(!isLoaded) {
          ret = false;
        }
      });
      return ret;
    }
    return false;
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
    let image = new Image();
    privateProperties[this.id].images.set(name, image);
    privateProperties[this.id].resourcesLoaded.set(name, false);
    let triggerOnLoad = ()=>{
      if(this.ResourcesAreLoaded &&
        privateProperties[this.id].resourcesLoaded.get(name) === true){

        this.triggerCallback();
      }
    };

    image.addEventListener("load", ()=>{
      privateProperties[this.id].resourcesLoaded.set(name, true);
      if(typeof load === "function"){
        load(image);
      }
      triggerOnLoad();
    });

    image.src = this.ImagePath + "/" + path;

    if(image.complete){
      privateProperties[this.id].resourcesLoaded.set(name, true);
      if(typeof load === "function"){
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
    privateProperties[this.id].resourcesLoaded.set(name+"sheet", false);
    this.addImage(name, path, ()=>{
      details.source = privateProperties[this.id].images.get(name);
      privateProperties[this.id].spriteSheets.set(name,
          new privateProperties[this.id].Resources.SpriteSheet(details));

      privateProperties[this.id].resourcesLoaded.set(name+"sheet", true);
    });

  }

  /**
   * Get a SpriteSheet from storage
   * @param {string} name
   * @returns {CanvasEngine.Resources.SpriteSheet}
   */
  getSpriteSheet (name){
    return privateProperties[this.id].spriteSheets.get(name);
  }

  /**
   * Get an image from storage
   * @param {string} name
   * @returns {Image}
   */
  getImage(name){
    if(privateProperties[this.id].resourcesLoaded.get(name) === false){
      let self = this;
      return new Promise((resolve, reject)=> {
        let int = setInterval(()=> {
          if (privateProperties[self.id].resourcesLoaded.get(name) === true) {
            clearInterval(int);
            resolve(privateProperties[self.id].images.get(name));
          }
        }, 100);
      });
    } else if(privateProperties[this.id].resourcesLoaded.get(name) === true){
      return privateProperties[this.id].images.get(name);
    } else if(!utilities.exists(privateProperties[this.id].images.get(name))){
      throw "Image not added to this resource manager!";
    }

  }

  /**
   * Get a sound from storage
   * @param {string} name
   * @returns {*}
   */
  getSound(name){
    return privateProperties[this.id].sounds.get(name);
  }


  /**
   * Tell the ResourceManager that we aren't going to be adding any more resources
   *  by the time the current collection finishes loading.
   */
  finishedAddingResources(){
    privateProperties[this.id].allAdded = true;
    this.triggerCallback();
  }

  /**
   * Set the callback to trigger when all the resources are loaded.
   *
   * @param {Callbacks~onResourcesLoaded} callback
   */
  onResourcesLoaded (callback){
    privateProperties[this.id].onLoad = callback;
  }

  /**
   * Trigger the resources have loaded callback
   */
  triggerCallback(){
    if(this.ResourcesAreLoaded && utilities.isFunction(privateProperties[this.id].onLoad)){
      privateProperties[this.id].onLoad();
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
    for(let i = 0; i<resourceCollection.length; i++){
      let type = Object.keys(resourceCollection[i])[0];
      let data = resourceCollection[i][type];
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