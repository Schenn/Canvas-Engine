/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
* @typedef {object} LocalParams~ImageEntityParams
*/

import {Entity} from "../entities/Entity.js";

/**
 * Responsible for rendering a static image to the screen.
 *
 * @class ImageEntity
 * @memberOf CanvasEngine.Entities
 * @borrows CanvasEngine.Components.Image as CanvasEngine.Entities.Image#components~Image
 * @borrows CanvasEngine.Components.Image as CanvasEngine.Entities.Image#components~Renderer
 */
export class ImageEntity extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);

    let self=this;

    let componentParams = {
      callback: function(){
        self.messageToComponent("Renderer", "markDirty");
      },
      draw: function(ctx){

        ctx.drawImage(Object.assign({}, this, self.getFromComponent("Image", "asObject")));
      }
    };

    Object.assign(componentParams, params);

    this.EntityManager.attachComponent(this, "ImageWrapper", componentParams);
    this.EntityManager.attachComponent(this, "Renderer", componentParams);
  }
}