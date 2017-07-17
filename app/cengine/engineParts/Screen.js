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

import * as utilities from "./utilities.js";
import {properties} from "./propertyDefinitions.js";
import {getEnhancedContext} from "./EnhancedContext";

const privateProperties = new WeakMap();

/**
 * Manage maintaining and listening to events on the 'physical' screen
 *  (the stack of canvases) which the cengine is rendering to.)
 */
export class Screen {

  get height(){
    return privateProperties[this.id].baseCanvas.height();
  }

  get width(){
    return privateProperties[this.id].baseCanvas.width();
  }

  /**
   * Create a new screen with a given Mouse Event Handler
   *
   * @param MouseHandler
   */
  constructor(MouseHandler){

    let id = utilities.randName();

    Object.defineProperties(this, {
      id: properties.lockedProperty(id)
    });
    privateProperties[this.id] = {};
    privateProperties[this.id].previousMousePosition = {};
    privateProperties[this.id].canvases = [];
    privateProperties[this.id].baseCanvas = null;
    privateProperties[this.id].onMouseEvent = MouseHandler;
  }

  /**
   * Attach the Screen to the canvas element
   *
   * @param {HTMLElement} canvas
   */
  attachToCanvas(canvas){
    if(!(canvas instanceof jQuery)){
      canvas = $(canvas);
    }
    privateProperties[this.id].canvases[0] = canvas;
    privateProperties[this.id].baseCanvas = canvas;
    let self = this;
    privateProperties[this.id].baseCanvas.parent().on({
      click:(e)=>{
        self.onClick(e);
      },
      mousedown: (e)=>{
        self.onMouseDown(e);
      },
      mouseup:(e)=>{
        self.onMouseUp(e);
      },
      mousemove: (e)=>{
        self.onMouseMove(e);
      }
    }, "canvas");
  }

  /**
   * Fill the parent container up to a given modifier.
   * @param {number} modifier A percentage 1 - 100
   */
  maximize(modifier = 100){
    privateProperties[this.id].canvases.forEach(function(canvas){
      getEnhancedContext(canvas).maximize(modifier);
    });
  }

  /**
   * Get the canvas context for a given screen layer.
   *
   * @param zIndex
   * @returns {Canvas.enhancedContext}
   */
  getScreenContext(zIndex){
    return getEnhancedContext(privateProperties[this.id].canvases[zIndex]);
  }

  /**
   * Set the screen resolution to a fixed value so that scaling can utilize aspect ratios.
   *
   * @todo
   * @param resolution
   */
  setResolution(resolution){

  }

  /**
   * Add a z layer (canvas) to the screen.
   *
   * @param {number[]} layers The z indexes to add
   */
  addZLayers(layers){
    for(let z of layers){
      if(utilities.exists(privateProperties[this.id].canvases[z])) continue;

      // Set reference to the canvas element, not its jQuery wrapped version.
      // We only need reference to the base canvas in the screen as a fixed jQuery wrapped object.
      privateProperties[this.id].canvases[z] = privateProperties[this.id].baseCanvas.addZLayer(
        privateProperties[this.id].baseCanvas.attr("height"),
        privateProperties[this.id].baseCanvas.attr("width"),
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
        privateProperties[this.id].canvases[z].remove();
        delete privateProperties[this.id].canvases[z];
        privateProperties[this.id].canvases = utilities.cleanArray(privateProperties[this.id].canvases);
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
   * @todo This should be a generator
   *
   * @returns {Array}
   */
  atPixel(x, y, h, w, transparent){
    let pixelHits = [];
    let zs = privateProperties[this.id].canvases.keys();

    for(let zIndex of zs){
      pixelHits[zIndex] = privateProperties[this.id].canvases[zIndex].getEnhancedContext().atPixel(x, y, h, w, transparent);
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
    privateProperties[this.id].onMouseEvent(coords, "Click");
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
    privateProperties[this.id].onMouseEvent(coords, "MouseMove", privateProperties[this.id].previousMousePosition);
    privateProperties[this.id].previousMousePosition = coords;
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
    privateProperties[this.id].onMouseEvent(coords, "MouseDown");
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
    privateProperties[this.id].onMouseEvent(coords, "MouseUp");
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
    output.attr("height", privateProperties[this.id].baseCanvas.height);
    output.attr("width", privateProperties[this.id].baseCanvas.width);
    output.hide();

    let ctx = output.getContext("2d");

    // Draw each canvas to the hidden canvas in order of z index
    for(let z=0; z < privateProperties[this.id].canvases.length; z++){
      ctx.drawImage(privateProperties[this.id].canvases[i], 0, 0);
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