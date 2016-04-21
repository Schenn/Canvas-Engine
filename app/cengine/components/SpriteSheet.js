/**
 * Created by schenn on 4/18/16.
 */
(function(){
  var props = CanvasEngine.EntityManager.properties;
  var utils = CanvasEngine.utilities;

  var SpriteSheet = function(params, entity){
    var spriteSlices={}, height=50, width=50;
    var source, spriteCache, spritesLoaded = false;

    var defaultSprite = 0;

    Object.defineProperties(this, {
      "spritesLoaded":props.defaultProperty(spritesLoaded, params.callback),
      "height":props.defaultProperty(height),
      "width":props.defaultProperty(width)
    });

    this.height = params.height;
    this.width = params.width;

    spriteCache = utils.exists(params.sprites) ? params.sprites : null;

    if(params.source instanceof HTMLImageElement){
      source = params.source;
      this.processSprites();
    } else {
      var self = this;
      source = new Image();
      source.onload = function(){self.processSprites();};
    }

    this.getEntity = function(){
      return entity;
    };

    // If no sprites are defined, run through the image y->x, the sprite name is the index.
    // If sprites are array of names, run through the image y->x using the names provided
    var processSprites = function(){
      var sx = 0, sy= 0, index=0;
      while(sy<source.height){
        while(sx < source.width){
          var name = utils.exists(spriteCache) ? spriteCache[index] : index;
          spriteSlices[name] = {
            sx: sx, sy: sy, width: width, height: height
          };
          sx += width;
          index++;
        }
        sy += height;
      }
    };

    // If sprites are an object, take their data and fill in the rest.
    var processSpriteObject = function(){
      $.each(spriteCache, function(name, sprite){
        spriteSlices[name] = $.extend({}, {width: width, height: height}, sprite);
      });
    };


    this.processSprites = function(){
      if(isObject(spriteCache)){
        processSpriteObject();
      }
      else{
        processSprites();
      }
      this.spritesLoaded = true;
    };

    this.getSprite = function(name){
      if(this.spritesLoaded) {
        return spriteSlices[name];
      } else {
        return "Sprite-sheet not finished loading";
      }
    };

    this.spriteCount = function(){
      return Object.keys(spriteSlices).length;
    };
  };

  CanvasEngine.EntityManager.addComponent("SpriteSheet", function(){
    return new SpriteSheet(params, entity);
  });
})();