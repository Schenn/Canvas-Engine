(function(){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  EM.setMake("SPRITE", function(entity, params){
    // The Current Sprite
    var currentSpriteName = utilities.exists(params.defaultSprite)? params.defaultSprite : 0;
    // Attach a renderer component
    EM.attachComponent(entity,"Renderer", $.extend({}, {
      draw: function(ctx){
        ctx.drawImage($.extend({}, this, entity.getFromComponent("Image", "asObject")));
      }
    },params));

    // Attach an image component
    EM.attachComponent(entity, "Image", $.extend({}, {callback: function(){
      entity.messageToComponent("Renderer", "markDirty");
    }},params));

    // Attach a spritesheet component
    // The callback is fired when the spritesheet is loaded.
    EM.attachComponent(entity, "SpriteSheet", $.extend({}, {source: params.source, callback: function(){
      entity.setSprite(currentSpriteName);
    }}, params.spritesheet));

    entity.setSprite = function(name){
      currentSpriteName = name;
      entity.messageToComponent("Image", "setSprite",
        entity.getFromComponent("SpriteSheet", "getSprite", name)
      );
    };
  });

})();
