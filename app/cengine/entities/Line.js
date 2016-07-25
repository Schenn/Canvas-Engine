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

import {Entity} from "entities/Entity.js";
import * as utilities from "../engineParts/utilities.js";

/**
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
      draw: function(ctx){
        ctx.drawLine($.extend({}, this, Line.getFromComponent("PointPlotter", "getCoordinatesAsObject")));
      },
      clearInfo: function(){
        return $.extend({},Line.getFromComponent("PointPlotter", "getArea"),{"fromCenter":false});
      }
    };

    Object.assign(myParams, params);

    EntityManager.attachComponent(this, "Renderer", myParams);

    // Now add a PointPlotter component
    EntityManager.attachComponent(this, "PointPlotter", {
      callback: ()=>{
        this.messageToComponent("Renderer", "markDirty");
      }
    });
  }
  /**
   * Plot a set of coordinates
   * @memberof CanvasEngine.Entities.Line
   * @param {GeneralTypes~coords[]} coords
   * @instance
   */
  plot(coords){
    this.messageToComponent("PointPlotter", "plot", coords);
  }

}