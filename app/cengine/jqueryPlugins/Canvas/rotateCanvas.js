/**
 * Created by schenn on 3/25/16.
 */
// Rotate canvas
$.fn.rotateCanvas = function(args) {
  var ctx, e, params = merge(new Prefs(), args);

  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    ctx = this[e].getContext('2d');
    window.utilities.positionShape(ctx, params, 0, 0);
  }
  return this;
};