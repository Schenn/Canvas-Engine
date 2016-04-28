/**
 * Created by schenn on 4/17/16.
 */
(function(){

  var Screen = function(){
    var canvases = [];
    var baseCanvas;

    this.height = function(){
      return baseCanvas.height();
    };

    this.width = function(){
      return baseCanvas.width();
    };

    this.setScreen = function(canvas){
      if(!(canvas instanceof jQuery)){
        canvas = $(canvas);
      }
      canvases[0] = canvas;
      baseCanvas = canvas;
      baseCanvas.on("click", this.onClick);
    };

    this.maximize = function(modifier){
      canvases.forEach(function(canvas){
        canvas.maximize(modifier);
      });
    };

    this.addZLayer = function(z){
      if(CanvasEngine.utilities.exists(canvases[z])) return;

      var newZ = baseCanvas.
      addZLayer(
        baseCanvas.attr("height"),
        baseCanvas.attr("width"),
        z
      );

      newZ.on("click", this.onClick);
      // Set reference to the canvas element, not its jQuery wrapped version.
      // We only need reference to the base canvas in the screen as a fixed jQuery wrapped object.
      canvases[z] = newZ;
    };

    this.removeZLayer = function(z){
      if(z > 0) {
        canvases[z].remove();
      }
    };

    /**
     * Draw the game screen!
     * @method
     */
    this.drawScreen = function(){
      canvases.forEach(function(canvas, z){
        var ctx = canvas.getEnhancedContext();

        CanvasEngine.drawZ(z, ctx);
      });
    };

    this.clear = function(entity){
      var ctx = canvases[entity.z_index].getEnhancedContext();
      entity.messageToComponent("Renderer", "clear", ctx);
    };

    this.atPixel = function(x, y, h, w, transparent){
      var pixelHits = [];
      var zs = Object.keys(canvases);

      // For each canvas
      $.each(zs, function(index, zIndex){
        // Ask the canvas if it has a solid pixel at that location
        if(canvases[zIndex].getEnhancedContext().atPixel(x, y, h, w, transparent)){
          pixelHits[zIndex] = true;
        }
        // If so, collect it.
      });
      return pixelHits;
    };

    this.onClick = function(e){
      var coords = {
        x: e.offsetX,
        y: e.offsetY
      };
      CanvasEngine.checkClickMap(coords);
    };

  };

  CanvasEngine.Screen = new Screen();
})();