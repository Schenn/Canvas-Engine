/**
 * Get a canvas as a jpeg
 *
 * @param type
 * @returns {*}
 */
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