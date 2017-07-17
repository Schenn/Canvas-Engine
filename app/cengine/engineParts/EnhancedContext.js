import {properties} from "./propertyDefinitions";

/**
 * Construct an Enhanced Context from a canvas
 *
 * @class
 * @memberof Canvas
 * @property {CanvasRenderingContext2D} ctx
 */
class EnhancedContext {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas){
    Object.defineProperties(this, {
      ctx: properties.lockedProperty(canvas.getContext('2d'))
    });
  }

  /**
   * Clear a space from the context
   * @param {GeneralTypes~ClearInfo} clearInfo
   */
  clear(clearInfo){
    let canvas = this.ctx.canvas;
    // Clear entire canvas
    if (!clearInfo.width && !clearInfo.height) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      if(clearInfo.fromCenter) {
        this.ctx.clearRect(
            clearInfo.x - clearInfo.width / 2,
            clearInfo.y - clearInfo.height / 2,
            clearInfo.width,
            clearInfo.height
        );
      } else {
        this.ctx.clearRect(clearInfo.x, clearInfo.y, clearInfo.width, clearInfo.height);
      }
    }
  }

  /**
   * Set the default context properties
   *  Just because a property CAN be undefined doesn't mean it should be.
   *  This method is used to prepare context with the basic values that the actual draw method will need
   *  Be sure to send all of the properties you need to do the draw.
   *
   *  @param {object} defaultParams The default parameters used by most drawing methods.
   *  @param {string} [defaultParams.fillStyle]
   *  @param {string} [defaultParams.strokeStyle]
   *  @param {boolean} [defaultParams.rounded]
   *  @param {number} [defaultParams.shadowX]
   *  @param {number} [defaultParams.shadowY]
   *  @param {number} [defaultParams.shadowBlur]
   *  @param {string} [defaultParams.shadowColor]
   *  @param {number} [defaultParams.strokeWidth]
   *  @param {string} [defaultParams.strokeCap]
   *  @param {string} [defaultParams.strokeJoin]
   *  @param {number} [defaultParams.opacity]
   *  @param {string} [defaultParams.compositing]
   *
   */
  setDefaults(defaultParams){

    this.ctx.fillStyle = defaultParams.fillStyle;
    this.ctx.strokeStyle = defaultParams.strokeStyle;
    this.ctx.lineWidth = defaultParams.strokeWidth;
    // Set rounded corners for paths
    if (defaultParams.rounded) {
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    } else {
      this.ctx.lineCap = defaultParams.strokeCap;
      this.ctx.lineJoin = defaultParams.strokeJoin;
    }
    this.ctx.shadowOffsetX = defaultParams.shadowX;
    this.ctx.shadowOffsetY = defaultParams.shadowY;
    this.ctx.shadowBlur = defaultParams.shadowBlur;
    this.ctx.shadowColor = defaultParams.shadowColor;
    this.ctx.globalAlpha = defaultParams.opacity;
    this.ctx.globalCompositeOperation = defaultParams.compositing;
  }

  /**
   * Close a path belonging to a shape
   *
   * @param {object} closePathParams
   * @param {boolean} [closePathParams.mask]
   * @param {boolean} [closePathParams.closed]
   */
  closePath(closePathParams){
    // Mask if chosen
    if (closePathParams.mask) {
      this.ctx.save();
      this.ctx.clip();
    }
    if (closePathParams.closed) {
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  /**
   * Convert angles to a respective degree
   * @param {object} angleParams
   * @param {boolean} [angleParams.inDegrees]
   * @returns {number}
   */
  convertAngles(angleParams){
    return angleParams.inDegrees ? Math.PI/180 : 1;
  }

  /**
   * position the context for rendering
   *
   *  If angle is provided, you also have to provide toRad
   * @param {object} shapeParams
   * @param {number} shapeParams.x
   * @param {number} shapeParams.y
   * @param {boolean} [shapeParams.fromCenter]
   * @param {boolean} [shapeParams.inDegrees]
   * @param {number} [shapeParams.angle]
   * @param {number} [shapeParams.toRad]
   *
   * @param {number} width
   * @param {number} height
   */
  positionShape(shapeParams, width, height) {

    shapeParams.toRad = this.convertAngles(shapeParams);
    this.ctx.save();

    // Always rotate from center
    if (!shapeParams.fromCenter) {
      shapeParams.x += width/2;
      shapeParams.y += height/2;
    }

    // Rotate only if specified
    if (shapeParams.angle) {
      this.ctx.translate(shapeParams.x, shapeParams.y);
      this.ctx.rotate(shapeParams.angle*shapeParams.toRad);
      this.ctx.translate(-shapeParams.x, -shapeParams.y);
    }

  }

  /**
   * Draw an Arc
   *
   * @param {object} arcParams
   * @param {number} arcParams.radius
   * @param {number} arcParams.start
   * @param {number} arcParams.toRad
   * @param {number} arcParams.x
   * @param {number} arcParams.y
   * @param {boolean} [arcParams.inDegrees]
   * @param {number} [arcParams.end]
   * @param {boolean} [arcParams.ccw]
   * @param {boolean} [arcParams.mask]
   * @param {boolean} [arcParams.closed]
   * @param {number} [arcParams.angle]
   * @param {number} [arcParams.toRad]
   * @param {boolean} [arcParams.inDegrees]
   * @param {boolean} [arcParams.fromCenter]
   */
  drawArc(arcParams){

    let pi = Math.PI;

    if (!arcParams.inDegrees && arcParams.end === 360) {
      arcParams.end = pi * 2;
    }

    this.positionShape(arcParams, arcParams.radius*2, arcParams.radius*2);
    // Draw arc
    this.ctx.beginPath();
    this.ctx.arc(arcParams.x, arcParams.y, arcParams.radius, (arcParams.start*arcParams.toRad)-(pi/2), (arcParams.end*arcParams.toRad)-(pi/2), arcParams.ccw);
    // Close path if chosen
    this.ctx.restore();
    this.closePath(arcParams);
  }

  /**
   * Draw a Bezier curve
   * @param {object} bezierParams
   * @param {number} bezierParams.x1   - There can be any number of Xs, Ys, CXs and CYs. Just give each their own key -> value
   * @param {number} bezierParams.y1
   * @param {number} bezierParams.x2
   * @param {number} bezierParams.y2
   * @param {number} bezierParams.cx0
   * @param {number} bezierParams.cy0
   * @param {number} bezierParams.cx1
   * @param {number} bezierParams.cy1
   * @param {boolean} [bezierParams.mask]
   * @param {boolean} [bezierParams.closed]
   * @param {string} [bezierParams.fillStyle]
   * @param {string} [bezierParams.strokeStyle]
   * @param {boolean} [bezierParams.rounded]
   * @param {number} [bezierParams.shadowX]
   * @param {number} [bezierParams.shadowY]
   * @param {number} [bezierParams.shadowBlur]
   * @param {string} [bezierParams.shadowColor]
   * @param {number} [bezierParams.strokeWidth]
   * @param {string} [bezierParams.strokeCap]
   * @param {string} [bezierParams.strokeJoin]
   * @param {number} [bezierParams.opacity]
   * @param {string} [bezierParams.compositing]
   *
   */
  drawBezier(bezierParams){
    let l = 2, lc = 1,
        lx, ly,
        lcx1, lcy1,
        lcx2, lcy2;

    this.setDefaults(bezierParams);

    // Draw each point
    this.ctx.beginPath();
    this.ctx.moveTo(bezierParams.x1, bezierParams.y1);
    while (true) {
      lx = bezierParams['x' + l];
      ly = bezierParams['y' + l];
      lcx1 = bezierParams['cx' + lc];
      lcy1 = bezierParams['cy' + lc];
      lcx2 = bezierParams['cx' + (lc+1)];
      lcy2 = bezierParams['cy' + (lc+1)];
      if (lx !== undefined && ly !== undefined && lcx1 !== undefined && lcy1 !== undefined && lcx2 !== undefined && lcy2 !== undefined) {
        this.ctx.bezierCurveTo(lcx1, lcy1, lcx2, lcy2, lx, ly);
        l += 1;
        lc += 2;
      } else {
        break;
      }
    }
    // Close path if chosen
    this.closePath(bezierParams);
  }

  /**
   * Draw an ellipse
   * @param {object} ellipseParams
   * @param {number} ellipseParams.x
   * @param {number} ellipseParams.y
   * @param {number} ellipseParams.width
   * @param {number} ellipseParams.height
   * @param {boolean} [ellipseParams.mask]
   * @param {boolean} [ellipseParams.closed]
   * @param {string} [ellipseParams.fillStyle]
   * @param {string} [ellipseParams.strokeStyle]
   * @param {boolean} [ellipseParams.rounded]
   * @param {number} [ellipseParams.shadowX]
   * @param {number} [ellipseParams.shadowY]
   * @param {number} [ellipseParams.shadowBlur]
   * @param {string} [ellipseParams.shadowColor]
   * @param {number} [ellipseParams.strokeWidth]
   * @param {string} [ellipseParams.strokeCap]
   * @param {string} [ellipseParams.strokeJoin]
   * @param {number} [ellipseParams.opacity]
   * @param {string} [ellipseParams.compositing]
   * @param {number} [ellipseParams.angle]
   * @param {number} [ellipseParams.toRad]
   * @param {boolean} [ellipseParams.inDegrees]
   * @param {boolean} [ellipseParams.fromCenter]
   */
  drawEllipse(ellipseParams){
    let controlW = ellipseParams.width * 4/3;

    this.setDefaults(ellipseParams);
    this.positionShape(ellipseParams, ellipseParams.width, ellipseParams.height);

    // Create ellipse
    this.ctx.beginPath();
    this.ctx.moveTo(
        ellipseParams.x,
        ellipseParams.y - ellipseParams.height / 2
    );
    // Left side
    this.ctx.bezierCurveTo(
        ellipseParams.x - controlW / 2,
        ellipseParams.y - ellipseParams.height / 2,
        ellipseParams.x - controlW / 2,
        ellipseParams.y + ellipseParams.height / 2,
        ellipseParams.x,
        ellipseParams.y + ellipseParams.height / 2
    );
    // Right side
    this.ctx.bezierCurveTo(
        ellipseParams.x + controlW / 2,
        ellipseParams.y + ellipseParams.height / 2,
        ellipseParams.x + controlW / 2,
        ellipseParams.y - ellipseParams.height / 2,
        ellipseParams.x,
        ellipseParams.y - ellipseParams.height / 2
    );
    this.ctx.restore();
    this.closePath(ellipseParams);
  }

  /**
   * Draw an image
   *
   * @param {object} imageParams
   * @param {Image | string} imageParams.source
   * @param {number} imageParams.x
   * @param {number} imageParams.y
   * @param {number} [imageParams.sx]
   * @param {number} [imageParams.sy]
   * @param {number} [imageParams.sWidth]
   * @param {number} [imageParams.sHeight]
   * @param {number} [imageParams.width]
   * @param {number} [imageParams.height]
   * @param {boolean} [imageParams.cropFromCenter]
   * @param {function} [imageParams.load]
   * @param {boolean} [imageParams.mask]
   * @param {boolean} [imageParams.closed]
   * @param {string} [imageParams.fillStyle]
   * @param {string} [imageParams.strokeStyle]
   * @param {boolean} [imageParams.rounded]
   * @param {number} [imageParams.shadowX]
   * @param {number} [imageParams.shadowY]
   * @param {number} [imageParams.shadowBlur]
   * @param {string} [imageParams.shadowColor]
   * @param {number} [imageParams.strokeWidth]
   * @param {string} [imageParams.strokeCap]
   * @param {string} [imageParams.strokeJoin]
   * @param {number} [imageParams.opacity]
   * @param {string} [imageParams.compositing]
   * @param {number} [imageParams.angle]
   * @param {number} [imageParams.toRad]
   * @param {boolean} [imageParams.inDegrees]
   * @param {boolean} [imageParams.fromCenter]
   *
   */
  drawImage(imageParams){
    let img = new Image(),scaleFac;
    // Use specified element, if not, a source URL
    if (imageParams.source.src) {
      img = imageParams.source;
    } else if (imageParams.source) {
      img.src = imageParams.source;
    }
    let self = this;
    // Draw image function
    let draw = function(){
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
        if (typeof(imageParams.sx) === "undefined") {
          if (imageParams.cropFromCenter) {
            imageParams.sx = img.width / 2;
          } else {
            imageParams.sx = 0;
          }
        }
        if (typeof(imageParams.sy) === "undefined") {
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
        self.positionShape(imageParams, imageParams.width, imageParams.height);
        self.ctx.drawImage(
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
        self.ctx.restore();
        return true;
      } else {
        return false;
      }
    };
    // Run callback function
    function callback() {
      if (typeof(imageParams.load) === "function") {
        imageParams.load.call(self);
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

  }

  /**
   * Draw a Line
   *
   * @param {object} lineParams
   * @param {number} lineParams.x1 - You can include any number of {coords}
   * @param {number} lineParams.y1
   * @param {number} lineParams.x2
   * @param {number} lineParams.y2
   * @param {boolean} [lineParams.mask]
   * @param {boolean} [lineParams.closed]
   * @param {string} [lineParams.fillStyle]
   * @param {string} [lineParams.strokeStyle]
   * @param {boolean} [lineParams.rounded]
   * @param {number} [lineParams.shadowX]
   * @param {number} [lineParams.shadowY]
   * @param {number} [lineParams.shadowBlur]
   * @param {string} [lineParams.shadowColor]
   * @param {number} [lineParams.strokeWidth]
   * @param {string} [lineParams.strokeCap]
   * @param {string} [lineParams.strokeJoin]
   * @param {number} [lineParams.opacity]
   * @param {string} [lineParams.compositing]
   *
   */
  drawLine(lineParams){
    let l=2, lx, ly;

    // Draw each point
    this.ctx.beginPath();
    this.ctx.moveTo(lineParams.x1, lineParams.y1);
    while (true) {
      lx = lineParams['x' + l];
      ly = lineParams['y' + l];
      if (lx !== undefined && ly !== undefined) {
        this.ctx.lineTo(lx, ly);
        l += 1;
      } else {
        break;
      }
    }
    // Close path if chosen
    this.closePath(lineParams);
  }


  /**
   * Draw a Quad
   * @param {object} quadParams
   * @param {number} quadParams.x1 - You can include any number of x and y's as long as there is a correlating cx and cy
   * @param {number} quadParams.y1
   * @param {number} quadParams.x2
   * @param {number} quadParams.y2
   * @param {number} quadParams.cx0
   * @param {number} quadParams.cy0
   * @param {number} quadParams.cx1
   * @param {number} quadParams.cy1
   * @param {boolean} [quadParams.mask]
   * @param {boolean} [quadParams.closed]
   * @param {string} [quadParams.fillStyle]
   * @param {string} [quadParams.strokeStyle]
   * @param {boolean} [quadParams.rounded]
   * @param {number} [quadParams.shadowX]
   * @param {number} [quadParams.shadowY]
   * @param {number} [quadParams.shadowBlur]
   * @param {string} [quadParams.shadowColor]
   * @param {number} [quadParams.strokeWidth]
   * @param {string} [quadParams.strokeCap]
   * @param {string} [quadParams.strokeJoin]
   * @param {number} [quadParams.opacity]
   * @param {string} [quadParams.compositing]
   */
  drawQuad(quadParams){
    let l = 2, lx, ly, lcx, lcy;

    // Draw each point
    this.ctx.beginPath();
    this.ctx.moveTo(quadParams.x1, quadParams.y1);
    while (true) {
      lx = quadParams['x' + l];
      ly = quadParams['y' + l];
      lcx = quadParams['cx' + (l-1)];
      lcy = quadParams['cy' + (l-1)];
      if (lx !== undefined && ly !== undefined && lcx !== undefined && lcy !== undefined) {
        this.ctx.quadraticCurveTo(lcx, lcy, lx, ly);
        l += 1;
      } else {
        break;
      }
    }
    // Close path if chosen
    this.closePath(quadParams);
  }

  /**
   * Draw a Rect
   *
   * @param {object} rectParams
   * @param {number} rectParams.x
   * @param {number} rectParams.y
   * @param {number} rectParams.height
   * @param {number} rectParams.width
   * @param {number} [rectParams.cornerRadius]
   * @param {boolean} [rectParams.mask]
   * @param {boolean} [rectParams.closed]
   * @param {string} [rectParams.fillStyle]
   * @param {string} [rectParams.strokeStyle]
   * @param {boolean} [rectParams.rounded]
   * @param {number} [rectParams.shadowX]
   * @param {number} [rectParams.shadowY]
   * @param {number} [rectParams.shadowBlur]
   * @param {string} [rectParams.shadowColor]
   * @param {number} [rectParams.strokeWidth]
   * @param {string} [rectParams.strokeCap]
   * @param {string} [rectParams.strokeJoin]
   * @param {number} [rectParams.opacity]
   * @param {string} [rectParams.compositing]
   */
  drawRect(rectParams){
    let x1, y1, x2, y2, r;

    let pi = Math.PI;

    this.setDefaults(rectParams);
    this.positionShape(rectParams, rectParams.width, rectParams.height);
    this.ctx.beginPath();

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
      this.ctx.moveTo(x1+r,y1);
      this.ctx.lineTo(x2-r,y1);
      this.ctx.arc(x2-r, y1+r, r, 3*pi/2, pi*2, false);
      this.ctx.lineTo(x2,y2-r);
      this.ctx.arc(x2-r, y2-r, r, 0, pi/2, false);
      this.ctx.lineTo(x1+r,y2);
      this.ctx.arc(x1+r, y2-r, r, pi/2, pi, false);
      this.ctx.lineTo(x1,y1+r);
      this.ctx.arc(x1+r, y1+r, r, pi, 3*pi/2, false);
    } else {
      this.ctx.rect(rectParams.x-rectParams.width/2, rectParams.y-rectParams.height/2, rectParams.width, rectParams.height);
    }
    this.ctx.restore();
    this.closePath(rectParams);

  }

  /**
   * Draw Text
   *
   * @param {object} textParams
   * @param {string} textParams.font
   * @param {string} textParams.text
   * @param {number} textParams.x
   * @param {number} textParams.y
   * @param {string} [textParams.baseline]
   * @param {string} [textParams.align]
   * @param {string} [textParams.fillStyle]
   * @param {string} [textParams.strokeStyle]
   * @param {boolean} [textParams.rounded]
   * @param {number} [textParams.shadowX]
   * @param {number} [textParams.shadowY]
   * @param {number} [textParams.shadowBlur]
   * @param {string} [textParams.shadowColor]
   * @param {number} [textParams.strokeWidth]
   * @param {string} [textParams.strokeCap]
   * @param {string} [textParams.strokeJoin]
   * @param {number} [textParams.opacity]
   * @param {string} [textParams.compositing]
   * @inner
   * @returns {Canvas.enhancedContext}
   */
  drawText(textParams){

    // Set text-specific properties
    this.ctx.textBaseline = textParams.baseline;
    this.ctx.textAlign = textParams.align;
    this.ctx.font = textParams.font;

    let words = textParams.text.split(' ');
    let line = '';
    let x = textParams.x;
    let y = textParams.y;
    let height = this.ctx.measureText("MWO").width + 2;
    let maxWidth = (typeof textParams.width !== "undefined" && textParams.width > 0) ?
        textParams.width :
        this.ctx.canvas.width;

    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = this.ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.ctx.strokeText(line, x, y);
        this.ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += height;
      }
      else {
        line = testLine;
      }
    }
    this.ctx.strokeText(line, x, y);
    this.ctx.fillText(line, x, y);
    return this;
  }

  /**
   * Use a custom draw method.
   *
   * @param {function} callback
   */
  draw(callback){
    callback(this.ctx);
  }

  /**
   * Restore a canvas
   */
  restore(){
    this.ctx.restore();
  }

  /**
   * Rotate the context
   * @param {object} rotateParams
   * @param {number} rotateParams.x
   * @param {number} rotateParams.y
   * @param {boolean} [rotateParams.fromCenter]
   * @param {boolean} [rotateParams.inDegrees]
   * @param {number} [rotateParams.angle]
   * @param {number} [rotateParams.toRad]

   */
  rotate(rotateParams){
    this.positionShape(rotateParams, 0, 0);
  }

  /**
   * Save the context
   */
  save(){
    this.ctx.save();
  }

  /**
   * Translate a context
   *
   * @param {GeneralTypes~coords} params
   */
  translate(params){
    this.ctx.save();
    this.ctx.translate(params.x, params.y);
  }

  /**
   * Scale a canvas
   *
   * @param {object} params
   * @param {number} params.x
   * @param {number} params.y
   * @param {number} params.scaleX
   * @param {number} params.scaleY
   */
  scale(params){
    this.ctx.save();
    this.ctx.translate(params.x, params.y);
    this.ctx.scale(params.scaleX, params.scaleY);
    this.ctx.translate(-params.x, -params.y);
  }

  /**
   * Set specific pixels in a context
   * @param {object} params
   * @param {number} params.x
   * @param {number} params.y
   * @param {number} params.width
   * @param {number} params.height
   * @param {boolean} [params.fromCenter]
   * @param {boolean} [params.inDegrees]
   * @param {number} [params.angle]
   * @param {number} [params.toRad]
   * @param {function} [params.each]
   * }} params
   */
  setPixels(params) {
    let i,imgData, data, len, px = {};

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
    if (typeof(params.each) !== "undefined") {
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
    this.ctx.putImageData(imgData, params.x - params.width / 2, params.y - params.height / 2);
    this.ctx.restore();
  }

  /**
   * Measure the width of a line of text.
   * @param {object} params
   * @param {string} params.font
   * @param {string} params.text
   * @returns {TextMetrics}
   */
  measureText(params){
    this.ctx.font = params.font;
    return this.ctx.measureText(params.text);
  }

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
  atPixel(x,y,h,w,t){
    let img = this.ctx.getImageData(x, y, w, h);
    let data = img.data;
    //data = [r,g,b,a] at pixel
    //if checking for transparency
    if (t) {
      for (let a = 3; a < data.length; a += 4) {
        //if alpha not transparent
        if (data[a] > 0) {
          return (true);
        }
      }
      return (false);
    }
    // Otherwise, return the pixel data
    return (data);
  }

  /**
   * Get a canvas as a jpeg
   * @function
   * @param {string} type
   * @memberof external:jQuery.fn
   * @alias getCanvasImage
   * @returns {string}
   */
  getCanvasImage(type) {
    if (!this.ctx.canvas.toDataURL) {return null;}
    if (type === undefined) {
      type = 'image/png';
    } else {
      type = type
      .replace(/^([a-z]+)$/gi, 'image/$1')
      .replace(/jpg/gi, 'jpeg');
    }
    return this.ctx.canvas.toDataURL(type);
  }

  /**
   * Generates a CanvasGradient
   *
   * @param {object} args
   * @param {number} args.x1
   * @param {number} args.y1
   * @param {number} args.x2
   * @param {number} args.y2
   * @param {...string} args.c1  // Each Color (c) gets its own index (args.c1, args.c2, args.c3)
   * @param {...number} args.s1  // Each Color Stop (s) gets its own index which must equal the color index.
   * @memberof external:jQuery.fn
   * @alias createGradient
   * @returns {CanvasGradient}
   */
  createGradient(args) {
    let params = Object.assign({}, args),
        gradient, percent,
        stops = 0,
        i = 1;

    // Create radial gradient if chosen
    if (params.r1 !== null || params.r2 !== null) {
      gradient = this.ctx.createRadialGradient(params.x1, params.y1, params.r1, params.x2, params.y2, params.r2);
    } else {
      gradient = this.ctx.createLinearGradient(params.x1, params.y1, params.x2, params.y2);
    }

    // Count number of color stops
    while (typeof(params['c' + i]) !== undefined) {
      stops += 1;
      i += 1;
    }

    // Calculate color stop percentages if absent
    for (i=1; i<=stops; i+=1) {
      percent = Math.round(100 / (stops-1) * (i-1)) / 100;
      if (params['s' + i] === undefined) {
        params['s' + i] = percent;
      }
      gradient.addColorStop(params['s' + i], params['c' + i]);
    }
    return gradient;
  }

  /**
   * Create a Canvas Pattern
   *
   * @param {object} args
   * @param {Image | string} args.source
   * @param {string} args.repeat
   * @param {function} [args.load]
   * @memberof external:jQuery.fn
   * @alias pattern
   * @function
   * @returns {CanvasPattern}
   */
  createPattern(args) {
    let params = Object.assign({}, args),
        img = new Image(),
        pattern;
    // Use specified element, if not, a source URL
    if (params.source.src) {
      img = params.source;
    } else if (params.source) {
      img.src = params.source;
    }

    // Create pattern
    function create() {
      if (img.complete) {
        // Create pattern
        pattern = this.ctx.createPattern(img, params.repeat);
        return true;
      } else {
        return false;
      }

    }
    // Run callback function
    function callback() {
      if (params.load) {
        params.load.call(this.ctx.canvas, pattern);
      }
    }
    function onload() {
      create();
      callback();
    }
    // Draw when image is loaded (if chosen)
    if (!img.complete && params.load) {
      img.onload = onload;
    } else {
      // Draw image if loaded
      if (!create()) {
        img.onload = onload;
      } else {
        callback();
      }
    }
    return pattern;
  }

  /**
   * Add a Canvas to the top of the stack.
   *  Sets the z-index of the canvas so that if they are absolutely positioned, they actually stack.
   *
   * @param {number} z
   * @memberof external:jQuery.fn
   * @alias addZLayer
   * @returns {HTMLElement}
   */
  addZLayer(z){
    let tag = 'zLayer' + z;
    let canvas = document.createElement('canvas');
    canvas.setAttribute("id", tag);
    canvas.setAttribute("height", this.ctx.canvas.getAttribute("height"));
    canvas.setAttribute("width", this.ctx.canvas.getAttribute("width"));
    canvas.style['z-index'] = z;
    this.ctx.canvas.parentNode.appendChild(canvas);
    return canvas;
  }

  /**
   * Enlarge a canvas or image to a size relative to it's parent container
   * @example
   *  // make 50% of parent container
   * ctx.maximize(50);
   *
   * @memberof external:jQuery.fn
   * @alias maximize
   *
   * @param {number} modifier A percentage value to derive the relative size. Default 100%
   */
  maximize(modifier = 100){
    // Divide the modifier by 100, if there is no modifier set it to the default
    let mod = modifier / 100;
    let parent = this.ctx.canvas.parentNode;
    this.ctx.canvas.setAttribute("height", Math.ceil(parent.clientHeight * mod));
    this.ctx.canvas.setAttribute("width", Math.ceil(parent.clientHeight * mod));
  }

}

export const getEnhancedContext = function(canvas){
  return new EnhancedContext(canvas);
};