/**
 * Created by schenn on 4/15/16.
 */
(function($){

  $.fn.getEnhancedContext = function(){

    var ctx= $(this)[0].getContext('2d');
    var canvas = $(this)[0];
    
    var enhancedContext = {};

    enhancedContext.setDefaults = function(renderer){
      ctx.fillStyle = renderer.fillStyle;
      ctx.strokeStyle = renderer.strokeStyle;
      ctx.lineWidth = renderer.strokeWidth;
      // Set rounded corners for paths
      if (renderer.rounded) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else {
        ctx.lineCap = renderer.strokeCap;
        ctx.lineJoin = renderer.strokeJoin;
      }
      ctx.shadowOffsetX = renderer.shadowX;
      ctx.shadowOffsetY = renderer.shadowY;
      ctx.shadowBlur = renderer.shadowBlur;
      ctx.shadowColor = renderer.shadowColor;
      ctx.globalAlpha = renderer.opacity;
      ctx.globalCompositeOperation = renderer.compositing;
    };

    enhancedContext.clear = function(clearInfo){
      // Clear entire canvas
      if (!clearInfo.width && !clearInfo.height) {
        ctx.clearRect(0, 0, this[e].width, this[e].height);
      } else {
        ctx.clearRect(clearInfo.x-clearInfo.width/2, clearInfo.y-clearInfo.height/2, clearInfo.width, clearInfo.height);
      }
    };

    enhancedContext.closePath = function(renderer){
      // Mask if chosen
      if (renderer.mask) {
        ctx.save();
        ctx.clip();
      }
      if (renderer.closed) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    };

    enhancedContext.convertAngles = function(renderer) {
      return renderer.inDegrees ? Math.PI/180 : 1;
    };

    enhancedContext.positionShape = function(renderer, width, height) {

      renderer.toRad = this.convertAngles(renderer);
      ctx.save();

      // Always rotate from center
      if (!renderer.fromCenter) {
        renderer.x += width/2;
        renderer.y += height/2;
      }

      // Rotate only if specified
      if (renderer.angle) {
        ctx.translate(renderer.x, renderer.y);
        ctx.rotate(renderer.angle*renderer.toRad);
        ctx.translate(-renderer.x, -renderer.y);
      }

    };

    enhancedContext.drawArc = function(renderer){

      var pi = Math.PI;

      if (!renderer.inDegrees && renderer.end === 360) {
        renderer.end = pi * 2;
      }

      this.positionShape(ctx, renderer, renderer.radius*2, renderer.radius*2);
      // Draw arc
      ctx.beginPath();
      ctx.arc(renderer.x, renderer.y, renderer.radius, (renderer.start*renderer.toRad)-(pi/2), (renderer.end*renderer.toRad)-(pi/2), renderer.ccw);
      // Close path if chosen
      ctx.restore();
      this.closePath(ctx, renderer);
    };

    enhancedContext.drawBezier = function(renderer){
        var l = 2, lc = 1,
        lx, ly,
        lcx1, lcy1,
        lcx2, lcy2;

        this.setDefaults(renderer);

        // Draw each point
        ctx.beginPath();
        ctx.moveTo(renderer.x1, renderer.y1);
        while (true) {
          lx = renderer['x' + l];
          ly = renderer['y' + l];
          lcx1 = renderer['cx' + lc];
          lcy1 = renderer['cy' + lc];
          lcx2 = renderer['cx' + (lc+1)];
          lcy2 = renderer['cy' + (lc+1)];
          if (lx !== undefined && ly !== undefined && lcx1 !== undefined && lcy1 !== undefined && lcx2 !== undefined && lcy2 !== undefined) {
            ctx.bezierCurveTo(lcx1, lcy1, lcx2, lcy2, lx, ly);
            l += 1;
            lc += 2;
          } else {
            break;
          }
        }
        // Close path if chosen
        this.closePath(ctx, renderer);
    };

    enhancedContext.drawEllipse = function(renderer){
      var controlW = renderer.width * 4/3;

        this.setDefaults(renderer);
        this.positionShape(renderer, renderer.width, renderer.height);

        // Create ellipse
        ctx.beginPath();
        ctx.moveTo(renderer.x, renderer.y-renderer.height/2);
        // Left side
        ctx.bezierCurveTo(renderer.x-controlW/2, renderer.y-renderer.height/2, renderer.x-controlW/2, renderer.y+renderer.height/2, renderer.x, renderer.y+renderer.height/2);
        // Right side
        ctx.bezierCurveTo(renderer.x+controlW/2, renderer.y+renderer.height/2, renderer.x+controlW/2, renderer.y-renderer.height/2, renderer.x, renderer.y-renderer.height/2);
        ctx.restore();
        this.closePath(ctx, renderer);
    };


    enhancedContext.drawImage = function(renderer){
      var elem, img = new Image(),scaleFac;
      // Use specified element, if not, a source URL
      if (renderer.source.src) {
        img = renderer.source;
      } else if (renderer.source) {
        img.src = renderer.source;
      }

      // Draw image function
      function draw() {
        if (img.complete) {
          scaleFac = (img.width / img.height);

          // Show whole image if no cropping region is specified
          renderer.sWidth = renderer.sWidth || img.width;
          renderer.sHeight = renderer.sHeight || img.height;
          // Ensure cropped region is not bigger than image
          if (renderer.sWidth > img.width) {
            renderer.sWidth = img.width;
          }
          if (renderer.sHeight > img.height) {
            renderer.sHeight = img.height;
          }
          // Destination width/height should equal source unless specified
          if (renderer.width === 0 && renderer.sWidth !== img.width) {
            renderer.width = renderer.sWidth;
          }
          if (renderer.height === 0 && renderer.sHeight !== img.height) {
            renderer.height = renderer.sHeight;
          }

          // If no sx/sy specified, use center of image (or top-left corner if cropFromCenter is false)
          if (renderer.sx === null) {
            if (renderer.cropFromCenter) {
              renderer.sx = img.width / 2;
            } else {
              renderer.sx = 0;
            }
          }
          if (renderer.sy === null) {
            if (renderer.cropFromCenter) {
              renderer.sy = img.height / 2;
            } else {
              renderer.sy = 0;
            }
          }

          // Crop from top-left corner if specified (rather than center)
          if (!renderer.cropFromCenter) {
            renderer.sx += renderer.sWidth/2;
            renderer.sy += renderer.sHeight/2;
          }

          // Ensure cropped region does not extend image boundary
          if ((renderer.sx - renderer.sWidth/2) < 0) {
            renderer.sx = renderer.sWidth/2;
          }
          if ((renderer.sx + renderer.sWidth/2) > img.width) {
            renderer.sx = img.width - renderer.sWidth / 2;
          }
          if ((renderer.sy - renderer.sHeight/2) < 0) {
            renderer.sy = renderer.sHeight / 2;
          }
          if ((renderer.sy + renderer.sHeight/2) > img.height) {
            renderer.sy = img.height - renderer.sHeight / 2;
          }

          // If only width is present
          if (renderer.width && !renderer.height) {
            renderer.height = renderer.width / scaleFac;
            // If only height is present
          } else if (!renderer.width && renderer.height) {
            renderer.width = renderer.height * scaleFac;
            // If width and height are both absent
          } else if (!renderer.width && !renderer.height) {
            renderer.width = img.width;
            renderer.height = img.height;
          }

          // Draw image
          this.positionShape(renderer, renderer.width, renderer.height);
          ctx.drawImage(
            img,
            renderer.sx - renderer.sWidth / 2,
            renderer.sy - renderer.sHeight / 2,
            renderer.sWidth,
            renderer.sHeight,
            renderer.x - renderer.width / 2,
            renderer.y - renderer.height / 2,
            renderer.width,
            renderer.height
          );
          ctx.restore();
          return true;
        } else {
          return false;
        }
      }
      // Run callback function
      function callback() {
        if (typeof(renderer.load) === "function") {
          renderer.load.call(enhancedContext);
        }
      }
      // On load function
      function onload() {
        draw();
        callback();
      }

      // Draw when image is loaded (if chosen)
      if (!img.complete && renderer.load) {
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

    enhancedContext.drawLine = function(renderer){
      var l=2, lx, ly;

      // Draw each point
      ctx.beginPath();
      ctx.moveTo(renderer.x1, renderer.y1);
      while (true) {
        lx = renderer['x' + l];
        ly = renderer['y' + l];
        if (lx !== undefined && ly !== undefined) {
          ctx.lineTo(lx, ly);
          l += 1;
        } else {
          break;
        }
      }
      // Close path if chosen
      this.closePath(renderer);
    };

    enhancedContext.drawQuad = function(renderer){
      var l = 2, lx, ly, lcx, lcy;

      // Draw each point
      ctx.beginPath();
      ctx.moveTo(renderer.x1, renderer.y1);
      while (true) {
        lx = renderer['x' + l];
        ly = renderer['y' + l];
        lcx = renderer['cx' + (l-1)];
        lcy = renderer['cy' + (l-1)];
        if (lx !== undefined && ly !== undefined && lcx !== undefined && lcy !== undefined) {
          ctx.quadraticCurveTo(lcx, lcy, lx, ly);
          l += 1;
        } else {
          break;
        }
      }
      // Close path if chosen
      this.closePath(renderer);


    };

    enhancedContext.drawRect = function(renderer){
      var x1, y1, x2, y2, r;

      var pi = Math.PI;

      this.setDefaults(renderer);
      positionShape(renderer, renderer.width, renderer.height);
      ctx.beginPath();

      // Draw a rounded rectangle if chosen
      if (renderer.cornerRadius) {
        renderer.closed = true;
        x1 = renderer.x - renderer.width/2;
        y1 = renderer.y - renderer.height/2;
        x2 = renderer.x + renderer.width/2;
        y2 = renderer.y + renderer.height/2;
        r = renderer.cornerRadius;
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
        ctx.rect(renderer.x-renderer.width/2, renderer.y-renderer.height/2, renderer.width, renderer.height);
      }
      ctx.restore();
      this.closePath(renderer);

    };

    enhancedContext.drawText = function(renderer){

      // Set text-specific properties
      ctx.textBaseline = renderer.baseline;
      ctx.textAlign = renderer.align;
      ctx.font = renderer.font;

      ctx.strokeText(renderer.text, renderer.x, renderer.y);
      ctx.fillText(renderer.text, renderer.x, renderer.y);
      return this;
    };

    enhancedContext.draw = function(callback){
      callback(ctx);
    };

    enhancedContext.restore = function(){
      ctx.restore();
    };

    enhancedContext.rotate = function(renderer){
      this.positionShape(renderer, 0, 0);
    };

    enhancedContext.save = function(){
      ctx.save();
    };

    enhancedContext.translate = function(params){
      ctx.save();
      ctx.translate(params.x, params.y);
    };

    enhancedContext.scale = function(params){
      ctx.save();
      ctx.translate(params.x, params.y);
      ctx.scale(params.scaleX, params.scaleY);
      ctx.translate(-params.x, -params.y);
    };

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

    enhancedContext.measureText = function(params){
      ctx.font = params.font;
      return ctx.measureText(params.text);
    };

    return enhancedContext;
  };
})(jQuery);