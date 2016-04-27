(function(){

  var utils = CanvasEngine.utilities;

  CanvasEngine.ResourceManager.Resources.SpriteSheet = function(details){
    var spriteHeight = details.height;
    var spriteWidth = details.width;
    var sprites = [];
    var spriteCache;
    var source;

    if(typeof(details.sprites) !== "undefined"){
      spriteCache = details.sprites;
    }
    // If no sprites are defined, run through the image y->x, the sprite name is the index.
    // If sprites are array of names, run through the image y->x using the names provided
    var processSprites = function(){
      var sx = 0, sy= 0, index=0;
      var useCache = utils.exists(spriteCache);

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

    };

    // If sprites are an object, take their data and fill in the rest.
    var processSpriteObject = function() {
      $.each(spriteCache, function (name, sprite) {
        sprites[name] = $.extend({}, {width: spriteWidth, height: spriteHeight}, sprite);
      });
    };

    this.processSprites = function(img){
      source = img;
      // If we have a spriteCache and it's an object, not an array
      if(utils.exists(spriteCache) &&
        Object.keys(spriteCache).length > 0 &&
        !utils.exists(spriteCache[0])){

        processSpriteObject();
      }
      else{
        processSprites();
      }
      this.spritesLoaded = true;
    };

    this.getSprite = function(name){
      return sprites[name];
    };

    this.sHeight = function(){
      return spriteHeight;
    };

    this.sWidth = function(){
      return spriteWidth;
    };

    this.source = function(){
      return source;
    };
  };
})();