/**
 * Created by schenn on 4/17/16.
 */
(function(){

  var Screen = function(){
    var canvases = [];

    this.addZLayer = function(z){
      if(CanvasEngine.utilities.exists(canvases[z])) return;

      var newZ = canvases[0].
      addZLayer(
        canvases[0].attr("height"),
        canvases[0].attr("width"),
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

    };

    this.maximize = function(modifier){
      canvases.forEach(function(canvas){
        $(canvas).maximize(modifier);
      });
    };

    this.setScreen = function(canvas){
      canvases[0] = canvas;
    };
  };

  CanvasEngine.Screen = new Screen();
})();