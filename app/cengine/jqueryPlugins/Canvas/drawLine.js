/**
 * Created by schenn on 3/24/16.
 */
// Draw line
$.fn.drawLine = function(args) {
  var ctx, e, params = $.extend({}, args),
    l=2, lx=0, ly=0;

  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    ctx = this[e].getContext('2d');

    // Draw each point
    ctx.beginPath();
    ctx.moveTo(params.x1, params.y1);
    while (true) {
      lx = params['x' + l];
      ly = params['y' + l];
      if (lx !== undefined && ly !== undefined) {
        ctx.lineTo(lx, ly);
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