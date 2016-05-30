/**
 * @author Steven Chennault <schenn@gmail.com>
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */
(function($){
  /**
   * Get a canvas as a jpeg
   * @external "jQuery.fn"
   *
   * @param type
   * @returns {string}
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
})(jQuery);
