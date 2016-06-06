/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} EntityParams~ButtonParams
 * @property {EntityParams~Rect | EntityParams~Sprite | EntityParams~Image } background
 * @property {EntityParams~Rect | EntityParams~Sprite | EntityParams~Image } [hover]
 * @property {number} padding
 * @property {number} x
 * @property {number} y
 * @property {string} fillStyle
 * @see {ComponentParams~Text}
 */
(function (CanvasEngine) {

  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Tell the EntityManager how to create a "Button"
  EM.setMake("Button",
    /**
     * @param {CanvasEngine.Entities.Entity} entity
     * @param {EntityParams~ButtonParams} params
     * @returns {CanvasEngine.Entities.Button}
     */
    function (entity, params) {

      /**
       * @inner
       * @type {CanvasEngine.Entities.Sprite | CanvasEngine.Entities.Image | CanvasEngine.Entities.Rect }
       */
      var background;
      /**
       * @inner
       * @type {CanvasEngine.Entities.Sprite | CanvasEngine.Entities.Image | CanvasEngine.Entities.Rect }
       */
      var hover;

      var isHovering;

      if(utilities.exists(params.background.spritesheet)){
        background = EM.create("SPRITE", $.extend({}, {fromCenter: true}, params.background));
      } else if(utilities.exists(params.background.source)){
        background = EM.create("IMAGE", $.extend({}, {fromCenter: true}, params.background.source));
      } else {
        background = EM.create("RECT", $.extend({}, {fromCenter: true}, params.background));
      }

      if(utilities.exists(params.hover)) {
        if (utilities.exists(params.hover.spritesheet)) {
          hover = EM.create("SPRITE", $.extend({}, {fromCenter: true}, params.hover));
        } else if (utilities.exists(params.hover.source)) {
          hover = EM.create("IMAGE", $.extend({}, {fromCenter: true}, params.hover.source));
        } else {
          hover = EM.create("RECT", $.extend({}, {fromCenter: true}, params.hover));
        }
      }

      /**
       * @class
       * @augments CanvasEngine.Entities.Entity
       * @memberOf CanvasEngine.Entities
       * @borrows CanvasEngine.Components.Mouse as CanvasEngine.Entities.Button#components~HoverMouse
       * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Button#components~Renderer
       * @borrows CanvasEngine.Components.Text as CanvasEngine.Entities.Button#components~Text
       */
      var Button = $.extend(true, {}, {
        /**
         * Get the background object
         * @memberof Button
         * @returns {CanvasEngine.Entities.Sprite | CanvasEngine.Entities.Image | CanvasEngine.Entities.Rect }
         */
        getBackground: function(){
          return background;
        },
        /**
         * Set the background object
         * @memberof Button
         * @param {CanvasEngine.Entities.Sprite | CanvasEngine.Entities.Image | CanvasEngine.Entities.Rect } newBg
         */
        setBackground: function(newBg){
          background = newBg;
        }
      }, entity);

      EM.attachComponent(Button, {
          "Mouse":{
            "HoverMouse": {
              onMouseOver: function () {
                isHovering = true;
                Button.messageToComponent("Renderer", "markDirty");
              }, onMouseOut: function () {
                isHovering = false;
                Button.messageToComponent("Renderer", "markDirty");
              }
            }
          }
        }
      );

      EM.attachComponent(Button, "Text", $.extend({},
        {
          callback: function(){
            Button.messageToComponent("Renderer", "markDirty");
          }
        },
        params)
      );

      EM.attachComponent(Button, "Renderer", $.extend({}, { fromCenter: true,
        /**
         * Use the background object's clearInfo.
         * @param {Canvas.enhancedContext} ctx
         * @memberof CanvasEngine.Entities.Button
         * @returns {CanvasEngine.Entities.Button~background#components~Renderer.clearInfo}
         */
        clearInfo: function(ctx){
          // Return the background's clearInfo
          return background.getFromComponent("Renderer", "clearInfo", ctx);
        },
        /**
         * Draw the button. Starting with the background or hover state background, then the text.
         * @memberof CanvasEngine.Entities.Button
         * @param {Canvas.enhancedContext} ctx
         */
        draw: function(ctx){
          // Resize the background based on the height and width of the text, adjusted by the padding params.
          var text = Button.getFromComponent("Text","asObject");
          var size = {
            width : (ctx.measureText({font: text.font, text:text.text}).width)+4,
            //noinspection JSSuspiciousNameCombination
            // The measureText method only returns a width of a text element. To get a height, we use the average of the largest characters.
            height : (ctx.measureText({font: text.font, text:"MWO"}).width/3)+4
          };

          size.width += (params.padding * 2);
          size.height += (params.padding * 2);

          var target;

          if(isHovering && utilities.exists(hover)){
            target = hover;

          } else {
            target = background;
          }
          target.messageToComponent(
            "Renderer", "setPosition", {x: this.x}
          );

          target.messageToComponent(
            "Renderer", "setPosition", {y: this.y}
          );

          target.messageToComponent(
            "Renderer",
            "resize",
            size
          );

          // Draw the background
          target.messageToComponent("Renderer", "render", ctx);


          this.resize(size);

          // Draw the text
          ctx.setDefaults(this.asObject());
          ctx.drawText($.extend({}, this, Button.getFromComponent("Text", "asObject")));
        }
      },{x: params.x, y: params.y, fillStyle: params.fillStyle}));


      return Button;
  });
})(window.CanvasEngine);