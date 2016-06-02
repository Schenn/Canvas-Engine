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
(function(CanvasEngine){

  var props = CanvasEngine.EntityManager.properties;

  /**
   * The Renderer component is responsible for managing the properties required to draw an object to a canvas.
   *
   *   You can provide your own clear method if your shape is too irregular to clear with a rect
   *   If no clearInfo method is provided, the Renderer uses its x, y, height and width in a clearRect method.
   *
   *
   * @class Renderer
   * @memberof CanvasEngine.Components
   *
   * @todo Allow the Renderer to use gradients and patterns
   *
   * @param {ComponentParams~Renderer} params The container of property values.
   * @param {CanvasEngine.Entities.Entity} entity The entity to attach the Renderer Component to
   *
   */
  var Renderer = function(params, entity){
    var isDirty = true;
    var clearShadow;

    /**
     * The renderer needs to allow a draw to occur
     */
    this.markDirty = function(){
      isDirty = true;
    };

    // Private Properties
    var angle= 0,
      ccw= false,
      closed= false,
      compositing= 'source-over',
      cornerRadius= 0,
      end= 360,
      fillStyle = "#000",
      fromCenter= false,
      height= 0,
      inDegrees= true,
      mask= false,
      opacity= 1,
      projection= 0,
      r1= null,
      r2= null,
      radius= 0,
      repeat= 'repeat',
      rounded= false,
      scaleX= 1,
      scaleY= 1,
      shadowBlur= 3,
      shadowColor= 'transparent',
      shadowX= 0,
      shadowY= 0,
      sides= 3,
      start= 0,
      strokeCap= 'butt',
      strokeJoin= 'miter',
      strokeStyle= 'transparent',
      strokeWidth= 1,
      width= 0,
      x= 0,
      y= 0;

    // Public Properties
    Object.defineProperties(this, {
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      angle:props.defaultProperty(angle, this.markDirty),
      /**
       * @type boolean
       * @instance
       * @memberof Renderer
       */
      ccw:props.defaultProperty(ccw, this.markDirty),
      /**
       * @type boolean
       * @instance
       * @memberof Renderer
       */
      closed:props.defaultProperty(closed, this.markDirty),
      /**
       * @type string
       * @instance
       * @memberof Renderer
       */
      compositing:props.defaultProperty(compositing, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      cornerRadius:props.defaultProperty(cornerRadius, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      end:props.defaultProperty(end, this.markDirty),
      /**
       * @type string
       * @instance
       * @memberof Renderer
       */
      fillStyle:props.defaultProperty(fillStyle, this.markDirty),
      /**
       * @type boolean
       * @instance
       * @memberof Renderer
       */
      fromCenter:props.defaultProperty(fromCenter, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      height:props.defaultProperty(height, this.markDirty),
      /**
       * @type boolean
       * @instance
       * @memberof Renderer
       */
      inDegrees:props.defaultProperty(inDegrees, this.markDirty),
      /**
       * @type boolean
       * @instance
       * @memberof Renderer
       */
      mask:props.defaultProperty(mask, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      opacity:props.defaultProperty(opacity, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      projection:props.defaultProperty(projection, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      r1:props.defaultProperty(r1, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      r2:props.defaultProperty(r2, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      radius:props.defaultProperty(radius, this.markDirty),
      /**
       * @type string
       * @instance
       * @memberof Renderer
       */
      repeat:props.defaultProperty(repeat, this.markDirty),
      /**
       * @type boolean
       * @instance
       * @memberof Renderer
       */
      rounded:props.defaultProperty(rounded, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      scaleX:props.defaultProperty(scaleX, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      scaleY:props.defaultProperty(scaleY, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      shadowBlur:props.defaultProperty(shadowBlur, this.markDirty),
      /**
       * @type string
       * @instance
       * @memberof Renderer
       */
      shadowColor:props.defaultProperty(shadowColor, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      shadowX: props.defaultProperty(shadowX, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      shadowY:props.defaultProperty(shadowY, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      sides:props.defaultProperty(sides, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      start:props.defaultProperty(start, this.markDirty),
      /**
       * @type string
       * @instance
       * @memberof Renderer
       */
      strokeCap:props.defaultProperty(strokeCap, this.markDirty),
      /**
       * @type string
       * @instance
       * @memberof Renderer
       */
      strokeJoin:props.defaultProperty(strokeJoin, this.markDirty),
      /**
       * @type string
       * @instance
       * @memberof Renderer
       */
      strokeStyle:props.defaultProperty(strokeStyle, this.markDirty),
      /**
       * @type string
       * @instance
       * @memberof Renderer
       */
      strokeWidth: props.defaultProperty(strokeWidth, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      width:props.defaultProperty(width, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      x:props.defaultProperty(x, this.markDirty),
      /**
       * @type number
       * @instance
       * @memberof Renderer
       */
      y:props.defaultProperty(y, this.markDirty)
    });

    // The Draw Method is required. You have to tell the renderer how your entity draws itself.
    if(!CanvasEngine.utilities.isFunction(params.draw)){
      console.log(entity.name + ": " + "Renderer missing draw method. Be sure to pass a draw method when attaching a Renderer component.");
    } else {
      this.draw = params.draw;
      delete params.draw;
      this.draw.bind(this);
    }

    // If no clear info generator method provided, use the default.
    if(!CanvasEngine.utilities.exists(params.clearInfo)){
      this.clearInfo =function() {
        return ({
          x: this.x,
          y: this.y,
          height: this.height,
          width: this.width,
          fromCenter: this.fromCenter
        });
      };
    } else {
      this.clearInfo = params.clearInfo;
      this.clearInfo.bind(this);
    }

    /**
     * Set the defaults and call the draw method against a context.
     *    When a renderer is drawn, it stores a 'shadow' of the render for clearing later.
     *
     * @param {Canvas.enhancedContext} ctx EnhancedContext
     */
    this.render = function(ctx){
      ctx.setDefaults($.extend({},this));
      this.draw(ctx);
      isDirty = false;
      clearShadow = this.clearInfo(ctx);
    };

    /**
     * Clear the previous render's 'shadow' from a context.
     * @param {Canvas.enhancedContext} ctx
     */
    if((CanvasEngine.utilities.isFunction(params.clear))){
      this.clear = params.clear;
      this.clear.bind(this);
    } else {
      this.clear = function(ctx){
        if(!CanvasEngine.utilities.exists(clearShadow)){
          clearShadow = this.clearInfo(ctx);
        }
        ctx.clear(clearShadow);
      };
    }

    /**
     * Does a given pixel fall inside of this renderer component?
     *
     * @param {GeneralTypes~coords} coords
     * @returns {boolean}
     */
    this.containsPixel = function(coords){
      // if we contain the pixel position
      var leftBoundary = this.x;
      var rightBoundary = this.x;
      var topBoundary = this.y;
      var bottomBoundary = this.y;
      if (this.fromCenter) {
        leftBoundary -= (0.5 * this.width);
        rightBoundary += (0.5 * this.width);
        topBoundary -= (0.5 * this.height);
        bottomBoundary += (0.5 * this.height);
      }
      else {
        rightBoundary += this.width;
        bottomBoundary += this.height;
      }

      return ((coords.x >= leftBoundary) && (coords.x <= rightBoundary) &&
      ((coords.y >= topBoundary) && (coords.y <= bottomBoundary)));
    };

    /**
     * Does the renderer need to render?
     * @returns {boolean}
     */
    this.isDirty = function(){
      return isDirty;
    };

    this.asObject = function(){
      return $.extend({}, this);
    };

    /**
     * Set the position of the renderer component
     * @param {GeneralTypes~coords} position
     */
    this.setPosition = function(position){
      if(CanvasEngine.utilities.exists(position.x)){
        this.x = position.x;
      }

      if(CanvasEngine.utilities.exists(position.y)){
        this.y = position.y;
      }

    };

    /**
     * Set the size dimensions for the renderer component
     * @param {{ height: number, width: number}} size
     */
    this.resize = function(size){
      if(CanvasEngine.utilities.exists(size.height)){
        this.height = size.height;
      }
      if(CanvasEngine.utilities.exists(size.width)){
        this.width = size.width;
      }
    };

    /**
     * Return the Entity
     * @returns {CanvasEngine.Entities.Entity}
     */
    this.getEntity = function(){
      return entity;
    };

    // This component has a LOT of potential properties. Using the setProperties method to save some keystrokes.
    CanvasEngine.utilities.setProperties(this, params);
  };

  // Add the Renderer component to the CanvasEngine storage
  CanvasEngine.EntityManager.addComponent("Renderer",
    function(params, entity){
    return new Renderer(params, entity);
  });

})(window.CanvasEngine);