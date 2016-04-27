/**
 * Created by schenn on 4/18/16.
 */
(function(){
  var props = CanvasEngine.EntityManager.properties;

  var img = function(params, entity){
    var source = params.source,
      sx= 0,
      sy= 0,
      sw= 0,
      sh= 0,
      cropFromCenter = CanvasEngine.utilities.exists(params.cropFromCenter) ? params.cropFromCenter : true;

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

    this.asObject = function(){
      if(this.sWidth > 0 && this.sHeight > 0){
        return $.extend({}, this);
      } else {
        return {
          source: this.source
        };
      }

    };

    this.setSprite = function(sprite){
      this.sx = sprite.x;
      this.sy = sprite.y;
      this.sWidth = sprite.width;
      this.sHeight = sprite.height;
    };
  };

  CanvasEngine.EntityManager.addComponent("Image", function(params, entity){
    return new img(params, entity);
  }, true);
})();