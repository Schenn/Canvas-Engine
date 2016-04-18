/**
 * Create a Rect
 * */

(function(){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  EM.setMake("RECT", function(entity, params){

    // Start making a RECT by adding a renderer component to the entity.
    EM.attachComponent(entity, "Renderer", {
      fromCenter: utilities.exists(params.fromCenter) ? params.fromCenter : false,
      height:utilities.exists(params.height) ? params.height : 100,
      width: utilities.exists(params.width) ? params.width : 100,
      fillStyle: utilities.exists(params.fillStyle) ? params.fillStyle : "#000000",
      // This is what essentially makes this a rect
      draw: function(ctx){
        ctx.drawRect(this);
      },
      clearInfo: function () {
        return ({
          x: Math.ceil(this.x - 1),
          y: Math.ceil(this.y),
          height: Math.ceil(this.height),
          width: Math.ceil(this.width),
          fromCenter: this.fromCenter
        });
      }
    });

    return entity;
  });
})();



