/**
 * Created by schenn on 3/25/16.
 */
// Load canvas
$.fn.getCanvasImage = function(type) {
  if (!this[0].toDataURL) {return null;}
  if (type === undefined) {
    type = 'image/png';
  } else {
    type = type
      .replace(/^([a-z]+)$/gi, 'image/$1')
      .replace(/jpg/gi, 'jpeg');
  }
  return this[0].toDataURL(type);
};