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
 * }} LocalParams~mouseEventParams
 */

import privateProperties from "propertyDefinitions";
import * as utilities from "utilities";

import $ from 'jQuery';


class Screen {

  get height(){
    return privateProperties[this].baseCanvas.height();
  }

  get width(){
    return privateProperties[this].baseCanvas.width();
  }

  constructor(MouseHandler){
    privateProperties[this].previousMousePosition = {};
    privateProperties[this].canvases = [];
    privateProperties[this].baseCanvas = null;
    privateProperties[this].onMouseEvent = MouseHandler;
  }

  attachToCanvas(canvas){
    if(!(canvas instanceof jQuery)){
      canvas = $(canvas);
    }
    privateProperties[this].canvases[0] = canvas;
    privateProperties[this].baseCanvas = canvas;
    privateProperties[this].baseCanvas.parent().on({
      click:this.onClick,
      mousedown: this.onMouseDown,
      mouseup:this.onMouseUp,
      mousemove: this.onMouseMove
    }, "canvas");
  }

  /**
   * Fill the parent container up to a given modifier.
   * @param {number} modifier A percentage 1 - 100
   */
  maximize(modifier = 100){
    privateProperties[this].forEach(function(canvas){
      canvas.maximize(modifier);
    });
  }

  getScreenContext(zIndex){
    return privateProperties[this].canvases[zIndex].getEnhancedContext();
  }

  setResolution(resolution){

  }

  /**
   * Add a z layer (canvas) to the screen.
   *
   * @param {number[]} layers The z indexes to add
   */
  addZLayers(layers){
    for(let z of layers){
      if(utilities.exists(privateProperties[this].canvases[z])) return;

      // Set reference to the canvas element, not its jQuery wrapped version.
      // We only need reference to the base canvas in the screen as a fixed jQuery wrapped object.
      privateProperties[this].canvases[z] = privateProperties[this].baseCanvas.addZLayer(
        privateProperties[this].baseCanvas.attr("height"),
        privateProperties[this].baseCanvas.attr("width"),
        z
      );
    }
  }

  /**
   * Remove a z layer from the Screen.
   *    You cannot remove the base canvas.
   *
   * @param {number[]} layers The index to remove.
   */
  removeZLayers(layers){
    for(let z of layers){
      if(z > 0) {
        privateProperties[this].canvases[z].remove();
        delete privateProperties[this].canvases[z];
        privateProperties[this].canvases = utilities.cleanArray(privateProperties[this].canvases);
      }
    }

  }

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
  atPixel(x, y, h, w, transparent){
    var pixelHits = [];
    var zs = privateProperties[this].canvases.keys();

    for(let zIndex of zs){
      if(privateProperties[this].canvases[zIndex].getEnhancedContext().atPixel(x, y, h, w, transparent)){
        pixelHits[zIndex] = true;
      }
    }

    return pixelHits;
  }

  /**
   * When a screen is clicked, collect the click coordinate and pass it to the CanvasEngine
   *
   * @param {LocalParams~mouseEventParams} e The click event
   *
   */
  onClick(e){
    e.stopPropagation();
    e.cancelBubble = true;
    let coords = {
      x: e.offsetX,
      y: e.offsetY
    };
    privateProperties[this].onMouseEvent(coords, "Click");
  }

  /**
   * When the mouse is moved over the canvas
   *
   * @param {LocalParams~mouseEventParams} e
   */
  onMouseMove(e){
    e.stopPropagation();
    e.cancelBubble = true;
    let coords = {
      x: e.offsetX,
      y: e.offsetY
    };
    privateProperties[this].onMouseEvent(coords, "MouseMove", privateProperties[this].previousMousePosition);
    privateProperties[this].previousMousePosition = coords;
  }

  /**
   * When a mouse button is pressed over the canvas
   *
   * @param {LocalParams~mouseEventParams} e
   */
  onMouseDown(e){
    e.stopPropagation();
    e.cancelBubble = true;
    let coords = {
      x: e.offsetX,
      y: e.offsetY
    };
    privateProperties[this].onMouseEvent(coords, "MouseDown");
  }

  /**
   * When a mouse button is released over the canvas
   *
   * @param {LocalParams~mouseEventParams} e
   */
  onMouseUp(e){
    e.stopPropagation();
    e.cancelBubble = true;
    let coords = {
      x: e.offsetX,
      y: e.offsetY
    };
    privateProperties[this].onMouseEvent(coords, "MouseUp");
  }

  /**
   * Capture a screenshot
   *
   * This method draws the stack of canvases to a single canvas.
   *  Then it converts that images into a base64 and sets it as an anchor tag ref with a download attribute
   *  Then it triggers a click onto that anchor tag, before removing it.
   *  This triggers the browser to (usually) perform a save-as for the image with the filename of the download attribute.
   */
  capture(){
    // Create a hidden canvas of the appropriate size
    let output = $("<canvas><canvas>");
    output.attr("height", privateProperties[this].baseCanvas.height);
    output.attr("width", privateProperties[this].baseCanvas.width);
    output.hide();

    let ctx = output.getContext("2d");

    // Draw each canvas to the hidden canvas in order of z index
    for(let z=0; z < privateProperties[this].canvases.length; z++){
      ctx.drawImage(privateProperties[this].canvases[i], 0, 0);
    }

    // Get the image data
    let dataUrl = output.toDataURL();

    // Save the image as a png
    let a = $("<a></a>");
    a.attr("href", dataUrl);
    a.attr("download", "ScreenShot"+(new Date().getDate())+".png");
    $("body").append(a);
    a.click();
    a.remove();
  }

}

export default new Screen();