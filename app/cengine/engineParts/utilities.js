/**
 * Created by schenn on 3/24/16.
 */

(function(){

  var utilities = {};

  utilities.exists=function(val){
    return typeof (val) !== "undefined" && val !== null;
  };

  utilities.orDefault = function(potential, def){
    return this.exists(potential) ? potential : def;
  };

  utilities.isFunction = function(prop){
    return this.exists(prop) && $.isFunction(prop);
  };

  utilities.convertAngles = function(params) {
    return params.inDegrees ? Math.PI/180 : 1;
  };

  utilities.cleanArray = function(cleanMe){
    var cleaner = [];
    for (var i = 0; i < cleanMe.length; i++) {
      if (this.exists(cleanMe[i])) {
        cleaner.push(cleanMe[i]);
      }
    }
    return cleaner;
  };

  utilities.randName = function () {
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

  utilities.parseJsonArray = function(screenMap){
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

  utilities.setProperties = function(thing, params){
    // Only set parameters that matter to the Component.
    Object.keys(params).forEach(function(key){
      if(thing.hasOwnProperty(key)) {
        thing[key] = params[key];
      }
    });
  };

  CanvasEngine.utilities = utilities;

})();
