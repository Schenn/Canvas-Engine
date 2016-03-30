/**
 * Created by schenn on 3/25/16.
 */
// Get pixels on the canvas
$.fn.setPixels = function(args) {
  var ctx, elem, e, i,
    params = $.extend({}, args),
    imgData, data, len, px = {};

  for (e=0; e<this.length; e+=1) {
    elem = this[e];
    if (!elem.getContext) {continue;}
    ctx = elem.getContext('2d');
    // Measure from center
    if (!params.x && !params.y && !params.width && !params.height) {
      params.width = elem.width;
      params.height = elem.height;
      params.x = params.width/2;
      params.y = params.height/2;
    }
    window.utilities.positionShape(ctx, params, params.width, params.height);
    imgData = ctx.getImageData(params.x-params.width/2, params.y-params.height/2, params.width, params.height);
    data = imgData.data;
    len = data.length;
    px = [];

    // Loop through pixels with "each" method
    if (params.each !== undefined) {
      for (i=0; i<len; i+=4) {
        px.index = i/4;
        px.r = data[i];
        px.g = data[i+1];
        px.b = data[i+2];
        px.a = data[i+3];
        params.each.call(elem, px);
        data[i] = px.r;
        data[i+1] = px.g;
        data[i+2] = px.b;
        data[i+3] = px.a;
      }
    }
    // Put pixels on canvas
    ctx.putImageData(imgData, params.x-params.width/2, params.y-params.height/2);
    ctx.restore();
  }
  return this;
};