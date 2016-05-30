(function(CanvasEngine){
  /**
   * @namespace CanvasEngine.utilities
   *
   * A collection of utility functions
   */
  var utilities = {};

  /**
   * Does a value actually exist?
   * @param {*} val
   * @returns {boolean}
   */
  utilities.exists=function(val){
    return typeof (val) !== "undefined" && val !== null;
  };

  /**
   * Return A value or another
   * @param {*} potential The potential value
   * @param {*} def The default value if no potential
   * @returns {*}
   */
  utilities.orDefault = function(potential, def){
    return this.exists(potential) ? potential : def;
  };

  /**
   * Is the given value a function?
   * @param {*} prop
   * @returns {boolean}
   */
  utilities.isFunction = function(prop){
    return this.exists(prop) && $.isFunction(prop);
  };

  /**
   * Is the given value an Array?
   * @param {*} prop
   * @returns {boolean}
   */
  utilities.isArray = function(prop){
    return (!!prop) && (prop.constructor === Array);
  };

  /**
   * Clean an array of its empty indexes.
   *    Deleting a position from an array doesn't also remove the index.
   *
   * @param {Array} cleanMe The array to clean up
   * @returns {Array}
   */
  utilities.cleanArray = function(cleanMe){
    var cleaner = [];
    for (var i = 0; i < cleanMe.length; i++) {
      if (this.exists(cleanMe[i])) {
        cleaner.push(cleanMe[i]);
      }
    }
    return cleaner;
  };

  /**
   * Generate a random string to name something
   *
   * @returns {string}
   */
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

  /**
   * Parse a json value into an array of data.
   * @param {string | Array} screenMap
   * @returns {Array}
   */
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

  /**
   * Set the properties on a thing when you don't know which properties to set and you have a lot of them.
   * @param {object} thing The thing to set the properties on
   * @param {object} params The properties to set and their data.
   */
  utilities.setProperties = function(thing, params){
    // Only set parameters that matter to the Component.
    Object.keys(params).forEach(function(key){
      if(thing.hasOwnProperty(key)) {
        thing[key] = params[key];
      }
    });
  };

  CanvasEngine.utilities = utilities;

})(window.CanvasEngine);
