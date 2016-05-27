(function(){

  var previousMousePosition;

  /**
   * The Screen class manages the individual canvases of the Engine
   *
   * @constructor
   * @class
   */
  var Screen = function(){
    var canvases = [];
    var baseCanvas;

    /**
     * Get the height of the drawing area
     * @returns {number}
     */
    this.height = function(){
      return baseCanvas.height();
    };

    /**
     * Get the width of the drawing area
     * @returns {number}
     */
    this.width = function(){
      return baseCanvas.width();
    };

    /**
     * Set the base canvas which forms the back of the screen.
     *
     * @param canvas A jQuery wrapped canvas
     */
    this.setScreen = function(canvas){
      if(!(canvas instanceof jQuery)){
        canvas = $(canvas);
      }
      canvases[0] = canvas;
      baseCanvas = canvas;
      baseCanvas.parent().on({
        click:this.onClick,
        mousedown: this.onMouseDown,
        mouseup:this.onMouseUp,
        mousemove: this.onMouseMove
      }, "canvas");
    };

    /**
     * Fill the parent container up to a given modifier.
     * @param modifier number 1-100.
     */
    this.maximize = function(modifier){
      canvases.forEach(function(canvas){
        canvas.maximize(modifier);
      });
    };

    /**
     * Add a z layer to the screen.
     * A z layer is a new canvas which sits in the stack of canvases
     * @param z The z index to add
     */
    this.addZLayer = function(z){
      if(CanvasEngine.utilities.exists(canvases[z])) return;

      // Set reference to the canvas element, not its jQuery wrapped version.
      // We only need reference to the base canvas in the screen as a fixed jQuery wrapped object.
      canvases[z] = baseCanvas.addZLayer(
        baseCanvas.attr("height"),
        baseCanvas.attr("width"),
        z
      );
    };

    /**
     * Remove a z layer from the Screen.
     *    You cannot remove the base canvas.
     *
     * @param z The index to remove.
     */
    this.removeZLayer = function(z){
      if(z > 0) {
        canvases[z].remove();
        delete canvases[z];
        canvases = CanvasEngine.utilities.cleanArray(canvases);
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

    /**
     * Clear an entity from the game screen.
     * @param entity
     */
    this.clear = function(entity){
      var ctx = canvases[entity.z_index].getEnhancedContext();
      entity.messageToComponent("Renderer", "clear", ctx);
    };

    /**
     * Get the pixel data of a given position
     *
     * @param x The x position of the pixel
     * @param y The y position of the pixel
     * @param h The height of the search area
     * @param w The width of the search area
     * @param transparent Flag to only check for transparent pixels
     *
     * @returns {Array}
     */
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

    /**
     * When a screen is clicked, collect the click coordinate and pass it to the CanvasEngine
     *
     * @param e The click event
     */
    this.onClick = function(e){
      e.stopPropagation();
      e.cancelBubble = true;
      var coords = {
        x: e.offsetX,
        y: e.offsetY
      };
      CanvasEngine.mouse(coords, "Click");
    };


    this.onMouseMove = function(e){
      e.stopPropagation();
      e.cancelBubble = true;
      var coords = {
        x: e.offsetX,
        y: e.offsetY
      };
      CanvasEngine.mouse(coords, "MouseMove", previousMousePosition);
      previousMousePosition = coords;
    };

    this.onMouseDown = function(e){
      e.stopPropagation();
      e.cancelBubble = true;
      var coords = {
        x: e.offsetX,
        y: e.offsetY
      };
      CanvasEngine.mouse(coords, "MouseDown");
    };

    this.onMouseUp = function(e){
      e.stopPropagation();
      e.cancelBubble = true;
      var coords = {
        x: e.offsetX,
        y: e.offsetY
      };
      CanvasEngine.mouse(coords, "MouseUp");
    };

    /**
     * Capture a screenshot
     */
    this.capture = function(){
      // Create a hidden canvas of the appropriate size
      var output = $("<canvas><canvas>");
      output.attr("height", baseCanvas.height);
      output.attr("width", baseCanvas.width);
      output.hide();

      var ctx = output.getContext("2d");

      // Draw each canvas to the hidden canvas in order of z index
      for(var z=0; z < canvases.length; z++){
        ctx.drawImage(canvases[i], 0, 0);
      }

      // Get the image data
      var dataUrl = output.toDataURL();

      // Save the image as a png
      var a = $("<a></a>");
      a.attr("href", dataUrl);
      a.attr("download", "ScreenShot"+(new Date().getDate())+".png");
      $("body").append(a);
      a.click();
      a.remove();
    };
  };

  // Attach The Screen manager to the CanvasEngine.
  CanvasEngine.Screen = new Screen();
})();