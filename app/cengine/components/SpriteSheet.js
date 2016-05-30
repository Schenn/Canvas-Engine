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

    this.getSprite = function(name){
      return sheet.getSprite(name);
    };

    this.sHeight = function(){
      return sheet.sHeight();
    };

    this.sWidth = function(){
      return sheet.sWidth();
    };

    this.source = function(){
      return sheet.source();
    };

    this.getEntity = function(){
      return entity;
    };

  };

  /**
   * Add the SpriteSheet component to the component storage
   */
  CanvasEngine.EntityManager.addComponent("SpriteSheet", function(params, entity){
    return new SpriteSheet(params, entity);
  });
})(window.CanvasEngine);