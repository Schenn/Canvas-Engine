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

import {Entity} from "./Entity.js";
import * as utilities from "../engineParts/utilities.js";

const privateProperties = new WeakMap();

let makeThing = function(EntityManager, params){

  let thing;
  if(utilities.exists(params.background)){
    if(utilities.exists(params.background.spritesheet)){
      thing = EntityManager.create("Sprite", Object.assign({}, {fromCenter: true}, params));
    } else if(utilities.exists(params.background.source)){
      thing = EntityManager.create("Image", Object.assign({}, {fromCenter: true}, params.source));
    }
  } else {
    thing = EntityManager.create("Rect", Object.assign({}, {fromCenter: true}, params));
  }

  return thing;
};

/**
 * Create an interactive element which has :
 *  a click method, a background image or shape and a label.
 *  The button should be able to update its image on mouse hover, so that
 *    the user knows that its a button and a button that can be used and a button
 *    that works.
 *
 * @class Button
 * @memberOf CanvasEngine.Entities
 * @borrows CanvasEngine.Components.Mouse as CanvasEngine.Entities.Button#components~HoverMouse
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Button#components~Renderer
 * @borrows CanvasEngine.Components.Text as CanvasEngine.Entities.Button#components~Text
 *
 */
export class Button extends Entity {

  /**
   * @inner
   * @type {CanvasEngine.Entities.Sprite | CanvasEngine.Entities.Image | CanvasEngine.Entities.Rect }
   */
  get Background(){
    return privateProperties[this.name].background;
  }

  /**
   * @inner
   * @type {CanvasEngine.Entities.Sprite | CanvasEngine.Entities.Image | CanvasEngine.Entities.Rect }
   */
  set Background(background){
    privateProperties[this.name].background = makeThing(this.EntityManager, background);
  }

  /**
   * @inner
   * @type {CanvasEngine.Entities.Sprite | CanvasEngine.Entities.Image | CanvasEngine.Entities.Rect }
   */
  get Hover(){
    return privateProperties[this.name].hover;
  }

  /**
   * @inner
   * @type {CanvasEngine.Entities.Sprite | CanvasEngine.Entities.Image | CanvasEngine.Entities.Rect }
   */
  set Hover(hover){
    privateProperties[this.name].hover = makeThing(this.EntityManager, hover);
  }

  get isHovering(){
    return privateProperties[this.name].isHovering;
  }

  set isHovering(hover){
    privateProperties[this.name].isHovering = hover;
  }

  get padding(){
    return privateProperties[this.name].padding;
  }

  // Hover
  onMouseOver() {
    this.isHovering = true;
    this.askComponent("Renderer", "markDirty");
  }

  // Stop Hovering
  onMouseOut(){
    this.isHovering = false;
    this.askComponent("Renderer", "markDirty");
  }

  onTextChange(){
    this.askComponent("Renderer", "markDirty");
  }

  /**
   * Use the background object's clearInfo.
   * @param {Canvas.enhancedContext} ctx
   * @memberof CanvasEngine.Entities.Button
   * @returns {Button~Background#components~Renderer.clearInfo}
   */
  clearInfo(ctx){
    let text = this.askComponent("Text","asObject");
    // Return the background's clearInfo
    return Object.assign({},
        this.Background.askComponent("Renderer", "clearInfo", ctx),  {
          width : ((ctx.measureText({font: text.font, text:text.text}).width)+4) + (this.padding * 2),
          height : ((ctx.measureText({font: text.font, text:"MWO"}).width/3)+4) + (this.padding * 2)
        });
  }

  /**
   * Draw the button. Starting with the background or hover state background, then the text.
   * @memberof CanvasEngine.Entities.Button
   * @param {Canvas.enhancedContext} ctx
   * @this {CanvasEngine.Components.Renderer}
   */
  draw(ctx){
    // Resize the background based on the height and width of the text, adjusted by the padding params.
    let text = this.Entity.askComponent("Text","asObject");
    let size = {
      width : (ctx.measureText({font: text.font, text:text.text}).width)+4,
      //noinspection JSSuspiciousNameCombination
      // The measureText method only returns a width of a text element. To get a height, we use the average of the largest characters.
      height : (ctx.measureText({font: text.font, text:"MWO"}).width/3)+4
    };

    size.width += (this.Entity.padding * 2);
    size.height += (this.Entity.padding * 2);

    let target = (this.Entity.isHovering && utilities.exists(this.Entity.Hover)) ?
      this.Entity.Hover :
      this.Entity.Background;

    target.askComponent("Renderer", "setPosition",
        {x: this.x, y: this.y}
    );

    target.askComponent("Renderer", "resize", size);
    target.askComponent("Renderer", "render", ctx);


    // Draw the text
    ctx.setDefaults(this.asObject());
    ctx.drawText(
        Object.assign({},
            this.asObject(),
            text)
    );
  }

  constructor(params, EntityManager){
    super(params, EntityManager);
    privateProperties[this.name] = {};

    if(utilities.exists(params.hover)){
      this.Hover = params.hover;
    }

    this.Background = params.background;

    let name = this.name;
    privateProperties[name].padding = params.padding;
    privateProperties[name].isHovering = false;

    EntityManager.attachComponent(this,  {
      "Mouse":{
        "HoverMouse": {
          onMouseOver: this.onMouseOver.bind(this),
          onMouseOut: this.onMouseOut.bind(this),
          onClick: (params.onClick.bind(this) || ((e)=>{}))
        }
      }
    });

    EntityManager.attachComponent(this, "Text",
      Object.assign({},
      {
        callback: this.onTextChange.bind(this)
      },
      params)
    );
    /**
     * @this Button#components~Renderer
     * @param ctx
     */

    EntityManager.attachComponent(this,
        "Renderer",
        Object.assign({}, {
      fromCenter: true,
      clearInfo: this.clearInfo.bind(this),
      draw: this.draw
    },{x: params.x, y: params.y, fillStyle: params.fillStyle}));
  }


}