/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~imageComponentParams
 * @property {Image} source
 * @property {boolean} [cropFromCenter]
 * @property {function} callback - A function to fire when the property has changed.
 */

/**
 * @typedef {{
 *  x: number
 *  y: number
 *  height: number
 *  width: number
 * }} CanvasEngine.Resources~Sprite
 */

(function(CanvasEngine){
  var props = CanvasEngine.EntityManager.properties;

  /**
   * The Image component manages the interactions with an Image source for an Entity.
   *
   * @alias CanvasEngine.Components.Image
   * @param {LocalParams~imageComponentParams} params
   * @param {CanvasEngine.Entities.Entity} entity
   * @property {Image} Source
   * @property {number} sx
   * @property {sy} sy
   * @property {sWidth} sWidth
   * @property {sHeight} sHeight
   * @property {cropFromCenter}
   */
  var img = function(params, entity){
    var source = params.source,
      sx= 0,
      sy= 0,
      sw= 0,
      sh= 0,
      cropFromCenter = CanvasEngine.utilities.exists(params.cropFromCenter) ? params.cropFromCenter : false;

    Object.defineProperties(this, {
      "source":props.lockedProperty(source),
      "sx":props.defaultProperty(sx, params.callback ),
      "sy":props.defaultProperty(sy, params.callback ),
      "sWidth":props.defaultProperty(sw, params.callback ),
      "sHeight":props.defaultProperty(sh, params.callback ),
      "cropFromCenter":props.defaultProperty(cropFromCenter, params.callback )

    });

    /**
     * Get the attached entity
     *
     * @returns {CanvasEngine.Entities.Entity}
     */
    this.getEntity = function(){
      return entity;
    };

    /**
     * Get the component as an object
     * @returns {{source: Image} | {sx: number sy:number sWidth: number sHeight: number cropFromCenter: boolean source: Image}}
     */
    this.asObject = function(){
      if(this.sWidth > 0 && this.sHeight > 0){
        return $.extend({}, this);
      } else {
        return {
          source: this.source
        };
      }

    };

    /**
     * Set the current sprite data onto the image.
     * @param {CanvasEngine.Resources~Sprite} sprite
     */
    this.setSprite = function(sprite){
      this.sx = sprite.x;
      this.sy = sprite.y;
      this.sWidth = sprite.width;
      this.sHeight = sprite.height;
    };
  };

  /**
   * Create a new Image
   *
   * @constructor
   * @memberOf CanvasEngine.Components.Image
   *
   * @param {LocalParams~imageComponentParams} params
   * @param {CanvasEngine.Entities.Entity} entity
   * @returns {CanvasEngine.Components.Image}
   */
  var construct = function(params, entity){
    return new img(params, entity);
  };

  /**
   * Add the Image component to the CanvasEngine storage.
   */
  CanvasEngine.EntityManager.addComponent("Image", construct, true);
})(window.CanvasEngine);