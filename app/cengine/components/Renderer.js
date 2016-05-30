/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * Use these param properties to override the defaults.
 *   The draw method is required to use the Renderer component
 *   You can provide your own clear method if your shape is too irregular to clear with a rect
 *   You can provide your own clearInfo method or object to specify what area to clear
 *
 * @typedef {object} LocalParams~RendererParams
 * @property {number} angle
 * @property {boolean} ccw
 * @property {boolean} closed
 * @property {string} compositing
 * @property {number} cornerRadius
 * @property {number} end
 * @property {string} fillStyle
 * @property {boolean} fromCenter
 * @property {number} height
 * @property {boolean} inDegrees
 * @property {boolean} mask
 * @property {number} opacity
 * @property {number} projection
 * @property {number} r1
 * @property {number} r2
 * @property {number} radius
 * @property {string} repeat
 * @property {boolean} rounded
 * @property {number} scaleX
 * @property {number} scaleY
 * @property {number} shadowBlur
 * @property {string} shadowColor
 * @property {number} shadowX
 * @property {number} shadowY
 * @property {number} sides
 * @property {number} start
 * @property {string} strokeCap
 * @property {string} strokeJoin
 * @property {string} strokeStyle
 * @property {number} strokeWidth
 * @property {number} width
 * @property {number} x
 * @property {number} y
 *
 * @property {Image} source
 * @property {number} z_index
 * @property {string} name
 * @property {function} draw - REQUIRED
 * @property {LocalParams~clearInfo | function} clearInfo
 * @property {function} clear
 *
 */
(function(){

  var props = CanvasEngine.EntityManager.properties;

  /**
   * The Renderer component is responsible for managing the properties required to draw an object to a canvas.
   *
   * @class
   * @memberof CanvasEngine.Components
   * @param params {LocalParams~RendererParams}} The container of property values.
   * @param entity {{CanvasEngine.Entities.Entity}} The entity to attach the Renderer Component to
   * @property {number} angle
   * @property {boolean} ccw
   * @property {boolean} closed
   * @property {string} compositing
   * @property {number} cornerRadius
   * @property {number} end
   * @property {string} fillStyle
   * @property {boolean} fromCenter
   * @property {number} height
   * @property {boolean} inDegrees
   * @property {boolean} mask
   * @property {number} opacity
   * @property {number} projection
   * @property {number} r1
   * @property {number} r2
   * @property {number} radius
   * @property {string} repeat
   * @property {boolean} rounded
   * @property {number} scaleX
   * @property {number} scaleY
   * @property {number} shadowBlur
   * @property {string} shadowColor
   * @property {number} shadowX
   * @property {number} shadowY
   * @property {number} sides
   * @property {number} start
   * @property {string} strokeCap
   * @property {string} strokeJoin
   * @property {string} strokeStyle
   * @property {number} strokeWidth
   * @property {number} width
   * @property {number} x
   * @property {number} y
   *
   * @todo Allow the Renderer to use Gradient and Pattern resources when it has them.
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
      "angle":props.defaultProperty(angle, this.markDirty),
      "ccw":props.defaultProperty(ccw, this.markDirty),
      "closed":props.defaultProperty(closed, this.markDirty),
      "compositing":props.defaultProperty(compositing, this.markDirty),
      "cornerRadius":props.defaultProperty(cornerRadius, this.markDirty),
      "end":props.defaultProperty(end, this.markDirty),
      "fillStyle":props.defaultProperty(fillStyle, this.markDirty),
      "fromCenter":props.defaultProperty(fromCenter, this.markDirty),
      "height":props.defaultProperty(height, this.markDirty),
      "inDegrees":props.defaultProperty(inDegrees, this.markDirty),
      "mask":props.defaultProperty(mask, this.markDirty),
      "opacity":props.defaultProperty(opacity, this.markDirty),
      "projection":props.defaultProperty(projection, this.markDirty),
      "r1":props.defaultProperty(r1, this.markDirty),
      "r2":props.defaultProperty(r2, this.markDirty),
      "radius":props.defaultProperty(radius, this.markDirty),
      "repeat":props.defaultProperty(repeat, this.markDirty),
      "rounded":props.defaultProperty(rounded, this.markDirty),
      "scaleX":props.defaultProperty(scaleX, this.markDirty),
      "scaleY":props.defaultProperty(scaleY, this.markDirty),
      "shadowBlur":props.defaultProperty(shadowBlur, this.markDirty),
      "shadowColor":props.defaultProperty(shadowColor, this.markDirty),
      "shadowX": props.defaultProperty(shadowX, this.markDirty),
      "shadowY":props.defaultProperty(shadowY, this.markDirty),
      "sides":props.defaultProperty(sides, this.markDirty),
      "start":props.defaultProperty(start, this.markDirty),
      "strokeCap":props.defaultProperty(strokeCap, this.markDirty),
      "strokeJoin":props.defaultProperty(strokeJoin, this.markDirty),
      "strokeStyle":props.defaultProperty(strokeStyle, this.markDirty),
      "strokeWidth": props.defaultProperty(strokeWidth, this.markDirty),
      "width":props.defaultProperty(width, this.markDirty),
      "x":props.defaultProperty(x, this.markDirty),
      "y":props.defaultProperty(y, this.markDirty)
    });

    if(params.hasOwnProperty("source")){
      delete params.source;
    }
    if(params.hasOwnProperty("z_index")){
      delete params.z_index;
    }

    // The Draw Method is required. You have to tell the renderer how your entity draws itself.
    if(!CanvasEngine.utilities.isFunction(params.draw)){
      console.log(params.name + ": " + "Renderer missing draw method. Be sure to pass a draw method when attaching a Renderer component.");
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
      delete params.clearInfo;
      this.clearInfo.bind(this);
    }

    /**
     * Set the defaults and call the draw method against a context.
     *    When a renderer is drawn, it stores a 'shadow' of the render for clearing later.
     *
     * @param {enhancedContext} ctx EnhancedContext
     */
    this.render = function(ctx){
      ctx.setDefaults($.extend({},this));
      this.draw(ctx);
      isDirty = false;
      clearShadow = this.clearInfo(ctx);
    };

    /**
     * Clear the previous render's 'shadow' from a context.
     * @param {enhancedContext} ctx
     */
    this.clear = (CanvasEngine.utilities.isFunction(params.clear)) ? params.clear : function(ctx){
      if(!CanvasEngine.utilities.exists(clearShadow)){
        clearShadow = this.clearInfo(ctx);
      }
      ctx.clear(clearShadow);
    }.bind(this);

    /**
     * Does a given pixel fall inside of this renderer component?
     *
     * @param {coords} coords
     * @returns {boolean}
     */
    this.containsPixel = function(coords){
      // if we contain the pixel position
      var leftBoundry = this.x;
      var rightBoundry = this.x;
      var topBoundry = this.y;
      var bottomBoundry = this.y;
      if (this.fromCenter) {
        leftBoundry -= (0.5 * this.width);
        rightBoundry += (0.5 * this.width);
        topBoundry -= (0.5 * this.height);
        bottomBoundry += (0.5 * this.height);
      }
      else {
        rightBoundry += this.width;
        bottomBoundry += this.height;
      }

      return ((coords.x >= leftBoundry) && (coords.x <= rightBoundry) &&
      ((coords.y >= topBoundry) && (coords.y <= bottomBoundry)));
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
     * @param {coords} position
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
     * @returns {{CanvasEngine.Entities.Entity}}
     */
    this.getEntity = function(){
      return entity;
    };

    // This component has a LOT of potential properties. Using the setProperties method to save some keystrokes.
    CanvasEngine.utilities.setProperties(this, params);
  };

  /**
   * @construct
   * @memberOf Renderer
   */
  var construct = function(params, entity){
    return new Renderer(params, entity);
  };

  // Add the Renderer component to the CanvasEngine storage
  CanvasEngine.EntityManager.addComponent("Renderer",construct);

})();