/**
 * @todo Adjust y for baseline
 */
(function(){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Making a Label
  EM.setMake("LABEL", function(entity, params) {

    // Start by adding a text component
    EM.attachComponent(entity, "Text", $.extend({}, {
      callback: function(){
        entity.messageToComponent("Renderer", "markDirty");
      }
    },params));

    // Add a renderer component
    EM.attachComponent(entity, "Renderer", $.extend({}, {
      fillStyle: "#fff",
      clearInfo: function(ctx){
        var width,
          height,
          _x = Math.ceil(this.x),
          _y = Math.ceil(this.y);

        var text = entity.getFromComponent("Text","asObject");
        width = ctx.measureText({font: text.font, text:"M"+text.text+"O"});
        height = Math.ceil(ctx.measureText({font: text.font, text:"MWO"}).width / 2);

        // Adjust x for alignment
        switch(text.align){
          case "left":
            _x -= width.width / 2;
            break;
          case "right":
            _x += width.width / 2;
            break;
          default:
            break;
        }

        // Adjust y for baseline
        switch(text.baseline){
          case "middle":
            _y += height/4;
            break;
          case "bottom":
            _y += height/2;
            break;
          default:
            break;
        }

        return ({
          x: _x, y: _y,
          height: height,
          width: width, fromCenter: true
        });
      },
      draw: function(ctx){
        ctx.drawText($.extend({}, this, entity.getFromComponent("Text", "asObject")));
      }
    }, params));

    return entity;
  });
})();