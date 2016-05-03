(function(){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Making a LINE
  EM.setMake("LINE", function(entity, params){
    // Start by adding a renderer component
    EM.attachComponent(entity, "Renderer", {
      strokeStyle: utilities.exists(params.strokeStyle) ? params.strokeStyle : "#000000",
      strokeCap: utilities.exists(params.strokeCap) ? params.strokeCap : "round",
      strokeJoin: utilities.exists(params.strokeJoin) ? params.strokeJoin : "miter",
      strokeWidth: utilities.exists(params.strokeWidth) ? params.strokeWidth : 10,
      rounded: utilities.exists(params.rounded) ? params.rounded : false,
      // Draw a line by squishing together the renderer properties and the coordinates from the pointPlotter
      draw: function(ctx){
        ctx.drawLine($.extend({}, this, entity.getFromComponent("PointPlotter", "getCoordinatesAsObject")));
      },
      clearInfo: function(){
        return $.extend({},entity.getFromComponent("PointPlotter", "getArea"),{"fromCenter":false});
      }
    });

    // Now add a PointPlotter component
    EM.attachComponent(entity, "PointPlotter", {
      callback: function(){
        entity.messageToComponent("Renderer", "markDirty");
      }
    });

    entity.plot = function(coords){
      entity.messageToComponent("PointPlotter","plot", coords);
    };

    return entity;
  });

})();