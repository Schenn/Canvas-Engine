/**
 * Created by schenn on 3/24/16.
 */
(function($) {
  // Draw text
  $.fn.drawText = function (args) {
    var ctx, e, params = merge(new Prefs(), args);

    for (e = 0; e < this.length; e += 1) {
      if (!this[e].getContext) {
        continue;
      }
      ctx = this[e].getContext('2d');

      // Set text-specific properties
      ctx.textBaseline = params.baseline;
      ctx.textAlign = params.align;
      ctx.font = params.font;

      ctx.strokeText(params.text, params.x, params.y);
      ctx.fillText(params.text, params.x, params.y);
    }
    return this;
  };
})(jQuery);