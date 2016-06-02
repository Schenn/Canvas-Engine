/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @typedef {{
 *  x: number,
 *  y: number,
 *  height: number,
 *  width: number
 * }} GeneralTypes~Sprite
 */

(function(CanvasEngine){
  var props = CanvasEngine.EntityManager.properties;

  /**
   * Constructs an Image Component
   *
   * @see {CanvasEngine.EntityManager.addComponent} for more information.
   * @class
   * @alias Image
   * @memberof CanvasEngine.Components
   * @classdesc The Image Component maintains a JS Image Object and the values which represent a selection on the image.
   * @param {Object} params
   * @param {Image} params.source
   * @param {boolean} [params.cropFromCenter]
   * @param {Callbacks~onPropertyChanged} params.callback
   * @param {number} [params.sx]
   * @param {number} [params.sy]
   * @param {number} [params.sWidth]
   * @param {number} [params.sHeight]
   *
   * @param {CanvasEngine.Entities.Entity} entity

   */
  var img = function(params, entity){
    var source = params.source,
      sx= CanvasEngine.utilities.exists(params.sx) ? params.sx : 0,
      sy= CanvasEngine.utilities.exists(params.sy) ? params.sy : 0,
      sw= CanvasEngine.utilities.exists(params.sWidth) ? params.sWidth : 0,
      sh= CanvasEngine.utilities.exists(params.sHeight) ? params.sHeight : 0,
      cropFromCenter = CanvasEngine.utilities.exists(params.cropFromCenter) ? params.cropFromCenter : false;

    Object.defineProperties(this, {
      /**
       * @type Image
       * @instance
       * @memberof! CanvasEngine.Components.Image
       * @readonly
       */
      "source":props.lockedProperty(source),
      /**
       * @type number
       * @instance
       * @memberof! CanvasEngine.Components.Image
       */
      "sx":props.defaultProperty(sx, params.callback ),
      /**
       * @type number
       * @instance
       * @memberof! CanvasEngine.Components.Image
       */
      "sy":props.defaultProperty(sy, params.callback ),
      /**
       * @type number
       * @instance
       * @memberof! CanvasEngine.Components.Image
       */
      "sWidth":props.defaultProperty(sw, params.callback ),
      /**
       * @type number
       * @instance
       * @memberof! CanvasEngine.Components.Image
       */
      "sHeight":props.defaultProperty(sh, params.callback ),
      /**
       * @type boolean
       * @instance
       * @memberof! CanvasEngine.Components.Image
       */
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
     * Returns the Image unless there's an active selection on the image.
     *
     * @returns {{source: Image} | { sx: number, sy:number, sWidth: number, sHeight: number, cropFromCenter: boolean, source: Image}}
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
     *
     * @param {GeneralTypes~Sprite} sprite
     */
    this.setSprite = function(sprite){
      this.sx = sprite.x;
      this.sy = sprite.y;
      this.sWidth = sprite.width;
      this.sHeight = sprite.height;
    };
  };

  /**
   * Add the Image component to the CanvasEngine storage.
   */
  CanvasEngine.EntityManager.addComponent("Image", function(params, entity){
      return new img(params, entity);
  }, true);
})(window.CanvasEngine);