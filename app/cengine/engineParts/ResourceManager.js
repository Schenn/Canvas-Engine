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

    this.addSound = function(name, sound) {

    };

    this.addImage = function(name, path, load){
      var image = new Image();
      resourcesLoaded[name] = false;
      var self = this;
      image.addEventListener("load", function(){
        resourcesLoaded[name] = true;
        if(self.resourcesAreLoaded()){
          onLoad();
        }
      });
      images[name] = image;
      image.addEventListener("load", load);
      image.src = imagePath +"/"+path;
    };

    this.addSpriteSheet = function(name, path, details){
      spriteSheets[name] = new this.Resources.SpriteSheet(details);
      this.addImage(name, path, function(image){
        spriteSheets[name].processSprites(image);
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
  };


  CanvasEngine.ResourceManager = new resourceManager();
})();