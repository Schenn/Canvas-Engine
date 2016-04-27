/**
 * Created by schenn on 4/17/16.
 */
(function(){

  var Screen = function(){
    var canvases = [];
    var baseCanvas;

    this.addZLayer = function(z){
      if(CanvasEngine.utilities.exists(canvases[z])) return;

      var newZ = baseCanvas.
      addZLayer(
        baseCanvas.attr("height"),
        baseCanvas.attr("width"),
        z
      );

      newZ.on("click", CanvasEngine.checkClickMap);
      canvases[z] = newZ;
    };

    /**
     * Draw the game screen!
     * @method
     */
    this.drawScreen = function(){
      canvases.forEach(function(canvas, z){
        var ctx = $(canvas).getEnhancedContext();

        CanvasEngine.drawZ(z, ctx);
      });
    };

    this.removeZLayer = function(z){
      if(z > 0) {
        $(canvases[z]).remove();
      }
    };

    this.maximize = function(modifier){
      canvases.forEach(function(canvas){
        $(canvas).maximize(modifier);
      });
    };

    this.setScreen = function(canvas){
      canvases[0] = canvas;
      baseCanvas = $(canvas);
    };

    this.clear = function(entity){
      var ctx = $(canvases[entity.z_index]).getEnhancedContext();
      entity.messageToComponent("Renderer", "Clear", ctx);
    };

    this.height = function(){
      return canvases[0].height;
    };

    this.width = function(){
      return canvases[0].width;
    };
  };

  CanvasEngine.Screen = new Screen();
})();