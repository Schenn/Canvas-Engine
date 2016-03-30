/**
 * Created by schenn on 3/25/16.
 */
// Restore canvas
$.fn.restoreCanvas = function() {
  var e;
  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    this[e].getContext('2d').restore();
  }
  return this;
};