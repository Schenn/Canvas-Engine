/**
 * Created by schenn on 4/18/16.
 */
(function(){
  var props = CanvasEngine.EntityManager.properties;

  var image = function(params, entity){
    var source = params.source,
      load = CanvasEngine.utilities.isFunction(params.load) ? params.load : null,
      sx= CanvasEngine.utilities.isFunction(params.sx) ? params.sx : 0,
      sy= CanvasEngine.utilities.isFunction(params.sy) ? params.sy : 0,
      sw= CanvasEngine.utilities.isFunction(params.sWidth) ? params.sWidth : 0,
      sh= CanvasEngine.utilities.isFunction(params.sHeight) ? params.sHeight : 0,
      cropFromCenter = CanvasEngine.utilities.isFunction(params.cropFromCenter) ? params.cropFromCenter : true;

    var callback = CanvasEngine.utilities.isFunction(params.callback) ? params.callback : null;

    Object.defineProperties(this, {
      "source":props.lockedProperty(source),
      "load": props.lockedProperty(load),
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
          source: this.source,
          load: this.load
        };
      }

    };
  };

  CanvasEngine.EntityManager.addComponent("Image", function(params){
    return new image();
  }, true);
})();