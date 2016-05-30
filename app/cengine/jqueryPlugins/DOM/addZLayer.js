/**
 * @author Steven Chennault <schenn@gmail.com>
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */
(function($){
  /**
   * Add a Canvas to the top of the stack.
   *  Sets the z-index of the canvas so that if they are absolutely positioned, they actually stack.
   *
   * @param height {number}
   * @param width {number}
   * @param z {number}
   *
   * @returns {HTMLElement}
   */
  $.fn.addZLayer = function(height, width, z){
    var tag = 'zLayer'+z;
    var canvas = $("<canvas id='" + tag + "'></canvas>");
    canvas.appendTo(this.parent());
    canvas.attr("height", height).attr("width", width).css("z-index", z);
    return canvas;
  };
})(jQuery);