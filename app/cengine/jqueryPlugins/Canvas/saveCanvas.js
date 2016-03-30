/**
 * Created by schenn on 3/25/16.
 */
// Save canvas
$.fn.saveCanvas = function() {
  var e;
  for (e=0; e<this.length; e+=1) {
    if (!this[e].getContext) {continue;}
    this[e].getContext('2d').save();
  }
  return this;
};