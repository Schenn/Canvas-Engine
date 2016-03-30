/**
 * Created by schenn on 3/25/16.
 */
// Draw ellipse
$.fn.drawEllipse = function(args) {
  var ctx, e, params = $.extend({}, args),
    controlW = params.width * 4/3;

  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    $(this).setCanvasDefaults(params);
    ctx = this[e].getContext('2d');
    window.utilities.positionShape(ctx, params, params.width, params.height);

    // Create ellipse
    ctx.beginPath();
    ctx.moveTo(params.x, params.y-params.height/2);
    // Left side
    ctx.bezierCurveTo(params.x-controlW/2, params.y-params.height/2, params.x-controlW/2, params.y+params.height/2, params.x, params.y+params.height/2);
    // Right side
    ctx.bezierCurveTo(params.x+controlW/2, params.y+params.height/2, params.x+controlW/2, params.y-params.height/2, params.x, params.y-params.height/2);
    ctx.restore();
    window.utilities.closePath(ctx, params);
  }
  return this;
};