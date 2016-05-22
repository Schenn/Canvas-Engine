(function () {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Tell the EntityManager how to create a "Button"
  EM.setMake("Button", function (entity, params) {

    var background;
    if(utilities.exists(params.spritesheet)){
      background = EM.create("SPRITE", $.extend({}, {fromCenter: true}, params.background));
    } else if(utilities.exists(params.source)){
      background = EM.create("IMAGE", $.extend({}, {fromCenter: true}, params.source));
    } else {
      background = EM.create("RECT", $.extend({}, {fromCenter: true}, params.background));
    }

    EM.attachComponent(entity, "Text", $.extend({},
      {
        callback: function(){
          entity.messageToComponent("Renderer", "markDirty");
        }
      },
      params)
    );

    EM.attachComponent(entity, "Renderer", $.extend({
      clearInfo: function(ctx){
        // Return the background's clearInfo
        return background.getFromComponent("Renderer", "clearInfo", ctx);
      },
      draw: function(ctx){
        // Resize the background based on the height and width of the text, adjusted by the padding params.
        var text = entity.getFromComponent("Text","asObject");
        var size = {
          width : (ctx.measureText({font: text.font, text:text.text}).width)+4,
          //noinspection JSSuspiciousNameCombination
          // The measureText method only returns a width of a text element. To get a height, we use the average of the largest characters.
          height : (ctx.measureText({font: text.font, text:"MWO"}).width/3)+4
        };

        size.width += (params.padding * 2);
        size.height += (params.padding * 2);

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

        this.resize(size);

        // Draw the background
        background.messageToComponent("Renderer", "render", ctx);
        // Draw the text
        ctx.setDefaults(this);
        ctx.drawText($.extend({}, this, entity.getFromComponent("Text", "asObject")));
      }
    },{x: params.x, y: params.y, fillStyle: params.fillStyle}));

    return entity;
  });
})();