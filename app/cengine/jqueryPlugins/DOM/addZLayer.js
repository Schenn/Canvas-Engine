/**
 * Created by schenn on 3/25/16.
 */
(function($){
  $.fn.addZLayer = function(height, width, z){
    var tag = 'zLayer'+z;
    var canvas = $("<canvas id='" + tag + "'></canvas>");
    canvas.appendTo(this.parent());
    canvas.attr("height", height).attr("width", width).css("z-index", z);
    return canvas;
  };
})(jQuery);