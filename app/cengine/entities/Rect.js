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

const defaultParams = {
  fromCenter:false,
  height: 100,
  width: 100,
  fillStyle: "#000000"
};

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

    let myParams = {};

    Object.assign(myParams, {draw: this.draw}, defaultParams);
    EntityManager.attachComponent(this, "Renderer", myParams);

  }

  /**
   * Called while bound to the renderer component
   * @param ctx
   */
  draw(ctx){
    ctx.drawRect(this);
  }
}