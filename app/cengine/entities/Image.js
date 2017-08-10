/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~ImageEntityParams
 */

import {Entity} from '../entities/Entity.js';

/**
 * Responsible for rendering a static image to the screen.
 *
 * @class ImageEntity
 * @memberOf CanvasEngine.Entities
 * @borrows CanvasEngine.Components.Image as CanvasEngine.Entities.Image#components~Image
 * @borrows CanvasEngine.Components.Image as CanvasEngine.Entities.Image#components~Renderer
 */
export class ImageEntity extends Entity {
  constructor(params, EntityManager) {
    super(params, EntityManager);

    let componentParams = {
      callback: this.redraw,
      draw: this.draw,
    };

    // Override with incoming params.
    Object.assign(componentParams, params);

    EntityManager.attachComponent(this, 'Image', componentParams);
    EntityManager.attachComponent(this, 'Renderer', componentParams);
  }

  redraw() {
    this.messageToComponent('Renderer', 'markDirty');
  }

  draw(ctx) {
    let output = Object.assign({}, this, this.Entity.getFromComponent('Image','asObject'));
    console.log(output);
    ctx.drawImage(
        Object.assign(
            {},
            this.asObject(),
            this.Entity.getFromComponent('Image', 'asObject')),
    );
  }
}