/**
 * Created by schenn on 3/25/16.
 */
// Clear canvas
$.fn.clearCanvas = function(args) {
  var ctx, e, params = $.extend({}, args);

  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    ctx = this[e].getContext('2d');

    window.utilities.positionShape(ctx, params, params.width, params.height);

    // Clear entire canvas
    if (!params.width && !params.height) {
      ctx.clearRect(0, 0, this[e].width, this[e].height);
    } else {
      ctx.clearRect(params.x-params.width/2, params.y-params.height/2, params.width, params.height);
    }
  }
  return this;
};