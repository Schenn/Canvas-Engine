/**
 * Created by schenn on 3/25/16.
 */
// Draw arc
$.fn.drawArc = function(args) {
  var ctx, e, params = $.extend({}, args);

  var pi = Math.PI;
  $(this).setCanvasDefaults(params);
  // Change default end angle to radians if needed
  if (!params.inDegrees && params.end === 360) {
    params.end = pi * 2;
  }

  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    this.setDefaults(params);
    ctx = this[e].getContext('2d');
    window.utilities.positionShape(ctx, params, params.radius*2, params.radius*2);

    // Draw arc
    ctx.beginPath();
    ctx.arc(params.x, params.y, params.radius, (params.start*params.toRad)-(pi/2), (params.end*params.toRad)-(pi/2), params.ccw);
    // Close path if chosen
    ctx.restore();
    window.utilities.closePath(ctx, params);
  }
  return this;
};