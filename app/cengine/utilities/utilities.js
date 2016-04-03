/**
 * Created by schenn on 3/24/16.
 */
var utilities = function(){

};

utilities.prototype.exists=function(val){
  return typeof (val) !== "undefined" && val !== null;
};

utilities.prototype.orDefault = function(potential, def){
  return this.exists(potential) ? potential : def;
};

utilities.prototype.isFunction = function(prop){
  return this.exists(prop) && $.isFunction(prop);
};

utilities.prototype.convertAngles = function(params) {
  return params.inDegrees ? Math.PI/180 : 1;
};

utilities.prototype.positionShape = function(ctx, params, width, height) {

    params.toRad = this.convertAngles(params);
    ctx.save();

    // Always rotate from center
    if (!params.fromCenter) {
      params.x += width/2;
      params.y += height/2;
    }

    // Rotate only if specified
    if (params.angle) {
      ctx.translate(params.x, params.y);
      ctx.rotate(params.angle*params.toRad);
      ctx.translate(-params.x, -params.y);
    }

};

utilities.prototype.closePath = function(ctx, params){
  // Mask if chosen
  if (params.mask) {
    ctx.save();
    ctx.clip();
  }
  if (params.closed) {
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
};

utilities.prototype.cleanArray = function(cleanMe){
  var cleaner = [];
  for (var i = 0; i < cleanMe.length; i++) {
    if (this.exists(cleanMe[i])) {
      cleaner.push(cleanMe[i]);
    }
  }
  return (cleaner);
};

utilities.prototype.randName = function () {
  var length = 8 + Math.floor(7 * (Math.random() % 1));
  var val = "ce_";
  for (var i = 1; i <= length; i++) {
    var slots = 1 + Math.floor(4 * (Math.random() % 1));
    switch (slots) {
      case 1:
        val += 48 + Math.floor(10 * (Math.random() % 1));
        break;
      case 2:
        val += String.fromCharCode(65 + Math.floor(26 * (Math.random() % 1)));
        break;
      case 3:
        val += String.fromCharCode(97 + Math.floor(26 * (Math.random() % 1)));
        break;
    }
  }
  return (val);
};

utilities.prototype.parseJsonArray = function(screenMap){
  if (typeof(screenMap) === "string") {
    screenMap = $.parseJSON(screenMap);
  }
  for (var i = 0; i < screenMap.length; i++) {
    if ($.parseJSON(screenMap[i]) !== null) {
      screenMap[i] = $.parseJSON(screenMap[i]);
    }
  }
  return (screenMap);
};

window.utilities = new utilities();