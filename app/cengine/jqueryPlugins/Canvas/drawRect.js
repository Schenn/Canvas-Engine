/**
 * Created by schenn on 3/24/16.
 */
// Draw rectangle
$.fn.drawRect = function(args) {
  var ctx, e, params = $.extend({}, args),
    x1, y1, x2, y2, r;

  var pi = Math.PI;

  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    ctx = this[e].getContext('2d');
    window.utilities.positionShape(ctx, params, params.width, params.height);
    ctx.beginPath();

    // Draw a rounded rectangle if chosen
    if (params.cornerRadius) {
      params.closed = true;
      x1 = params.x - params.width/2;
      y1 = params.y - params.height/2;
      x2 = params.x + params.width/2;
      y2 = params.y + params.height/2;
      r = params.cornerRadius;
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
      ctx.rect(params.x-params.width/2, params.y-params.height/2, params.width, params.height);
    }
    ctx.restore();
    window.utilities.closePath(ctx, params);
  }
  return this;
};