(function(){
  var utils = CanvasEngine.utilities;

  var sounds = {}, images={}, spriteSheets = {}, imagePath = "";
  var resourcesLoaded = {};


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

      image.addEventListener("load", function(){
        resourcesLoaded[name] = true;
        images[name] = image;
      });
      image.addEventListener("load", load);
      image.src = imagePath +"/"+path;
    };

    this.addSpriteSheet = function(name, path, details){
      this.addImage(name, path, function(image){

        spriteSheets[name] = new this.Resources.SpriteSheet(details, image);
      });

    };

    this.getSpriteSheet = function(name){

    };

    this.getImage = function(name){

    };

    this.getSound = function(name){

    };
  };



  CanvasEngine.ResourceManager = new resourceManager();
})();