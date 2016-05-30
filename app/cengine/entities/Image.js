/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~ImageEntityParams
 */
(function(CanvasEngine){
    var EM = CanvasEngine.EntityManager;

  /**
   * Attaches an Image and Renderer component to the base entity
   *
   * @param {CanvasEngine.Entities.Entity} entity
   * @param {LocalParams~ImageEntityParams} params
   * @returns {CanvasEngine.Entities.Image}
   */
  var makeImage = function(entity, params){

    /**
     * @class
     * @memberOf CanvasEngine.Entities
     * @alias Image
     * @augments CanvasEngine.Entities.Entity
     */
    var img = $.extend(true, {}, entity);

    // Add an Image Component
    EM.attachComponent(img,"Image", $.extend({}, params, {
      callback: function(){
        img.messageToComponent("Renderer", "markDirty");
      }
    }));

    // Add a renderer component
    EM.attachComponent(img, "Renderer", $.extend({}, params, {
      draw: function(ctx){
        ctx.drawImage($.extend({}, this, img.getFromComponent("Image", "asObject")));
      }
    }));
    return img;
  };

  /**
   * Tell the EntityManager how to make an IMAGE
   */
  EM.setMake("IMAGE", makeImage);

})(window.CanvasEngine);
