/**
 * Created by schenn on 3/25/16.
 */
// Draw Bezier curve
$.fn.drawBezier = function(args) {
  var ctx, e, params = $.extend({}, args),
    l = 2, lc = 1,
    lx=0, ly=0,
    lcx1=0, lcy1=0,
    lcx2=0, lcy2=0;

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
      lcx1 = params['cx' + lc];
      lcy1 = params['cy' + lc];
      lcx2 = params['cx' + (lc+1)];
      lcy2 = params['cy' + (lc+1)];
      if (lx !== undefined && ly !== undefined && lcx1 !== undefined && lcy1 !== undefined && lcx2 !== undefined && lcy2 !== undefined) {
        ctx.bezierCurveTo(lcx1, lcy1, lcx2, lcy2, lx, ly);
        l += 1;
        lc += 2;
      } else {
        break;
      }
    }
    // Close path if chosen
    window.utilities.closePath(ctx, params);
  }
  return this;
};