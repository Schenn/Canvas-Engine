/**
 * @typedef {object} LocalParams~SpriteSheetParams
 * @property {number} height
 * @property {number} width
 * @property {Array|Object} sprites
 *
 */
(function(CanvasEngine){

  var utils = CanvasEngine.utilities;

  /**
   * The SpriteSheet Resource manages creating and accessing specific sprites from its source image
   *
   * @class
   * @memberOf CanvasEngine.Resources
   * @param {object} details
   * @param {number} details.height
   * @param {number} details.width
   * @param {Array|Object} [details.sprites]
   */
  var SpriteSheet = function(details){
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

    /**
     * Process the sprites against an image.
     * @param {Image} img
     */
    this.processSprites = function(img){
      source = img;
      // If we have a spriteCache and it's an object, not an array
      if(utils.exists(spriteCache) &&
        Object.keys(spriteCache).length > 0 &&
        !utils.isArray(spriteCache)){

        processSpriteObject();
      }
      else{
        processSprites();
      }
    };

    /**
     * Get a sprite detail object by its name
     * @param {string} name
     * @returns {{sx: number, sy: number, sWidth: number, sHeight: number}}
     */
    this.getSprite = function(name){
      return sprites[name];
    };

    /**
     * Get the sprite height
     * @returns {number}
     */
    this.sHeight = function(){
      return spriteHeight;
    };

    /**
     * Get the sprite width
     * @returns {number}
     */
    this.sWidth = function(){
      return spriteWidth;
    };

    /**
     * Get the source image
     * @returns {Image}
     */
    this.source = function(){
      return source;
    };
  };

  /**
   * Tell the CanvasEngine how to create a SpriteSheet resource.
   * @constructs CanvasEngine.Resources.SpriteSheet
   */
  CanvasEngine.ResourceManager.setResourceType("SpriteSheet",
    function(details){
    return new SpriteSheet(details);
  });
})(window.CanvasEngine);