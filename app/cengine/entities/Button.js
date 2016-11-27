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

import {Entity} from "entities/Entity.js";
import * as utilities from "../engineParts/utilities.js";

const privateProperties = new WeakMap();

var makeThing = function(EntityManager, params){

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

  constructor(params, EntityManager){
    super(params, EntityManager);
    privateProperties[this.name] = {};

    this.Background = params.background;

    if(utilities.exists(params.hover)){
      this.Hover = params.hover;
    }
    let name = this.name;
    privateProperties[name].padding = params.padding;
    privateProperties[name].isHovering = false;

    EntityManager.attachComponent(this,  {
      "Mouse":{
        "HoverMouse": {
          onMouseOver: ()=> {
            this.Entity.isHovering = true;
            this.messageToComponent("Renderer", "markDirty");
          }, onMouseOut: ()=> {
            this.Entity.isHovering = false;
            this.messageToComponent("Renderer", "markDirty");
          }
        }
      }
    });

    EntityManager.attachComponent(this, "Text", Object.assign({},
      {
        callback: ()=>{
          this.messageToComponent("Renderer", "markDirty");
        }
      },
      params)
    );

    EntityManager.attachComponent(this, "Renderer", Object.assign({}, { fromCenter: true,
      /**
       * Use the background object's clearInfo.
       * @param {Canvas.enhancedContext} ctx
       * @memberof CanvasEngine.Entities.Button
       * @returns {Button~Background#components~Renderer.clearInfo}
       */
      clearInfo: ctx=>{
        // Return the background's clearInfo
        return this.Background.getFromComponent("Renderer", "clearInfo", ctx);
      },
      /**
       * Draw the button. Starting with the background or hover state background, then the text.
       * @memberof CanvasEngine.Entities.Button
       * @param {Canvas.enhancedContext} ctx
       * @this {CanvasEngine.Components.Renderer}
       */
      draw: function(ctx){
      // Resize the background based on the height and width of the text, adjusted by the padding params.
        let text = this.Entity.getFromComponent("Text","asObject");
        let size = {
          width : (ctx.measureText({font: text.font, text:text.text}).width)+4,
          //noinspection JSSuspiciousNameCombination
          // The measureText method only returns a width of a text element. To get a height, we use the average of the largest characters.
          height : (ctx.measureText({font: text.font, text:"MWO"}).width/3)+4
        };

        size.width += (params.padding * 2);
        size.height += (params.padding * 2);

        var target;

        if(this.Entity.isHovering && utilities.exists(this.Entity.Hover)){
          target = this.Entity.Hover;

        } else {
          target = this.Entity.Background;
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

        target.messageToComponent("Renderer", "resize", size);


        // Draw the text
        ctx.setDefaults(this);
        ctx.drawText(Object.assign({}, this, this.Entity.getFromComponent("Text", "asObject")));
      }
    },{x: params.x, y: params.y, fillStyle: params.fillStyle}));
  }

  /**
   * @this Button#components~Renderer
   * @param ctx
   */

}