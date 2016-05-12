(function(){
    var EM = CanvasEngine.EntityManager;

  /**
   * Tell the EntityManager how to make an IMAGE
   */
  EM.setMake("IMAGE", function(entity, params) {
      // Add an Image Component
      EM.attachComponent(entity,"Image", $.extend({}, params, {
        callback: function(){
          entity.messageToComponent("Renderer", "markDirty");
        }
      }));

      // Add a renderer component
      EM.attachComponent(entity, "Renderer", $.extend({}, params, {
        draw: function(ctx){
          ctx.drawImage($.extend({}, this, entity.getFromComponent("Image", "asObject")));
        }
      }));
      return entity;
    });

})();
