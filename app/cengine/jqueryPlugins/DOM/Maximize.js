/**
 * @author Steven Chennault <schenn@gmail.com>
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */
(function($){

  /**
   * The default modifier is 100%
   *
   * @default
   * @type {number}
   */
  var mod = 1;

  /**
   * Enlarge a canvas or image to a size relative to it's parent container
   *
   * @param modifier {number} A percentage value to derive the relative size. Default 100%
   */
  $.fn.maximize = function(modifier){
    // Divide the modifier by 100, if there is no modifier set it to the default
    mod = typeof(modifier) != 'undefined' ? modifier / 100 : mod;
    var height = parseInt(this.parent().height()) * mod;
    var width = parseInt(this.parent().width()) * mod;
    this.attr("height", height).attr("width", width);
  };
})(jQuery);