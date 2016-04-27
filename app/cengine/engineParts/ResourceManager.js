(function(){
  var utils = CanvasEngine.utilities;

  var sounds = {}, images={}, spriteSheets = {}, imagePath = "";
  var resourcesLoaded = {};
  var onLoad;
  var allAdded = false;

  var resourceManager = function(){
    this.Resources = {};

    this.setImagePath = function(path){
      imagePath = path;
    };

    /**
     * @todo
     * @param name
     * @param sound
     */
    this.addSound = function(name, sound) {

    };

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

    this.addSpriteSheet = function(name, path, details){
      spriteSheets[name] = new this.Resources.SpriteSheet(details);
      resourcesLoaded[name+"sheet"] = false;
      this.addImage(name, path, function(imgLoadEvent){
        spriteSheets[name].processSprites(images[name]);
        resourcesLoaded[name+"sheet"] = true;
        CanvasEngine.ResourceManager.triggerCallback();
      });

    };

    this.getSpriteSheet = function(name){
      return spriteSheets[name];
    };

    this.getImage = function(name){
      return image[name];
    };

    this.getSound = function(name){
      return sounds[name];
    };

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

    this.finishedAddingResources = function(){
      allAdded = true;
    };

    this.onResourcesLoaded = function(callback){
      onLoad = callback;
    };

    this.triggerCallback = function(){
      if(this.resourcesAreLoaded() && CanvasEngine.utilities.isFunction(onLoad)){
        onLoad();
      }
    };
  };


  CanvasEngine.ResourceManager = new resourceManager();
})();