/**
 * @param {external:jQuery} $
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
   * @memberof external:jQuery.fn
   * @alias maximize
   *
   * @param {number} modifier A percentage value to derive the relative size. Default 100%
   */
  $.fn.maximize = function(modifier){
    // Divide the modifier by 100, if there is no modifier set it to the default
    mod = typeof(modifier) != 'undefined' ? modifier / 100 : mod;
    var height = parseInt(this.parent().height()) * mod;
    var width = parseInt(this.parent().width()) * mod;
    this.attr("height", height).attr("width", width);
  };
})(jQuery);