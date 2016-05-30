/**
 * @author Steven Chennault <schenn@gmail.com>
 *
 */
/**
 * @typedef {{
 *  offsetX: number,
 *  offsetY: number,
 *  cancelBubble: boolean,
 *  stopPropagation: function
 * }} mouseEventParams
 */

/**
 * Create and attach the Screen to the CanvasEngine
 */
(function(CanvasEngine){

  var previousMousePosition;

  /**
   * The Screen class manages the individual canvases of the Engine
   *
   * @constructor
   * @memberOf CanvasEngine
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
     * @param {jQuery | HTMLElement} canvas A jQuery wrapped canvas
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
     * @param {number} modifier A percentage 1 - 100
     */
    this.maximize = function(modifier){
      canvases.forEach(function(canvas){
        canvas.maximize(modifier);
      });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the Screen Resolution.
     *
     * If you know what resolution your animation looks best at;
     *  Set it with this method and use CSS to scale the view.
     *  Be sure to maintain your aspect ratio in your style adjustments.
     *
     * @param {number} width
     * @param {number} height
     */
    this.setResolution = function(width, height){
      $.each(canvases, function(index, canvas){
        canvas.attr("width", width);
        canvas.attr("height", height);
      });
    };

    /**
     * Add a z layer (canvas) to the screen.
     *
     * @param {number} z The z index to add
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
     * @param {number} z The index to remove.
     */
    this.removeZLayer = function(z){
      if(z > 0) {
        canvases[z].remove();
        delete canvases[z];
        canvases = CanvasEngine.utilities.cleanArray(canvases);
      }
    };

    /**
     * Draw the Screen Stack
     *  - For each Screen Layer, get the enhanced context and tell CanvasEngine to draw the current Z layer
     *
     *  @see{@link CanvasEngine.drawZ}
     */
    this.drawScreen = function(){
      canvases.forEach(function(canvas, z){
        var ctx = canvas.getEnhancedContext();

        CanvasEngine.drawZ(z, ctx);
      });
    };

    /**
     * Clear an entity from the game screen.
     * @param {CanvasEngine.Entities.Entity} entity
     */
    this.clear = function(entity){
      var ctx = canvases[entity.z_index].getEnhancedContext();
      entity.messageToComponent("Renderer", "clear", ctx);
    };

    /**
     * Get the pixel data of a given position
     *
     * @param {number} x The x position of the pixel
     * @param {number} y The y position of the pixel
     * @param {number} h The height of the search area
     * @param {number} w The width of the search area
     * @param {number} transparent Flag to only check for transparent pixels
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
     * @param {mouseEventParams} e The click event
     *
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

    /**
     * When the mouse is moved over the canvas
     *
     * @param {mouseEventParams} e
     */
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

    /**
     * When a mouse button is pressed over the canvas
     *
     * @param {mouseEventParams} e
     */
    this.onMouseDown = function(e){
      e.stopPropagation();
      e.cancelBubble = true;
      var coords = {
        x: e.offsetX,
        y: e.offsetY
      };
      CanvasEngine.mouse(coords, "MouseDown");
    };

    /**
     * When a mouse button is released over the canvas
     *
     * @param {mouseEventParams} e
     */
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
     *
     * This method draws the stack of canvases to a single canvas.
     *  Then it converts that images into a base64 and sets it as an anchor tag ref with a download attribute
     *  Then it triggers a click onto that anchor tag, before removing it.
     *  This triggers the browser to (usually) perform a save-as for the image with the filename of the download attribute.
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
})(window.CanvasEngine);