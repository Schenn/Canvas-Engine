/**
 * @todo Adjust y for baseline
 */
/**
 * @typedef {object} EntityParams~Label
 * @property {string} [fillStyle="#fff"]
 * @see {ComponentParams~Renderer}
 * @see {ComponentParams~Text}
 */

import {Entity} from "../entities/Entity.js";
/**
 * @class Label
 * @memberof CanvasEngine.Entities
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Label#components~Renderer
 * @borrows CanvasEngine.Components.Text as CanvasEngine.Entities.Label#components~Text
 */
export class Label extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);
    this.cache = null;
    let self = this;

    function wrapText(ctx, drawProperties, text, width){
      var words = text.split(' ');
      var line = '';

      for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';


      }
    }

    let myParams = {
      fillStyle: "#fff",
      clearInfo: function(ctx) {
        return self.textArea(ctx);
      },
      draw: function(ctx){
        ctx.setDefaults(this);

        let drawProperties = Object.assign({}, this, this.Entity.getFromComponent("Text", "asObject"));
        ctx.drawText(drawProperties);

        let text = drawProperties.text;
        let textArea = this.Entity.textArea(ctx);

        // break the phrase by it's newlines
        let lines = text.split(/\r?\n/);

        // If the phrase has newlines
        if(lines.length > 1){
          lines.forEach((line, _)=>{
            drawProperties.text = line;
            ctx.drawText(drawProperties);
            drawProperties.y += textArea.height;
          });
        } else if(lines.length === 1){
          ctx.drawText(drawProperties);
        }



        // for each line, if 'wider' than the width, break at 1st space from the end of the line



      }
    };

    Object.assign(myParams, params);
    this.EntityManager.attachComponent(this, "Renderer", myParams);
    this.EntityManager.attachComponent(this, "Text", myParams);
  }

  /**
   * Get the Area of the text on a canvas context.
   *
   * @param {Canvas.enhancedContext} ctx
   * @returns {{x: number, y: number, height: (number|*), width: (number|*), fromCenter: boolean}}
   */
  textArea(ctx){
    let width,
      height,
      _x = this.componentProperty("Renderer", "x") - 1,
      _y = this.componentProperty("Renderer", "y") - 1;

    let text = this.getFromComponent("Text", "asObject");

    let phrase = text.text;



    // 2 pixels on the left and right are added to account for letters that extend out a pixel or so.
    width = (ctx.measureText({font: text.font, text: text.text}).width) + 4;
    // noinspection JSSuspiciousNameCombination
    // The measureText method only returns a width of a text element. To get a height, we use the average of the largest characters.
    height = (ctx.measureText({font: text.font, text: "MWO"}).width / 3) + 4;



    // Adjust x for alignment
    switch (text.align) {
      case "right":
        _x += width;
        break;
      case "center":
        _x -= width / 2;
        break;
      default:
        break;
    }

    // Adjust y for baseline
    switch (text.baseline) {
      case "middle":
        _y -= height / 2;
        break;
      case "bottom":
        _y += height / 2;
        break;
      default:
        break;
    }

    return ({
      x: _x, y: _y,
      height: height,
      width: width, fromCenter: false
    });
  }
}