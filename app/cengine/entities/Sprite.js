/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~SpriteParams
 * @property {object} spritesheets
 * @property {number} height
 * @property {number} width
 * @property {string | number} [defaultSprite]
 */
(function(CanvasEngine){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  EM.setMake("SPRITE",
    /**
     * @param {CanvasEngine.Entities.Image} entity
     * @param {LocalParams~SpriteParams} params
     * @returns {CanvasEngine.Entities.Sprite}
     */
    function(entity, params){
      var currentSpriteName, currentSheet="default";

      /**
       * @class
       * @memberOf CanvasEngine.Entities
       * @augments CanvasEngine.Entities.Image
       * @alias Sprite
       */
      var sprite = $.extend(true,{}, {
        /**
         * Set the current sprite
         * @param {string | number} name
         */
        setSprite: function(name){
          currentSpriteName = name;
          // Set the current sprite image to nextFrame
          this.messageToComponent(currentSheet+"Image",
            "setSprite",
            sprite.getFromComponent(currentSheet+"Sheet", "getSprite", name)
          );
        },
        /**
         * Set the current spritesheet
         * @param {string} sheetName
         */
        setCurrentSheet: function(sheetName){
          currentSheet = sheetName;
        }
      }, entity);

      // Attach a renderer component
      EM.attachComponent(sprite,"Renderer", $.extend({}, {
        draw: function(ctx){
          ctx.drawImage($.extend({}, this, sprite.getFromComponent(currentSheet+"Image", "asObject")));
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
        EM.attachComponent(sprite, $.extend({},
          {
            Image:image,
            SpriteSheet:sheet
          }
        ));
      });

      // Set the initial sprite.
      sprite.setSprite(utilities.exists(params.defaultSprite)? params.defaultSprite : 0);

      return sprite;
  });

})(window.CanvasEngine);
