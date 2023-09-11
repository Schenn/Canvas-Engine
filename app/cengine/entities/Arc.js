/**
 * Create an arc and possibly fill it
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
 * @class Arc
 * @memberof CanvasEngine.Entities
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Rect#components~Renderer
 */
export class Arc extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);
    let componentParams = {
      draw: this.draw,
    };
    // Override with incoming params.
    Object.assign(componentParams, params);
    EntityManager.attachComponent(this, "Renderer", componentParams);

  }

  /**
   * Called while bound to the renderer component
   * @param ctx
   */
  draw(ctx){
    ctx.setDefaults({fillStyle: this.fillStyle});
    ctx.drawArc(this.asObject());
  }
}