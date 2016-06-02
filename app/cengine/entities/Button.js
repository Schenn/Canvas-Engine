/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~ButtonParams
 * @property {object} background
 * @property {object} [hover]
 * @property {number} padding
 * @property {string} fillStyle
 * @property {number} x
 * @property {number} y
 */
(function (CanvasEngine) {

  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Tell the EntityManager how to create a "Button"
  EM.setMake("Button",
    /**
     * @param {CanvasEngine.Entities.Entity} entity
     * @param {LocalParams~ButtonParams} params
     * @returns {CanvasEngine.Entities.Button}
     */
    function (entity, params) {

      var background;
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
       */
      var Button = $.extend(true, {}, {
        getBackground: function(){
          return background;
        },
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
        clearInfo: function(ctx){
          // Return the background's clearInfo
          return background.getFromComponent("Renderer", "ClearInfo", ctx);
        },
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

          if(isHovering && utilities.exists(hover)){
            hover.messageToComponent(
              "Renderer", "setPosition", {x: this.x}
            );

            hover.messageToComponent(
              "Renderer", "setPosition", {y: this.y}
            );

            hover.messageToComponent(
              "Renderer",
              "resize",
              size
            );

            // Draw the background
            hover.messageToComponent("Renderer", "render", ctx);
          } else {
            background.messageToComponent(
              "Renderer", "setPosition", {x: this.x}
            );

            background.messageToComponent(
              "Renderer", "setPosition", {y: this.y}
            );

            background.messageToComponent(
              "Renderer",
              "resize",
              size
            );

            // Draw the background
            background.messageToComponent("Renderer", "render", ctx);
          }


          this.resize(size);

          // Draw the text
          ctx.setDefaults(this);
          ctx.drawText($.extend({}, this, Button.getFromComponent("Text", "asObject")));
        }
      },{x: params.x, y: params.y, fillStyle: params.fillStyle}));


      return Button;
  });
})(window.CanvasEngine);