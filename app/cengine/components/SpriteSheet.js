/**
 * Created by schenn on 4/18/16.
 */
(function(){
  var props = CanvasEngine.EntityManager.properties;
  var utils = CanvasEngine.utilities;

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

  CanvasEngine.EntityManager.addComponent("SpriteSheet", function(params, entity){
    return new SpriteSheet(params, entity);
  });
})();