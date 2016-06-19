/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~LineParams
 * @property {string} [strokeStyle]
 * @property {string} [strokeCap]
 * @property {string} [strokeJoin]
 * @property {string} [strokeWidth]
 * @property {boolean} [rounded]
 */
(function(CanvasEngine){
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  /**
   * Tell the EntityManager how to make a LINE
   */
  EM.setMake("LINE",
    /**
     * @param {CanvasEngine.Entities.Entity} entity
     * @param {LocalParams~LineParams} params
     * @returns {CanvasEngine.Entities.Line}
     */
    function(entity, params){

      /**
       * @class
       * @memberOf CanvasEngine.Entities
       * @augments CanvasEngine.Entities.Entity
       * @borrows CanvasEngine.Components.PointPlotter as CanvasEngine.Entities.Line#components~PointPlotter
       * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Line#components~Renderer
       */
      var Line = $.extend(true, {}, {
        /**
         * Plot a set of coordinates
         * @memberof CanvasEngine.Entities.Line
         * @param {GeneralTypes~coords} coords
         * @instance
         */
        plot: function(coords){
        this.messageToComponent("PointPlotter", "plot", coords);
      }}, entity);


        // Start by adding a renderer component
      EM.attachComponent(Line, "Renderer", {
        strokeStyle: utilities.exists(params.strokeStyle) ? params.strokeStyle : "#000000",
        strokeCap: utilities.exists(params.strokeCap) ? params.strokeCap : "round",
        strokeJoin: utilities.exists(params.strokeJoin) ? params.strokeJoin : "miter",
        strokeWidth: utilities.exists(params.strokeWidth) ? params.strokeWidth : 10,
        rounded: utilities.exists(params.rounded) ? params.rounded : false,
        // Draw a line by squishing together the renderer properties and the coordinates from the pointPlotter
        draw: function(ctx){
          ctx.drawLine($.extend({}, this, Line.getFromComponent("PointPlotter", "getCoordinatesAsObject")));
        },
        clearInfo: function(){
          return $.extend({},Line.getFromComponent("PointPlotter", "getArea"),{"fromCenter":false});
        }
      });

      // Now add a PointPlotter component
      EM.attachComponent(Line, "PointPlotter", {
        callback: function(){
          Line.messageToComponent("Renderer", "markDirty");
        }
      });

      return Line;
  });

})(window.CanvasEngine);