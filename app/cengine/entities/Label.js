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
          _x = this.x-1,
          _y = this.y-1;

        var text = entity.getFromComponent("Text","asObject");
        width = (ctx.measureText({font: text.font, text:text.text}).width)+2;
        //noinspection JSSuspiciousNameCombination
        height = (ctx.measureText({font: text.font, text:"MWO"}).width/3)+2;

        // Adjust x for alignment
        switch(text.align){
          case "right":
            _x += width;
            break;
          case "center":
            _x -= width/2;
            break;
          default:
            break;
        }

        // Adjust y for baseline
        switch(text.baseline){
          case "middle":
            _y -= height/2;
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
          width: width, fromCenter: false
        });
      },
      draw: function(ctx){
        ctx.drawText($.extend({}, this, entity.getFromComponent("Text", "asObject")));
      }
    }, params));

    return entity;
  });
})();