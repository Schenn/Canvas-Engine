(function(){
  var props = CanvasEngine.EntityManager.properties;

  /**
   * The Image component manages the interactions with an Image source for an Entity.
   * @param params
   * @param entity
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

    this.getEntity = function(){
      return entity;
    };

    /**
     * Get the component as a JSO
     * @returns {{source: *}}
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
     * Set the current sprite data (sprite x, sprite y) for an image.
     * @param sprite
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
})();