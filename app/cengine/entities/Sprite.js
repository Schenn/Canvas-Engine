(function(){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  /**
   * Tell the EntityManager how to make a SPRITE
   */
  EM.setMake("SPRITE", function(entity, params){
    // The Current Sprite
    var currentSpriteName, currentSheet="default";

    // Attach a renderer component
    EM.attachComponent(entity,"Renderer", $.extend({}, {
      draw: function(ctx){
        ctx.drawImage($.extend({}, this, entity.getFromComponent(currentSheet+"Image", "asObject")));
      }
    },params));

    // Add an image and SpriteSheet for each SpriteSheet.
    $.each(Object.keys(params.spritesheets), function(index, sheetName){
      var image = {};
      image[sheetName+"Image"] = {
        source: params.spritesheets[sheetName].source(),
        height: params.height,
        width: params.width,
        callback: function(){
          entity.messageToComponent("Renderer", "markDirty");
        }
      };
      var sheet = {};
      sheet[sheetName+"Sheet"]={spritesheet: params.spritesheets[sheetName]};
      EM.attachComponent(entity, $.extend({},
        {
          Image:image,
          SpriteSheet:sheet
        }
      ));
    });

    // Add a method for setting a sprite by name to the entity.
    entity.setSprite = function(name){
      currentSpriteName = name;
      // Set the current sprite image to nextFrame
      entity.messageToComponent(currentSheet+"Image",
        "setSprite",
        entity.getFromComponent(currentSheet+"Sheet", "getSprite", name)
      );
    };

    // Add a method to change spritesheets onto an entity.
    entity.setCurrentSheet = function(sheetName){
      currentSheet = sheetName;
    };

    // Set the initial sprite.
    entity.setSprite(utilities.exists(params.defaultSprite)? params.defaultSprite : 0);

    return entity;
  });

})();
