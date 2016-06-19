/**
 * @param {external:jQuery} $
 * @extends $
 */
(function($){
  /**
   * Create a Canvas Pattern
   *
   * @param {object} args
   * @param {Image | string} args.source
   * @param {string} args.repeat
   * @param {function} [args.load]
   * @memberof external:jQuery.fn
   * @alias pattern
   * @function
   * @returns {CanvasPattern}
   */
  $.fn.pattern = function(args) {
    if (!this[0].getContext) {return null;}
    var ctx = this[0].getContext('2d'),
      params = $.extend({}, args),
      img = new Image(),
      pattern;
    // Use specified element, if not, a source URL
    if (params.source.src) {
      img = params.source;
    } else if (params.source) {
      img.src = params.source;
    }

    // Create pattern
    function create() {
      if (img.complete) {
        // Create pattern
        pattern = ctx.createPattern(img, params.repeat);
        return true;
      } else {
        return false;
      }

    }
    // Run callback function
    function callback() {
      if (params.load) {
        params.load.call(this[0], pattern);
      }
    }
    function onload() {
      create();
      callback();
    }
    // Draw when image is loaded (if chosen)
    if (!img.complete && params.load) {
      img.onload = onload;
    } else {
      // Draw image if loaded
      if (!create()) {
        img.onload = onload;
      } else {
        callback();
      }
    }
    return pattern;
  };
})(jQuery);
