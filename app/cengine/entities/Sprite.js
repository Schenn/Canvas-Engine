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
    EM.attachComponent(entity, "Image", $.extend({}, {source: params.spritesheet.source(), callback: function(){
      entity.messageToComponent("Renderer", "markDirty");
    }}));

    // Attach a spritesheet component
    // The callback is fired when the spritesheet is loaded.
    EM.attachComponent(entity, "SpriteSheet", $.extend({}, {spritesheet: params.spritesheet}));

    entity.setSprite = function(name){
      currentSpriteName = name;
      entity.messageToComponent("Image", "setSprite",
        entity.getFromComponent("SpriteSheet", "getSprite", name)
      );
    };

    entity.setSprite(currentSpriteName);
  });

})();
