/**
 * Created by schenn on 3/24/16.
 */
(function($){
  // Load canvas
  $.fn.loadCanvas = function(ctx) {
    if (!this[0].getContext) {return null;}
    return this[0].getContext(ctx || '2d');
  };
})(jQuery);