/**
 * @author Steven Chennault <schenn@gmail.com>
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */

/**
 * ClearInfo
 *
 * @typedef {object} LocalParams~clearInfo
 * @property {number} x
 * @property {number} y
 * @property {number} height
 * @property {number} width
 */

(function($){
  /**
   * An enhanced context is a regular 2d context with helper drawing functions already attached!
   * @class enhancedContext
   * @memberof external:"jQuery.fn"
   */
  $.fn.getEnhancedContext = function(){

    /**
     * @type {CanvasRenderingContext2D}
     */
    var ctx= $(this)[0].getContext('2d');
    /**
     * @type {HTMLCanvasElement}
     */
    var canvas = $(this)[0];

    var enhancedContext = {};

    /**
     * Clear a space from the context
     * @param {LocalParams~clearInfo} clearInfo
     */
    enhancedContext.clear = function(clearInfo){
      // Clear entire canvas
      if (!clearInfo.width && !clearInfo.height) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        if(this.fromCenter) {
          ctx.clearRect(clearInfo.x - clearInfo.width / 2, clearInfo.y - clearInfo.height / 2, clearInfo.width, clearInfo.height);
        } else {
          ctx.clearRect(clearInfo.x, clearInfo.y, clearInfo.width, clearInfo.height);
        }
      }
    };

    /**
     * Set the default context properties
     *  Just because a property CAN be undefined doesn't mean it should be.
     *  This method is used to prepare context with the basic values that the actual draw method will need
     *  Be sure to send all of the properties you need to do the draw.
     * @param {{
     *  fillStyle: string | undefined
     *  strokeStyle: string | undefined
     *  rounded: boolean | undefined
     *  shadowX: number | undefined
     *  shadowY: number | undefined
     *  shadowBlur: number | undefined
     *  shadowColor: string | undefined
     *  strokeWidth: number | undefined
     *  strokeCap: string | undefined
     *  strokeJoin: string | undefined
     *  opacity: number | undefined
     *  compositing: string | undefined
     * }} defaultParams
     */
    enhancedContext.setDefaults = function(defaultParams){
      ctx.fillStyle = defaultParams.fillStyle;
      ctx.strokeStyle = defaultParams.strokeStyle;
      ctx.lineWidth = defaultParams.strokeWidth;
      // Set rounded corners for paths
      if (defaultParams.rounded) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else {
        ctx.lineCap = defaultParams.strokeCap;
        ctx.lineJoin = defaultParams.strokeJoin;
      }
      ctx.shadowOffsetX = defaultParams.shadowX;
      ctx.shadowOffsetY = defaultParams.shadowY;
      ctx.shadowBlur = defaultParams.shadowBlur;
      ctx.shadowColor = defaultParams.shadowColor;
      ctx.globalAlpha = defaultParams.opacity;
      ctx.globalCompositeOperation = defaultParams.compositing;
    };

    /**
     * Close a path belonging to a shape
     *
     * @param {{
     *  mask: boolean | undefined
     *  closed: boolean | undefined
     * }} closePathParams
     */
    enhancedContext.closePath = function(closePathParams){
      // Mask if chosen
      if (closePathParams.mask) {
        ctx.save();
        ctx.clip();
      }
      if (closePathParams.closed) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    };

    /**
     * Convert angles to a respective degree
     * @param {{ inDegrees: boolean | undefined }} angleParams
     * @returns {number}
     */
    enhancedContext.convertAngles = function(angleParams) {
      return angleParams.inDegrees ? Math.PI/180 : 1;
    };

    /**
     * position the context for rendering
     *
     *  If angle is provided, you also have to provide toRad
     *
     * @param {{
     *  x: number
     *  y: number
     *  fromCenter: boolean | undefined
     *  inDegrees: boolean | undefined
     *  angle: number | undefined
     *  toRad: number | undefined
     *  }} shapeParams
     * @param {number} width
     * @param {number} height
     */
    enhancedContext.positionShape = function(shapeParams, width, height) {

      shapeParams.toRad = this.convertAngles(shapeParams);
      ctx.save();

      // Always rotate from center
      if (!shapeParams.fromCenter) {
        shapeParams.x += width/2;
        shapeParams.y += height/2;
      }

      // Rotate only if specified
      if (shapeParams.angle) {
        ctx.translate(shapeParams.x, shapeParams.y);
        ctx.rotate(shapeParams.angle*shapeParams.toRad);
        ctx.translate(-shapeParams.x, -shapeParams.y);
      }

    };

    /**
     * Draw an Arc
     *
     * @param {{
     *  inDegrees: boolean | undefined
     *  end: number | undefined
     *  radius: number
     *  start: number
     *  toRad: number
     *  ccw: boolean | undefined
     *  x: number
     *  y: number
     *  mask: boolean | undefined
     *  closed: boolean | undefined
     *  angle: number | undefined
     *  toRad: number | undefined
     *  inDegrees: boolean | undefined
     *  fromCenter: boolean | undefined
     * }} arcParams
     */
    enhancedContext.drawArc = function(arcParams){

      var pi = Math.PI;

      if (!arcParams.inDegrees && arcParams.end === 360) {
        arcParams.end = pi * 2;
      }

      this.positionShape(arcParams, arcParams.radius*2, arcParams.radius*2);
      // Draw arc
      ctx.beginPath();
      ctx.arc(arcParams.x, arcParams.y, arcParams.radius, (arcParams.start*arcParams.toRad)-(pi/2), (arcParams.end*arcParams.toRad)-(pi/2), arcParams.ccw);
      // Close path if chosen
      ctx.restore();
      this.closePath(arcParams);
    };

    /**
     * Draw a Bezier curve
     *
     * @param {{
     *  x1: number
     *  y1: number
     *  x2: number
     *  y2: number
     *  cx0: number
     *  cy0: number
     *  cx1: number
     *  cy1: number
     *  mask: boolean  | undefined
     *  closed: boolean | undefined
     *  fillStyle: string | undefined
     *  strokeStyle: string | undefined
     *  strokeWidth: number | undefined
     *  rounded: boolean | undefined
     *  shadowX: number | undefined
     *  shadowY: number | undefined
     *  shadowBlur: number | undefined
     *  shadowColor: string | undefined
     *  strokeWidth: number | undefined
     *  strokeCap: string | undefined
     *  strokeJoin: string | undefined
     *  opacity: number | undefined
     *  compositing: string | undefined
     * }} bezierParams  - There can be any number of Xs, Ys, CXs and CYs. Just give each their own key -> value
     */
    enhancedContext.drawBezier = function(bezierParams){
        var l = 2, lc = 1,
        lx, ly,
        lcx1, lcy1,
        lcx2, lcy2;

        this.setDefaults(bezierParams);

        // Draw each point
        ctx.beginPath();
        ctx.moveTo(bezierParams.x1, bezierParams.y1);
        while (true) {
          lx = bezierParams['x' + l];
          ly = bezierParams['y' + l];
          lcx1 = bezierParams['cx' + lc];
          lcy1 = bezierParams['cy' + lc];
          lcx2 = bezierParams['cx' + (lc+1)];
          lcy2 = bezierParams['cy' + (lc+1)];
          if (lx !== undefined && ly !== undefined && lcx1 !== undefined && lcy1 !== undefined && lcx2 !== undefined && lcy2 !== undefined) {
            ctx.bezierCurveTo(lcx1, lcy1, lcx2, lcy2, lx, ly);
            l += 1;
            lc += 2;
          } else {
            break;
          }
        }
        // Close path if chosen
        this.closePath(bezierParams);
    };

    /**
     * Draw an ellipse
     * @param {{
     *  x: number
     *  y: number
     *  height: number
     *  width: number
     *  mask: boolean | undefined
     *  closed: boolean | undefined
     *  fillStyle: string | undefined
     *  strokeStyle: string | undefined
     *  strokeWidth: number | undefined
     *  rounded: boolean | undefined
     *  shadowX: number | undefined
     *  shadowY: number | undefined
     *  shadowBlur: number | undefined
     *  shadowColor: string | undefined
     *  strokeWidth: number | undefined
     *  strokeCap: string | undefined
     *  strokeJoin: string | undefined
     *  opacity: number | undefined
     *  compositing: string | undefined
     *  inDegrees: boolean | undefined
     *  fromCenter: boolean | undefined
     *  angle: number | undefined
     *  toRad: number | undefined
     * }} ellipseParams
     */
    enhancedContext.drawEllipse = function(ellipseParams){
      var controlW = ellipseParams.width * 4/3;

        this.setDefaults(ellipseParams);
        this.positionShape(ellipseParams, ellipseParams.width, ellipseParams.height);

        // Create ellipse
        ctx.beginPath();
        ctx.moveTo(ellipseParams.x, ellipseParams.y-ellipseParams.height/2);
        // Left side
        ctx.bezierCurveTo(ellipseParams.x-controlW/2, ellipseParams.y-ellipseParams.height/2, ellipseParams.x-controlW/2, ellipseParams.y+ellipseParams.height/2, ellipseParams.x, ellipseParams.y+ellipseParams.height/2);
        // Right side
        ctx.bezierCurveTo(ellipseParams.x+controlW/2, ellipseParams.y+ellipseParams.height/2, ellipseParams.x+controlW/2, ellipseParams.y-ellipseParams.height/2, ellipseParams.x, ellipseParams.y-ellipseParams.height/2);
        ctx.restore();
        this.closePath(ellipseParams);
    };

    /**
     * Draw an image
     * @param {{
     *  source: Image | string
     *  x: number
     *  y: number
     *  height: number
     *  width: number
     *  mask: boolean | undefined
     *  closed: boolean | undefined
     *  fillStyle: string | undefined
     *  strokeStyle: string | undefined
     *  strokeWidth: number | undefined
     *  rounded: boolean | undefined
     *  shadowX: number | undefined
     *  shadowY: number | undefined
     *  shadowBlur: number | undefined
     *  shadowColor: string | undefined
     *  strokeWidth: number | undefined
     *  strokeCap: string | undefined
     *  strokeJoin: string | undefined
     *  opacity: number | undefined
     *  compositing: string | undefined
     *  inDegrees: boolean | undefined
     *  fromCenter: boolean | undefined
     *  angle: number | undefined
     *  toRad: number | undefined
     *  sWidth: number | undefined
     *  sHeight: number | undefined
     *  sx: number | null | undefined
     *  sy: number | null | undefined
     *  cropFromCenter: boolean | undefined
     *  load: function | undefined
     * }} imageParams
     */
    enhancedContext.drawImage = function(imageParams){
      var img = new Image(),scaleFac;
      // Use specified element, if not, a source URL
      if (imageParams.source.src) {
        img = imageParams.source;
      } else if (imageParams.source) {
        img.src = imageParams.source;
      }

      // Draw image function
      function draw() {
        if (img.complete) {
          scaleFac = (img.width / img.height);

          // Show whole image if no cropping region is specified
          imageParams.sWidth = imageParams.sWidth || img.width;
          imageParams.sHeight = imageParams.sHeight || img.height;
          // Ensure cropped region is not bigger than image
          if (imageParams.sWidth > img.width) {
            imageParams.sWidth = img.width;
          }
          if (imageParams.sHeight > img.height) {
            imageParams.sHeight = img.height;
          }
          // Destination width/height should equal source unless specified
          if (imageParams.width === 0 && imageParams.sWidth !== img.width) {
            imageParams.width = imageParams.sWidth;
          }
          if (imageParams.height === 0 && imageParams.sHeight !== img.height) {
            imageParams.height = imageParams.sHeight;
          }

          // If no sx/sy specified, use center of image (or top-left corner if cropFromCenter is false)
          if (imageParams.sx === null) {
            if (imageParams.cropFromCenter) {
              imageParams.sx = img.width / 2;
            } else {
              imageParams.sx = 0;
            }
          }
          if (imageParams.sy === null) {
            if (imageParams.cropFromCenter) {
              imageParams.sy = img.height / 2;
            } else {
              imageParams.sy = 0;
            }
          }

          // Crop from top-left corner if specified (rather than center)
          if (!imageParams.cropFromCenter) {
            imageParams.sx += imageParams.sWidth/2;
            imageParams.sy += imageParams.sHeight/2;
          }

          // Ensure cropped region does not extend image boundary
          if ((imageParams.sx - imageParams.sWidth/2) < 0) {
            imageParams.sx = imageParams.sWidth/2;
          }
          if ((imageParams.sx + imageParams.sWidth/2) > img.width) {
            imageParams.sx = img.width - imageParams.sWidth / 2;
          }
          if ((imageParams.sy - imageParams.sHeight/2) < 0) {
            imageParams.sy = imageParams.sHeight / 2;
          }
          if ((imageParams.sy + imageParams.sHeight/2) > img.height) {
            imageParams.sy = img.height - imageParams.sHeight / 2;
          }

          // If only width is present
          if (imageParams.width && !imageParams.height) {
            imageParams.height = imageParams.width / scaleFac;
            // If only height is present
          } else if (!imageParams.width && imageParams.height) {
            imageParams.width = imageParams.height * scaleFac;
            // If width and height are both absent
          } else if (!imageParams.width && !imageParams.height) {
            imageParams.width = img.width;
            imageParams.height = img.height;
          }

          // Draw image
          enhancedContext.positionShape(imageParams, imageParams.width, imageParams.height);
          ctx.drawImage(
            img,
            imageParams.sx - imageParams.sWidth / 2,
            imageParams.sy - imageParams.sHeight / 2,
            imageParams.sWidth,
            imageParams.sHeight,
            imageParams.x - imageParams.width / 2,
            imageParams.y - imageParams.height / 2,
            imageParams.width,
            imageParams.height
          );
          ctx.restore();
          return true;
        } else {
          return false;
        }
      }
      // Run callback function
      function callback() {
        if (typeof(imageParams.load) === "function") {
          imageParams.load.call(enhancedContext);
        }
      }
      // On load function
      function onload() {
        draw();
        callback();
      }

      // Draw when image is loaded (if chosen)
      if (!img.complete && imageParams.load) {
        img.onload = onload;
      } else {
        // Draw image if loaded
        if (!draw()) {
          img.onload = onload;
        } else {
          callback();
        }
      }

    };

    /**
     * Draw a Line
     *
     * @param {{
     *  x1: number
     *  y1: number
     *  x2: number
     *  y2: number
     *  mask: boolean | undefined
     *  closed: boolean | undefined
     *  fillStyle: string | undefined
     *  strokeStyle: string | undefined
     *  strokeWidth: number | undefined
     *  rounded: boolean | undefined
     *  shadowX: number | undefined
     *  shadowY: number | undefined
     *  shadowBlur: number | undefined
     *  shadowColor: string | undefined
     *  strokeWidth: number | undefined
     *  strokeCap: string | undefined
     *  strokeJoin: string | undefined
     *  opacity: number | undefined
     *  compositing: string | undefined
     * }} lineParams
     */
    enhancedContext.drawLine = function(lineParams){
      var l=2, lx, ly;

      // Draw each point
      ctx.beginPath();
      ctx.moveTo(lineParams.x1, lineParams.y1);
      while (true) {
        lx = lineParams['x' + l];
        ly = lineParams['y' + l];
        if (lx !== undefined && ly !== undefined) {
          ctx.lineTo(lx, ly);
          l += 1;
        } else {
          break;
        }
      }
      // Close path if chosen
      this.closePath(lineParams);
    };

    /**
     * Draw a Quad
     * @param {{
     *  x1: number
     *  y1: number
     *  x2: number
     *  y2: number
     *  cx0: number
     *  cy0: number
     *  cx1: number
     *  cy1: number
     *  mask: boolean | undefined
     *  closed: boolean | undefined
     *  fillStyle: string | undefined
     *  strokeStyle: string | undefined
     *  strokeWidth: number | undefined
     *  rounded: boolean | undefined
     *  shadowX: number | undefined
     *  shadowY: number | undefined
     *  shadowBlur: number | undefined
     *  shadowColor: string | undefined
     *  strokeWidth: number | undefined
     *  strokeCap: string | undefined
     *  strokeJoin: string | undefined
     *  opacity: number | undefined
     *  compositing: string | undefined
     * }} quadParams
     */
    enhancedContext.drawQuad = function(quadParams){
      var l = 2, lx, ly, lcx, lcy;

      // Draw each point
      ctx.beginPath();
      ctx.moveTo(quadParams.x1, quadParams.y1);
      while (true) {
        lx = quadParams['x' + l];
        ly = quadParams['y' + l];
        lcx = quadParams['cx' + (l-1)];
        lcy = quadParams['cy' + (l-1)];
        if (lx !== undefined && ly !== undefined && lcx !== undefined && lcy !== undefined) {
          ctx.quadraticCurveTo(lcx, lcy, lx, ly);
          l += 1;
        } else {
          break;
        }
      }
      // Close path if chosen
      this.closePath(quadParams);


    };

    /**
     * Draw a Rect
     *
     * @param {{
     *  x: number
     *  y: number
     *  height: number
     *  width: number
     *  mask: boolean | undefined
     *  closed: boolean | undefined
     *  fillStyle: string | undefined
     *  strokeStyle: string | undefined
     *  strokeWidth: number | undefined
     *  rounded: boolean | undefined
     *  shadowX: number | undefined
     *  shadowY: number | undefined
     *  shadowBlur: number | undefined
     *  shadowColor: string | undefined
     *  strokeWidth: number | undefined
     *  strokeCap: string | undefined
     *  strokeJoin: string | undefined
     *  opacity: number | undefined
     *  compositing: string | undefined
     *  inDegrees: boolean | undefined
     *  fromCenter: boolean | undefined
     *  angle: number | undefined
     *  toRad: number | undefined
     *  cornerRadius: number | undefined
     * }} rectParams
     */
    enhancedContext.drawRect = function(rectParams){
      var x1, y1, x2, y2, r;

      var pi = Math.PI;

      this.setDefaults(rectParams);
      this.positionShape(rectParams, rectParams.width, rectParams.height);
      ctx.beginPath();

      // Draw a rounded rectangle if chosen
      if (rectParams.cornerRadius) {
        rectParams.closed = true;
        x1 = rectParams.x - rectParams.width/2;
        y1 = rectParams.y - rectParams.height/2;
        x2 = rectParams.x + rectParams.width/2;
        y2 = rectParams.y + rectParams.height/2;
        r = rectParams.cornerRadius;
        // Prevent over-rounded corners
        if ((x2 - x1) - (2 * r) < 0) {
          r = (x2 - x1) / 2;
        }
        if ((y2 - y1) - (2 * r) < 0) {
          r = (y2 - y1) / 2;
        }
        ctx.moveTo(x1+r,y1);
        ctx.lineTo(x2-r,y1);
        ctx.arc(x2-r, y1+r, r, 3*pi/2, pi*2, false);
        ctx.lineTo(x2,y2-r);
        ctx.arc(x2-r, y2-r, r, 0, pi/2, false);
        ctx.lineTo(x1+r,y2);
        ctx.arc(x1+r, y2-r, r, pi/2, pi, false);
        ctx.lineTo(x1,y1+r);
        ctx.arc(x1+r, y1+r, r, pi, 3*pi/2, false);
      } else {
        ctx.rect(rectParams.x-rectParams.width/2, rectParams.y-rectParams.height/2, rectParams.width, rectParams.height);
      }
      ctx.restore();
      this.closePath(rectParams);

    };

    /**
     * Draw Text
     *
     * @param {{
     *  baseline: string | undefined
     *  align: string | undefined
     *  font: string
     *  text: string
     *  x: number
     *  y: number
     *  fillStyle: string | undefined
     *  strokeStyle: string | undefined
     *  strokeWidth: number | undefined
     *  rounded: boolean | undefined
     *  shadowX: number | undefined
     *  shadowY: number | undefined
     *  shadowBlur: number | undefined
     *  shadowColor: string | undefined
     *  strokeWidth: number | undefined
     *  strokeCap: string | undefined
     *  strokeJoin: string | undefined
     *  opacity: number | undefined
     *  compositing: string | undefined
     * }} textParams
     * @returns {enhancedContext}
     */
    enhancedContext.drawText = function(textParams){

      // Set text-specific properties
      ctx.textBaseline = textParams.baseline;
      ctx.textAlign = textParams.align;
      ctx.font = textParams.font;

      ctx.strokeText(textParams.text, textParams.x, textParams.y);
      ctx.fillText(textParams.text, textParams.x, textParams.y);
      return this;
    };

    /**
     * Use a custom draw method.
     *
     * @param {function} callback
     */
    enhancedContext.draw = function(callback){
      callback(ctx);
    };

    /**
     * Restore a canvas
     */
    enhancedContext.restore = function(){
      ctx.restore();
    };

    /**
     * Rotate the context
     * @param {{
     *  x: number
     *  y: number
     *  fromCenter: boolean
     *  inDegrees: boolean
     *  angle: number
     *  toRad: number
     *  }} rotateParams
     */
    enhancedContext.rotate = function(rotateParams){
      this.positionShape(rotateParams, 0, 0);
    };

    /**
     * Save the context
     */
    enhancedContext.save = function(){
      ctx.save();
    };

    /**
     * Translate a context
     *
     * @param {{x: number y: number }} params
     */
    enhancedContext.translate = function(params){
      ctx.save();
      ctx.translate(params.x, params.y);
    };

    /**
     * Scale a canvas
     *
     * @param {{x:number y: number scaleX: number scaleY: number}} params
     */
    enhancedContext.scale = function(params){
      ctx.save();
      ctx.translate(params.x, params.y);
      ctx.scale(params.scaleX, params.scaleY);
      ctx.translate(-params.x, -params.y);
    };

    /**
     * Set specific pixels in a context
     *
     * @param {{
     *  x: number
     *  y: number
     *  width: number
     *  height: number
     *  fromCenter: boolean | undefined
     *  inDegrees: boolean | undefined
     *  angle: number | undefined
     *  toRad: number | undefined
     *  each: function | undefined
     * }} params
     */
    enhancedContext.setPixels = function(params) {
      var i,imgData, data, len, px = {};

      if (!params.x && !params.y && !params.width && !params.height) {
        params.width = canvas.width;
        params.height = canvas.height;
        params.x = params.width / 2;
        params.y = params.height / 2;
      }
      this.positionShape(params, params.width, params.height);
      imgData = ctx.getImageData(params.x - params.width / 2, params.y - params.height / 2, params.width, params.height);
      data = imgData.data;
      len = data.length;

      // Loop through pixels with "each" method
      if (params.each !== undefined) {
        for (i = 0; i < len; i += 4) {
          px.index = i / 4;
          px.r = data[i];
          px.g = data[i + 1];
          px.b = data[i + 2];
          px.a = data[i + 3];
          params.each.call(canvas, px);
          data[i] = px.r;
          data[i + 1] = px.g;
          data[i + 2] = px.b;
          data[i + 3] = px.a;
        }
      }
      // Put pixels on canvas
      ctx.putImageData(imgData, params.x - params.width / 2, params.y - params.height / 2);
      ctx.restore();
    };

    /**
     * Measure the width of a line of text.
     * @param {{font: string text: string}} params
     * @returns {TextMetrics}
     */
    enhancedContext.measureText = function(params){
      ctx.font = params.font;
      return ctx.measureText(params.text);
    };

    /**
     * Get the pixel data of a given position OR if the given position is transparent
     *
     * @param {number} x The x location of the pixel
     * @param {number} y The y location of the pixel
     * @param {number} h The height of the search area
     * @param {number} w The width of the search area
     * @param {boolean} t Whether or not to only flag for transparency
     * @returns {boolean | CanvasPixelArray}  True or false if the transparency flag is set, otherwise it returns the pixel data.
     */
    enhancedContext.atPixel = function(x,y,h,w,t){
      var img = ctx.getImageData(x, y, w, h);
      var data = img.data;
      //data = [r,g,b,a] at pixel
      if (t) //if checking for transparency
      {
        for (var a = 3; a < data.length; a += 4) {
          if (data[a] > 0) //if alpha not transparent
          {
            return (true);
          }
        }
        return (false);
      }
      // Otherwise, return the pixel data
      return (data);
    };

    return enhancedContext;
  };
})(jQuery);