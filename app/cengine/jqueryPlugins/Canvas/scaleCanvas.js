/**
 * Created by schenn on 3/25/16.
 */
// Scale canvas
$.fn.scaleCanvas = function(args) {
  var ctx, e, params = merge(new Prefs(), args);

  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    ctx = this[e].getContext('2d');

    ctx.save();
    ctx.translate(params.x, params.y);
    ctx.scale(params.scaleX, params.scaleY);
    ctx.translate(-params.x, -params.y);
  }
  return this;
};