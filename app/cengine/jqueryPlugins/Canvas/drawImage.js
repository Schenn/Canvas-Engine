/**
 * Created by schenn on 3/24/16.
 */

// Draw image
$.fn.drawImage = function(args) {
  var ctx, elem, e, params = $.extend({}, args),
  // Define image source
    img = new Image(),
    scaleFac;
  // Use specified element, if not, a source URL
  if (params.source.src) {
    img = params.source;
  } else if (params.source) {
    img.src = params.source;
  }

  // Draw image function
  function draw(ctx) {
    if (img.complete) {
      scaleFac = (img.width / img.height);

      // Show whole image if no cropping region is specified
      params.sWidth = params.sWidth || img.width;
      params.sHeight = params.sHeight || img.height;
      // Ensure cropped region is not bigger than image
      if (params.sWidth > img.width) {
        params.sWidth = img.width;
      }
      if (params.sHeight > img.height) {
        params.sHeight = img.height;
      }
      // Destination width/height should equal source unless specified
      if (params.width === 0 && params.sWidth !== img.width) {
        params.width = params.sWidth;
      }
      if (params.height === 0 && params.sHeight !== img.height) {
        params.height = params.sHeight;
      }

      // If no sx/sy specified, use center of image (or top-left corner if cropFromCenter is false)
      if (params.sx === null) {
        if (params.cropFromCenter) {
          params.sx = img.width / 2;
        } else {
          params.sx = 0;
        }
      }
      if (params.sy === null) {
        if (params.cropFromCenter) {
          params.sy = img.height / 2;
        } else {
          params.sy = 0;
        }
      }

      // Crop from top-left corner if specified (rather than center)
      if (!params.cropFromCenter) {
        params.sx += params.sWidth/2;
        params.sy += params.sHeight/2;
      }

      // Ensure cropped region does not extend image boundary
      if ((params.sx - params.sWidth/2) < 0) {
        params.sx = params.sWidth/2;
      }
      if ((params.sx + params.sWidth/2) > img.width) {
        params.sx = img.width - params.sWidth / 2;
      }
      if ((params.sy - params.sHeight/2) < 0) {
        params.sy = params.sHeight / 2;
      }
      if ((params.sy + params.sHeight/2) > img.height) {
        params.sy = img.height - params.sHeight / 2;
      }

      // If only width is present
      if (params.width && !params.height) {
        params.height = params.width / scaleFac;
        // If only height is present
      } else if (!params.width && params.height) {
        params.width = params.height * scaleFac;
        // If width and height are both absent
      } else if (!params.width && !params.height) {
        params.width = img.width;
        params.height = img.height;
      }

      // Draw image
      window.utilities.positionShape(ctx, params, params.width, params.height);
      ctx.drawImage(
        img,
        params.sx - params.sWidth / 2,
        params.sy - params.sHeight / 2,
        params.sWidth,
        params.sHeight,
        params.x - params.width / 2,
        params.y - params.height / 2,
        params.width,
        params.height
      );
      ctx.restore();
      return true;
    } else {
      return false;
    }
  }
  // Run callback function
  function callback() {
    if (params.load) {
      params.load.call(elem);
    }
  }
  // On load function
  function onload() {
    draw(ctx);
    callback();
  }
  // Draw image if already loaded
  for (e=0; e<this.length; e+=1) {
    elem = this[e];
    if (!elem.getContext) {continue;}
    ctx = elem.getContext('2d');

    // Draw when image is loaded (if chosen)
    if (!img.complete && params.load) {
      img.onload = onload;
    } else {
      // Draw image if loaded
      if (!draw(ctx)) {
        img.onload = onload;
      } else {
        callback();
      }
    }
  }
  return this;
};