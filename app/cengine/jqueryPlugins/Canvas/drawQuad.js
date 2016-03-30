/**
 * Created by schenn on 3/25/16.
 */
// Draw quadratic curve
$.fn.drawQuad = function(args) {
  var ctx, e, params = $.extend({}, args),
    l = 2,
    lx=0, ly=0,
    lcx=0, lcy=0;

  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    $(this).setCanvasDefaults(params);
    ctx = this[e].getContext('2d');

    // Draw each point
    ctx.beginPath();
    ctx.moveTo(params.x1, params.y1);
    while (true) {
      lx = params['x' + l];
      ly = params['y' + l];
      lcx = params['cx' + (l-1)];
      lcy = params['cy' + (l-1)];
      if (lx !== undefined && ly !== undefined && lcx !== undefined && lcy !== undefined) {
        ctx.quadraticCurveTo(lcx, lcy, lx, ly);
        l += 1;
      } else {
        break;
      }
    }
    // Close path if chosen
    window.utilities.closePath(ctx, params);
  }
  return this;
};