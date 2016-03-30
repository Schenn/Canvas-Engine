/**
 * Created by schenn on 3/25/16.
 */
// Draw on canvas manually
$.fn.draw = function(callback) {
  var $elems = this, e;
  for (e=0; e<$elems.length; e+=1) {
    if (!$elems[e].getContext) {continue;}
    callback.call($elems[e], $elems[e].getContext('2d'));
  }
  return this;
};