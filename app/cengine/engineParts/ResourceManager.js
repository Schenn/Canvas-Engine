(function(){
  var utils = CanvasEngine.utilities;

  var sounds = {}, images={}, spriteSheets = {}, imagePath = "";
  var resourcesLoaded = {};
  var onLoad;
  var allAdded = false;

  /**
   * The ResourceManager manages the different images, sounds, movies and spritesheets used by the Engine.
   */
  var resourceManager = function(){
    this.Resources = {};

    /**
     * Set the base image path
     * @param path
     */
    this.setImagePath = function(path){
      imagePath = path;
    };

    /**
     * Add a sound to the collection
     * @todo
     * @param name
     * @param sound
     */
    this.addSound = function(name, sound) {

    };

    /**
     * Add an image to the collection of images
     *
     * @param name The name to give the image
     * @param path The filepath the image lives at
     * @param load A method to fire when the image is loaded.
     */
    this.addImage = function(name, path, load){
      var image = new Image();
      images[name] = image;
      resourcesLoaded[name] = false;
      var self = this;
      var triggerOnLoad = function(){
        if(self.resourcesAreLoaded() &&
          resourcesLoaded[name] === true){

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
     * @param name The name of the spritesheet
     * @param path The path to the spritesheet image
     * @param details The spritesheet's sprite details
     */
    this.addSpriteSheet = function(name, path, details){
      spriteSheets[name] = new this.Resources.SpriteSheet(details);
      resourcesLoaded[name+"sheet"] = false;
      this.addImage(name, path, function(imgLoadEvent){
        spriteSheets[name].processSprites(images[name]);
        resourcesLoaded[name+"sheet"] = true;
        CanvasEngine.ResourceManager.triggerCallback();
      });

    };

    /**
     * Get a spritesheet from storage
     * @param name
     * @returns {SpriteSheet}
     */
    this.getSpriteSheet = function(name){
      return spriteSheets[name];
    };

    /**
     * Get an image from storage
     * @param name
     * @returns {Image}
     */
    this.getImage = function(name){
      return image[name];
    };

    /**
     * Get a sound from storage
     * @param name
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
     * Tell the resourcemanager that we aren't going to
     *    be adding any more resources before the current collection finishes loading.
     */
    this.finishedAddingResources = function(){
      allAdded = true;
    };

    /**
     * Set the function to call when all the resources are loaded.
     *
     * @param callback
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
  };


  CanvasEngine.ResourceManager = new resourceManager();
})();