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

import {Entity} from "./Entity.js";

/**
 * Manage the information needed to render a Rectangular object on the screen.
 *
 * @class Rect
 * @memberof CanvasEngine.Entities
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Rect#components~Renderer
 */
export class Rect extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);

    EntityManager.attachComponent(this, "Renderer", {
      draw: this.draw,
      fromCenter: params.fromCenter || false,
      height: params.height || 100,
      width: params.height || 100,
      fillStyle: params.fillStyle || "#000000"
    });

  }

  /**
   * Called while bound to the renderer component
   * @param ctx
   */
  draw(ctx){
    console.log(this.asObject());
    ctx.drawRect(this.asObject());
  }
}