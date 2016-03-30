/**
 * Created by schenn on 3/25/16.
 */
/**
 * If there's something at a given pixel for a canvas at a specified location
 * if t is true, returns true the pixel is transparent or false if it is not
 *
 * @param canvas jCanvas the canvas to check
 * @param x int the X coordinate to check
 * @param y int the Y coordinate to check
 * @param t
 *
 */
(function ($) {
  $.fn.atPixel = (function (x, y, w, h, t) {
    var c = $(this).loadCanvas();
    var img = c.getImageData(x, y, w, h);
    var data = img.data;
    //data = [r,g,b,a] at pixel
    if (t) //if checking for transparency
    {
      for (var a = 3; a < data.length; a += 4) {
        if (data[a] > 0) //if alpha not transparent
        {
          return (true);
        }
      }
      return (false);
    }
    return (data); // return pixel data
  });
})(jQuery);