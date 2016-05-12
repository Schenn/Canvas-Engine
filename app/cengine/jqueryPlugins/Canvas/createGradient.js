/**
 * Create a canvas gradient
 * @param args
 * @returns {*}
 */
$.fn.createGradient = function(args) {
  if (!this[0].getContext) {return null;}
  var ctx = this[0].getContext('2d'),
    params = $.extend({}, args),
    gradient, percent,
    stops = 0,
    i = 1;

  // Create radial gradient if chosen
  if (params.r1 !== null || params.r2 !== null) {
    gradient = ctx.createRadialGradient(params.x1, params.y1, params.r1, params.x2, params.y2, params.r2);
  } else {
    gradient = ctx.createLinearGradient(params.x1, params.y1, params.x2, params.y2);
  }

  // Count number of color stops
  while (params['c' + i] !== undefined) {
    stops += 1;
    i += 1;
  }

  // Calculate color stop percentages if absent
  for (i=1; i<=stops; i+=1) {
    percent = Math.round(100 / (stops-1) * (i-1)) / 100;
    if (params['s' + i] === undefined) {
      params['s' + i] = percent;
    }
    gradient.addColorStop(params['s' + i], params['c' + i]);
  }
  return gradient;
};