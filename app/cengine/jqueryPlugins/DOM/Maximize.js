/**
 * Maximize a Canvas (or image) element to the size of its container.
 */
(function($){
  $.fn.maximize = function(modifier){
    // if modifier is not set, set it to 100%
    modifier = typeof(modifier) != 'undefined' ? modifier / 100 : 1;
    var height = parseInt(this.parent().height()) * modifier;
    var width = parseInt(this.parent().width()) * modifier;
    this.attr("height", height).attr("width", width);
  };
})(jQuery);