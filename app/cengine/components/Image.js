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

    var callback = CanvasEngine.utilities.isFunction(params.callback) ? params.callback : null;

    Object.defineProperties(this, {
      "source":props.lockedProperty(source),
      "sx":props.defaultProperty(sx, callback),
      "sy":props.defaultProperty(sy, callback),
      "sWidth":props.defaultProperty(sw, callback),
      "sHeight":props.defaultProperty(sh, callback),
      "cropFromCenter":props.defaultProperty(cropFromCenter, callback)

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
      sx = sprite.x;
      sy = sprite.y;
      sw = sprite.width;
      sh = sprite.height;
    };
  };

  CanvasEngine.EntityManager.addComponent("Image", function(params){
    return new img();
  }, true);
})();