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

const privateProperties = new WeakMap();
/**
 * Manages rendering and maintaining text information as an Entity.
 *  Re-renders if the text is changed.
 *
 * @class Label
 * @memberof CanvasEngine.Entities
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Label#components~Renderer
 * @borrows CanvasEngine.Components.Text as CanvasEngine.Entities.Label#components~Text
 */

export class Label extends Entity {

  get color() {
    return privateProperties[this.name].color;
  }

  set color(color){
    if(color){
      privateProperties[this.name].color = color;
      this.componentProperty("Renderer", "fillStyle", color);
    }
  }

  get text(){
    return this.componentProperty("Text", "text");
  }

  set text(message){
    this.componentProperty("Text", "text", message);
  }


  constructor(params, EntityManager){
    super(params, EntityManager);
    privateProperties[this.name] = {};
    privateProperties[this.name].color = (params.fillStyle) ? params.fillStyle : "#fff";

    let self = this;

    let myParams = Object.assign({}, {
      fillStyle: self.color,
      clearInfo: (ctx)=>{ return self.textArea(ctx); },
      draw: (ctx)=>{ return self.draw(ctx); }
    }, params);

    this.EntityManager.attachComponent(this, "Renderer", myParams);
    this.EntityManager.attachComponent(this, "Text", myParams);
  }

  // Called attached to this entity's Renderer context
  draw(ctx){

    let renderProps = this.getFromComponent("Renderer", "asObject");

    ctx.setDefaults(renderProps);

    let drawProperties = Object.assign({}, renderProps, this.getFromComponent("Text", "asObject"));
    ctx.drawText(drawProperties);

    let textArea = this.textArea(ctx);

    // break the phrase by it's newlines
    let lines =  drawProperties.text.split(/\r?\n/);

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

  }

  /**
   * Get the general Area of the current text output on a canvas context.
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
      default: // Do nothing for left aligned text
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
      default: // Do nothing for top aligned text
        break;
    }

    return ({
      x: _x, y: _y,
      height: height,
      width: width, fromCenter: false
    });
  }
}