/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~LineParams
 * @property {string} [strokeStyle]
 * @property {string} [strokeCap]
 * @property {string} [strokeJoin]
 * @property {string} [strokeWidth]
 * @property {boolean} [rounded]
 */

import {Entity} from "./Entity.js";

/**
 * A line manages the information needed for rendering lines between coordinates.
 *
 * @class
 * @memberof CanvasEngine.Entities
 * @borrows CanvasEngine.Components.PointPlotter as CanvasEngine.Entities.Line#components~PointPlotter
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Line#components~Renderer
 *
 */
export class Line extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);
    let myParams = {
      strokeStyle: "#000000",
      strokeCap: "round",
      strokeJoin: "miter",
      strokeWidth: 10,
      rounded: false,
      // Draw a line by squishing together the renderer properties and the coordinates from the pointPlotter
      draw: this.draw,
      clearInfo: this.clearInfo.bind(this)
    };

    Object.assign(myParams, params);

    EntityManager.attachComponent(this, "Renderer", myParams);

    // Now add a PointPlotter component
    EntityManager.attachComponent(this, "PointPlotter", {
      callback: ()=>{
        this.askComponent("Renderer", "markDirty");
      }
    });
    if(myParams.coords){
      this.plot(myParams.coords);
    }
  }
  /**
   * Plot a set of coordinates
   * @memberof CanvasEngine.Entities.Line
   * @param {GeneralTypes~coords[]} coords
   * @instance
   */
  plot(coords){
    this.askComponent("PointPlotter", "plot", coords);
  }

  draw(ctx){
    let coords = this.Entity.askComponent("PointPlotter", "Coordinates");
    if(this.fillStyle){
      ctx.setDefaults({fillStyle: this.fillStyle});
    }
    ctx.drawLine(Object.assign({}, this.asObject(), coords));
  }

  clearInfo(ctx){
    let clearInfo = this.askComponent("PointPlotter", "getArea");
    return Object.assign({}, clearInfo,{"fromCenter":false});
  }
}