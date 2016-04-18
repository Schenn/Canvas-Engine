/**
 * @todo Adjust y for baseline
 */
(function(){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Making a Label
  EM.setMake("LABEL", function(entity, params) {

    // Start by adding a text component
    EM.attachComponent(entity, "Text", $.extend({}, params, {
      callback: function(){
        entity.messageToComponent("Renderer", "markDirty");
      }
    }));

    // Add a renderer component
    EM.attachComponent(entity, "Renderer", {
      fillStyle: "#fff",
      clearInfo: function(ctx){
        var s1 = ctx.measureText(this.text);
        var s2 = ctx.measureText("MWO")/3;
        var _x = this.x;

        // Adjust x for alignment
        if (this.align === "left") {
          _x += s1.width / 2;
        }
        else if (this.align === "right") {
          _x -= s1.width / 2;
        }

        // Adjust y for baseline



        return ({
          x: Math.ceil(_x), y: Math.ceil(this.y),
          height: Math.ceil(s2.width * 1.25),
          width: Math.ceil(s1.width * 1.25), fromCenter: true
        });
      },
      draw: function(ctx){
        ctx.drawText($.extend({}, this, entity.getFromComponent("Text", "asObject")));
      }
    });


  });
})();