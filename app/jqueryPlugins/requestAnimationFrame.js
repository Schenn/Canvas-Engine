/**
 * Created by schenn on 3/24/16.
 */
/**
 * Create a requestAnimationFrame function to standin for the browsers prefix method.
 */
window.requestAnimationFrame = function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
}();