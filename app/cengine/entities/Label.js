/**
 * @todo Adjust y for baseline
 */
/**
 * @typedef {object} EntityParams~Label
 * @property {string} [fillStyle="#fff"]
 * @see {ComponentParams~Renderer}
 * @see {ComponentParams~Text}
 */
(function(CanvasEngine){
  var EM = CanvasEngine.EntityManager;

  // Tell the EntityManager how to make a LABEL entity
  EM.setMake("LABEL",
    /**
     *
     * @param {CanvasEngine.Entities.Entity} entity
     * @param {EntityParams~Label} params
     * @returns {CanvasEngine.Entities.Label}
     */
    function(entity, params) {

      /**
       * @class
       * @alias Label
       * @memberof CanvasEngine.Entities
       * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Label#components~Renderer
       * @borrows CanvasEngine.Components.Text as CanvasEngine.Entities.Label#components~Text
       */
      var label = $.extend({}, entity);

    // Add a renderer component
    EM.attachComponent(label, "Renderer", $.extend({}, {
      fillStyle: "#fff",
      // Clearing a label requires a bit of fancy footwork as labels have two additional offset options (alignment, baseline)
      clearInfo: function(ctx){
        var width,
          height,
          _x = this.x-1,
          _y = this.y-1;

        var text = label.getFromComponent("Text","asObject");
        // 2 pixels on the left and right are added to account for letters that extend out a pixel or so.
        width = (ctx.measureText({font: text.font, text:text.text}).width)+4;
        //noinspection JSSuspiciousNameCombination
        // The measureText method only returns a width of a text element. To get a height, we use the average of the largest characters.
        height = (ctx.measureText({font: text.font, text:"MWO"}).width/3)+4;

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
        ctx.drawText($.extend({}, this, label.getFromComponent("Text", "asObject")));
      }
    }, params));

    // Start by adding a text component
    EM.attachComponent(label, "Text", $.extend({}, {
      callback: function(){
        label.messageToComponent("Renderer", "markDirty");
      }
    },params));


    return label;
  });
})(window.CanvasEngine);