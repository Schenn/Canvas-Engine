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
   * Set the base image path
   * @param {string} path
   */
  set ImagePath(path){
    privateProperties[this.id].imagePath = path;
  }

  /**
   * @returns {string}
   */
  get ImagePath(){
    return privateProperties[this.id].imagePath;
  }

  /**
   * Are all resources finished loading
   * @returns {boolean}
   */
  get ResourcesAreLoaded() {
    if(privateProperties[this.id].allAdded) {
      privateProperties[this.id].resourcesLoaded.forEach((isLoaded)=>{
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
    privateProperties[this.id].images[name] = image;
    privateProperties[this.id].resourcesLoaded.set(name, false);
    var triggerOnLoad = ()=>{
      if(this.ResourcesAreLoaded &&
        privateProperties[this.id].resourcesLoaded.get(name) === true){
        load.call(image);
        this.triggerCallback();
      }
    };

    image.addEventListener("load", ()=>{
      privateProperties[this.id].resourcesLoaded[name] = true;
      triggerOnLoad();
    });
    image.addEventListener("load", load);

    image.src = privateProperties[this.id].imagePath +"/"+path;

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
    privateProperties[this.id].spriteSheets[name] = new privateProperties[this.id].Resources.SpriteSheet(details);
    privateProperties[this.id].resourcesLoaded[name+"sheet"] = false;
    this.addImage(name, path, ()=>{
      privateProperties[this.id].spriteSheets[name].processSprites(privateProperties[this.id].images[name]);
      privateProperties[this.id].resourcesLoaded[name+"sheet"] = true;
      this.triggerCallback();
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
    } else if(!utilities.exists(privateProperties[this].images.get(name))){
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
    console.log(privateProperties[this.id].spriteSheets);
    console.log(privateProperties[this.id].images);
    console.log("Finished Adding Resources");
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