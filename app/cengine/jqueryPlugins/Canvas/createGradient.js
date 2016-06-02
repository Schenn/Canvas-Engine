/**
 * @param {external:jQuery} $
 */
(function($){
  /**
   * Generates a CanvasGradient
   *
   * @param {object} args
   * @param {number} args.x1
   * @param {number} args.y1
   * @param {number} args.x2
   * @param {number} args.y2
   * @param {...string} args.c1  // Each Color (c) gets its own index (args.c1, args.c2, args.c3)
   * @param {...number} args.s1  // Each Color Stop (s) gets its own index which must equal the color index.
   * @memberof external:jQuery.fn
   * @alias createGradient
   * @returns {CanvasGradient}
   */
  $.fn.createGradient = function(args) {
    if (!this[0].getContext) {return null;}
    var ctx = this[0].getContext('2d'),
      params = $.extend({}, args),
      gradient, percent,
      stops = 0,
      i = 1;

    // Create radial gradient if chosen
    if (params.r1 !== null || params.r2 !== null) {
      gradient = ctx.createRadialGradient(params.x1, params.y1, params.r1, params.x2, params.y2, params.r2);
    } else {
      gradient = ctx.createLinearGradient(params.x1, params.y1, params.x2, params.y2);
    }

    // Count number of color stops
    while (typeof(params['c' + i]) !== undefined) {
      stops += 1;
      i += 1;
    }

    // Calculate color stop percentages if absent
    for (i=1; i<=stops; i+=1) {
      percent = Math.round(100 / (stops-1) * (i-1)) / 100;
      if (params['s' + i] === undefined) {
        params['s' + i] = percent;
      }
      gradient.addColorStop(params['s' + i], params['c' + i]);
    }
    return gradient;
  };
})(jQuery);