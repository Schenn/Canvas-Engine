/**
 * @author Steven Chennault <schenn@gmail.com>
 */
(function(CanvasEngine){

  /**
   * The SpriteSheet component handles interactions with a SpriteSheet resource.
   *
   * @param {{spritesheet: CanvasEngine.Resources.SpriteSheet }} params
   * @param {CanvasEngine.Entities.Entity} entity
   * @constructor
   * @memberOf CanvasEngine.Components
   */
  var SpriteSheet = function(params, entity){
    var sheet=params.spritesheet;

    /**
     * Get Sprite Info by name
     *
     * @param {string | number} name
     * @returns {GeneralTypes~Sprite}
     */
    this.getSprite = function(name){
      return sheet.getSprite(name);
    };

    /**
     * Get the sprite height
     * @returns {number}
     */
    this.sHeight = function(){
      return sheet.sHeight();
    };

    /**
     * Get the sprite width
     * @returns {number}
     */
    this.sWidth = function(){
      return sheet.sWidth();
    };

    /**
     * Get the sprite source image
     * @returns {Image}
     */
    this.source = function(){
      return sheet.source();
    };

    /**
     * Get the bound entity
     *
     * @returns {CanvasEngine.Entities.Entity}
     */
    this.getEntity = function(){
      return entity;
    };

  };

  /**
   * Add the SpriteSheet component to the component storage
   */
  CanvasEngine.EntityManager.addComponent("SpriteSheet",
    function(params, entity){
    return new SpriteSheet(params, entity);
  });
})(window.CanvasEngine);