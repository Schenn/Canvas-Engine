/**
 * Created by schenn on 3/30/16.
 */
(function($){
  $.fn.setCanvasDefaults = function(params){
    var ctx = this[0].getContext('2d');
    ctx.fillStyle = params.fillStyle;
    ctx.strokeStyle = params.strokeStyle;
    ctx.lineWidth = params.strokeWidth;
    // Set rounded corners for paths
    if (params.rounded) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else {
      ctx.lineCap = params.strokeCap;
      ctx.lineJoin = params.strokeJoin;
    }
    ctx.shadowOffsetX = params.shadowX;
    ctx.shadowOffsetY = params.shadowY;
    ctx.shadowBlur = params.shadowBlur;
    ctx.shadowColor = params.shadowColor;
    ctx.globalAlpha = params.opacity;
    ctx.globalCompositeOperation = params.compositing;
  };

})(jQuery);