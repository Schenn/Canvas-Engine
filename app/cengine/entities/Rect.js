/**
 * Create a Rect
 * */

(function(){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Tell the EntityManager how to create a "RECT"
  EM.setMake("RECT", function(entity, params){

    // Start making a RECT by adding a renderer component to the entity.
    EM.attachComponent(entity, "Renderer", {
      fromCenter: utilities.exists(params.fromCenter) ? params.fromCenter : false,
      height:utilities.exists(params.height) ? params.height : 100,
      width: utilities.exists(params.width) ? params.width : 100,
      fillStyle: utilities.exists(params.fillStyle) ? params.fillStyle : "#000000",
      // Use the drawRect method on the enhanced context to draw the renderer parameters as a Rect
      draw: function(ctx){
        ctx.drawRect(this);
      }
    });

    return entity;
  });
})();



