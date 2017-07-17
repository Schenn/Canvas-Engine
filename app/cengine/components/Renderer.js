/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @callback Callbacks~Draw
 * @param {jQuery.enhancedContext} ctx
 */

/**
 * @callback Callbacks~Clear
 * @param {jQuery.enhancedContext} ctx
 */
/**
 * @typedef {object} ComponentParams~Renderer
 * @property {Callbacks~Draw} draw - The actual bit that does the rendering. @see {CanvasEngine.Entities}.
 * @property {number} [angle=0]
 * @property {boolean} [ccw=false]
 * @property {boolean} [closed=false]
 * @property {string} [compositing='source-over']
 * @property {number} [cornerRadius=0]
 * @property {number} [end=0]
 * @property {string} [fillStyle="#000"]
 * @property {boolean} [fromCenter=false]
 * @property {number} [height=0]
 * @property {boolean} [inDegrees=true]
 * @property {boolean} [mask=false]
 * @property {number} [opacity=1]
 * @property {number} [projection=0]
 * @property {?number} [r1=null]
 * @property {?number} [r2=null]
 * @property {number} [radius=0]
 * @property {string} [repeat="repeat"]
 * @property {boolean} [rounded=false]
 * @property {number} [scaleX=1]
 * @property {number} [scaleY=1]
 * @property {number} [shadowBlur=3]
 * @property {string} [shadowColor='transparent']
 * @property {number} [shadowX=0]
 * @property {number} [shadowY=0]
 * @property {number} [sides=3]
 * @property {number} [start=0]
 * @property {string} [strokeCap='butt']
 * @property {string} [strokeJoin='miter']
 * @property {string} [strokeStyle='transparent']
 * @property {number} [strokeWidth=1]
 * @property {number} [width=0]
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {?Image} [source=null]
 * @property {GeneralTypes~ClearInfo | Callbacks~ClearInfo} [clearInfo = Callbacks~ClearInfo]
 * @property {?Callbacks~Clear} [clear=null]
 */

import {properties} from "../engineParts/propertyDefinitions.js";
import {Component} from "./Component.js";
import * as utilities from "../engineParts/utilities.js";

let privateProperties = new WeakMap();


/**
 * The Renderer component is responsible for managing the properties required to draw an object to a canvas.
 *
 *   You can provide your own clear method if your shape is too irregular to clear with a rect
 *   If no clearInfo method is provided, the Renderer uses its x, y, height and width in a clearRect method.
 *
 *
 * @class Renderer
 * @memberOf CanvasEngine.Components
 *
 * @todo Allow the Renderer to use gradients and patterns
 * @property {boolean} fromCenter = false
 *
 */
export class Renderer extends Component {
  /**
   * @param {ComponentParams~Renderer} params The container of property values.
   * @param {CanvasEngine.Entities.Entity} entity The entity to attach the Renderer Component to
   */
  constructor(params, entity) {
    super(entity, ()=>{this.markDirty();});
    privateProperties[this.id] = {};
    privateProperties[this.id].isDirty = true;
    privateProperties[this.id].hidden = false;
    privateProperties[this.id].postRender = null;

    // Private Properties
    var { angle = 0,
      ccw = false,
      closed = false,
      compositing = 'source-over',
      cornerRadius = 0,
      end = 360,
      fillStyle = "#000",
      fromCenter = false,
      height = 0,
      inDegrees = true,
      mask = false,
      opacity = 1,
      projection = 0,
      r1 = null,
      r2 = null,
      radius = 0,
      repeat = 'repeat',
      rounded = false,
      scaleX = 1,
      scaleY = 1,
      shadowBlur = 3,
      shadowColor = 'transparent',
      shadowX = 0,
      shadowY = 0,
      sides = 3,
      start = 0,
      strokeCap = 'butt',
      strokeJoin = 'miter',
      strokeStyle = 'transparent',
      strokeWidth = 1,
      width = 0,
      x = 0,
      y = 0 } = params;

    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("angle", angle);
    /**
     * @type boolean
     * @instance
     * @memberof Renderer
     */
    this.setProperty("ccw", ccw);
    /**
     * @type boolean
     * @instance
     * @memberof Renderer
     */
    this.setProperty("closed", closed);
    /**
     * @type string
     * @instance
     * @memberof Renderer
     */
    this.setProperty("compositing", compositing);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("cornerRadius", cornerRadius);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("end", end);
    /**
     * @type string
     * @instance
     * @memberof Renderer
     */
    this.setProperty("fillStyle", fillStyle);
    /**
     * @type boolean
     * @instance
     * @memberof Renderer
     */
    this.setProperty("fromCenter", fromCenter);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("height", height);
    /**
     * @type boolean
     * @instance
     * @memberof Renderer
     */
    this.setProperty("inDegrees", inDegrees);
    /**
     * @type boolean
     * @instance
     * @memberof Renderer
     */
    this.setProperty("mask", mask);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("opacity", opacity);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("projection", projection);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("r1", r1);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("r2", r2);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("radius", radius);

    /**
     * @type string
     * @instance
     * @memberof Renderer
     */
    this.setProperty("repeat", repeat);
    /**
     * @type boolean
     * @instance
     * @memberof Renderer
     */
    this.setProperty("rounded", rounded);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("scaleX", scaleX);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("scaleY", scaleY);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("shadowBlur", shadowBlur);
    /**
     * @type string
     * @instance
     * @memberof Renderer
     */
    this.setProperty("shadowColor", shadowColor);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("shadowX", shadowX);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("shadowY", shadowY);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("sides", sides);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("start", start);
    /**
     * @type string
     * @instance
     * @memberof Renderer
     */
    this.setProperty("strokeCap", strokeCap);
    /**
     * @type string
     * @instance
     * @memberof Renderer
     */
    this.setProperty("strokeJoin", strokeJoin);
    /**
     * @type string
     * @instance
     * @memberof Renderer
     */
    this.setProperty("strokeStyle", strokeStyle);
    /**
     * @type string
     * @instance
     * @memberof Renderer
     */
    this.setProperty("strokeWidth", strokeWidth);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("width", width);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("x", x);
    /**
     * @type number
     * @instance
     * @memberof Renderer
     */
    this.setProperty("y", y);


    // The Draw Method is required. You <u>have</u> to tell the renderer how your entity draws itself.
    this.draw = params.draw;
    this.draw.bind(this);
    delete params.draw;

    if(utilities.exists(params.clearInfo)){
      privateProperties[this.id].clearInfo = params.clearInfo;
      privateProperties[this.id].clearInfo.bind(this);
    }

    if ((utilities.isFunction(params.clear))) {
      privateProperties[this.id].clear = params.clear;
      privateProperties[this.id].clear.bind(this);
    }

  }

  /**
   * Get the Clear Info for the Rendered thing
   *
   * @returns {{x: (number), y: (number), height: (number), width: (number), fromCenter: boolean}}
   */
  clearInfo(ctx){
    return (utilities.exists(privateProperties[this.id].clearInfo)) ? privateProperties[this.id].clearInfo(ctx) :{
      x: this.x,
      y: this.y,
      height: this.height,
      width: this.width,
      fromCenter: this.fromCenter
    };
  }

  /**
   * Clear the previous render's 'shadow' from a context.
   * @param {Canvas.enhancedContext} ctx
   */
  clear(ctx) {
    if(utilities.exists(privateProperties[this.id].clear)){
      privateProperties[this.id].clear(ctx);
    } else {
      if (!utilities.exists(privateProperties[this.id].clearShadow)) {
        privateProperties[this.id].clearShadow = this.clearInfo(ctx);
      }
      ctx.clear(privateProperties[this.id].clearShadow);
    }
  }

  markDirty () {
    privateProperties[this.id].isDirty = true;
  }

  get isDirty(){
    return privateProperties[this.id].isDirty === true;
  }

  hide(callback){
    privateProperties[this.id].hidden = true;
    privateProperties[this.id].postRender = callback;
  }

  /**
   * Set the defaults and call the draw method against a context.
   *    When a renderer is drawn, it stores a 'shadow' of the render for clearing later.
   *
   * @param {Canvas.enhancedContext} ctx EnhancedContext
   */
  render (ctx) {
    ctx.setDefaults(Object.assign({}, this));
    if(!privateProperties[this.id].hidden) {
      this.draw(ctx);
      privateProperties[this.id].isDirty = false;
      privateProperties[this.id].clearShadow = this.clearInfo(ctx);
    }
  }

  postRender(){
    if(utilities.isFunction(privateProperties[this.id].postRender)){
      privateProperties[this.id].postRender();
    }
  }

  /**
   * Does a given pixel fall inside of this renderer component?
   *
   * @param {GeneralTypes~coords} coords
   * @returns {boolean}
   */
  containsPixel(coords) {
    // if we contain the pixel position
    let area = privateProperties[this.id].clearShadow;
    let leftBoundary = area.x;
    let rightBoundary = area.x;
    let topBoundary = area.y;
    let bottomBoundary = area.y;
    if (this.fromCenter) {
      leftBoundary -= (0.5 * area.width);
      rightBoundary += (0.5 * area.width);
      topBoundary -= (0.5 * area.height);
      bottomBoundary += (0.5 * area.height);
    }
    else {
      rightBoundary += area.width;
      bottomBoundary += area.height;
    }

    return ((coords.x >= leftBoundary) && (coords.x <= rightBoundary) &&
    ((coords.y >= topBoundary) && (coords.y <= bottomBoundary)));
  }

  asObject() {
    return properties.proxy(this);
  }

  /**
   * Set the position of the renderer component
   * @param {GeneralTypes~coords} position
   */
  setPosition(position) {
    if (utilities.exists(position.x)) {
      this.x = position.x;
    }

    if (utilities.exists(position.y)) {
      this.y = position.y;
    }

  }

  /**
   * Set the size dimensions for the renderer component
   * @param {{ height: number, width: number}} size
   */
  resize(size) {
    if (utilities.exists(size.height)) {
      this.height = size.height;
    }
    if (utilities.exists(size.width)) {
      this.width = size.width;
    }
  }

}