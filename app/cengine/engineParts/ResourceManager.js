/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @callback Callbacks~onImageLoad
 */
/**
 * @callback Callbacks~onResourcesLoaded
 */
(function(CanvasEngine){
  var sounds = {}, images={}, spriteSheets = {}, imagePath = "";
  var resourcesLoaded = {};
  var onLoad;
  var allAdded = false;

  /**
   * @namespace CanvasEngine.Resources
   */
  var Resources = {};

  /**
   * The ResourceManager manages the different images, sounds, movies and spritesheets used by the Engine.
   * @class
   * @inner
   * @memberOf CanvasEngine
   * @static
   */
  var resourceManager = function(){

    /**
     * Set the base image path
     * @param {string} path
     */
    this.setImagePath = function(path){
      imagePath = path;
    };

    /**
     * Add a sound to the collection
     * @todo Sounds
     * @param {string} name
     * @param {*} sound
     */
    this.addSound = function(name, sound) {

    };

    /**
     * Add an image to the collection of images
     *
     * @param {string} name The name to give the image
     * @param {string} path The filepath the image lives at
     * @param {Callbacks~onImageLoad} [load] A method to fire when the image is loaded.
     */
    this.addImage = function(name, path, load){
      var image = new Image();
      images[name] = image;
      resourcesLoaded[name] = false;
      var self = this;
      var triggerOnLoad = function(){
        if(self.resourcesAreLoaded() &&
          resourcesLoaded[name] === true){
          load.call(image);
          self.triggerCallback();
        }
      };

      image.addEventListener("load", function(){
        resourcesLoaded[name] = true;
        triggerOnLoad();
      });
      image.addEventListener("load", load);

      image.src = imagePath +"/"+path;

      if(image.complete){
        if (CanvasEngine.utilities.isFunction(load)){
          load(image);
        }
        triggerOnLoad();
      }
    };

    /**
     * Add a spritesheet to the canvas engine
     *  A spritesheet contains information about how an image breaks down into a collection of sprites.
     * @param {string} name The name of the SpriteSheet
     * @param {string} path The path to the SpriteSheet image
     * @param {LocalParams~SpriteSheetParams} details The spritesheets details
     */
    this.addSpriteSheet = function(name, path, details){
      spriteSheets[name] = new Resources.SpriteSheet(details);
      resourcesLoaded[name+"sheet"] = false;
      this.addImage(name, path, function(imgLoadEvent){
        spriteSheets[name].processSprites(images[name]);
        resourcesLoaded[name+"sheet"] = true;
        CanvasEngine.ResourceManager.triggerCallback();
      });

    };

    /**
     * Get a SpriteSheet from storage
     * @param {string} name
     * @returns {CanvasEngine.Resources.SpriteSheet}
     */
    this.getSpriteSheet = function(name){
      return spriteSheets[name];
    };

    /**
     * Get an image from storage
     * @param {string} name
     * @returns {Image}
     */
    this.getImage = function(name){
      return image[name];
    };

    /**
     * Get a sound from storage
     * @param {string} name
     * @returns {*}
     */
    this.getSound = function(name){
      return sounds[name];
    };

    /**
     * Determine if all the resources have finished being loaded.
     * @returns {boolean}
     */
    this.resourcesAreLoaded = function(){
      if(allAdded) {
        var resourceKeys = Object.keys(resourcesLoaded);
        for (var i = 0; i < resourceKeys.length; i++) {
          if (resourcesLoaded[resourceKeys[i]] === false) {
            return false;
          }
        }
        return true;
      }
    };

    /**
     * Tell the ResourceManager that we aren't going to be adding any more resources
     *  by the time the current collection finishes loading.
     */
    this.finishedAddingResources = function(){
      allAdded = true;
    };

    /**
     * Set the callback to trigger when all the resources are loaded.
     *
     * @param {Callbacks~onResourcesLoaded} callback
     */
    this.onResourcesLoaded = function(callback){
      onLoad = callback;
    };

    /**
     * Trigger the resources have loaded callback
     */
    this.triggerCallback = function(){
      if(this.resourcesAreLoaded() && CanvasEngine.utilities.isFunction(onLoad)){
        onLoad();
      }
    };

    /**
     * Load a collection of resources
     * This method assumes the resource collection IS the full set of resources
     *  (at least the full set of resources which are needed for the onResourcesLoaded callback)
     *
     * @param {Array.<Object.<string,{name:string, source:string, details: Object}>>} resourceCollection
     * @param {Callbacks~onResourcesLoaded} resourcesLoadedCallback
     */
    this.loadResourceCollection = function(resourceCollection, resourcesLoadedCallback){
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
    };

    /**
     * Add a Resource Type to our collection
     *
     * @param {string} name
     * @param {function} constructor
     */
    this.setResourceType=function(name, constructor){
      Resources[name] = constructor;
    };
  };


  CanvasEngine.ResourceManager = new resourceManager();
})(window.CanvasEngine);