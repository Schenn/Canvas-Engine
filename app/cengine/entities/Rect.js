/**
 * Create a Rect
 * */
/**
 * @typedef {object} EntityParams~Rect
 * @property {boolean} [fromCenter]
 * @property {number} [height]
 * @property {number} [width]
 * @property {string} [fillStyle]
 */

import {Entity} from "entities/Entity.js";

/**
 * @class Rect
 * @memberof CanvasEngine.Entities
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Rect#components~Renderer
 */
export class Rect extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);

    let myParams = {
      fromCenter: false,
      height:100,
      width: 100,
      fillStyle: "#000000",
      // Use the drawRect method on the enhanced context to draw the renderer parameters as a Rect
      draw: function(ctx){
        ctx.drawRect(this);
      }
    };
    Object.assign(myParams, params);
    EntityManager.attachComponent(this, "Renderer", myParams);

  }
}