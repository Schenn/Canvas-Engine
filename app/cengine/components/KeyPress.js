/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @namespace keyboard
 */
/**
 * @event keyboard#keypress
 * @type {object}
 * @property {number} keyCode
 * @property {number} which
 */

(function (CanvasEngine) {

  /**
   * KeyPress listens for key presses and triggers a function call when they occur
   *
   * @param {object} params { key=>method }
   * @param {CanvasEngine.Entities.Entity} entity
   * @memberOf CanvasEngine.Components
   * @class
   */
  var KeyPress = function (params, entity) {

    var keyCallbacks = {};
    var self = this;

    /**
     * @returns {CanvasEngine.Entities.Entity}
     */
    this.getEntity = function () {
      return entity;
    };

    /**
     * Add a callback to a key
     *
     * @param {string} key
     * @param {function} callback
     */
    this.onKey = function(key, callback){
      keyCallbacks[key] = callback;
    };

    /**
     * @param {string} key
     */
    this.onKeyDown = function(key){
      if(!CanvasEngine.isPaused() && CanvasEngine.utilities.isFunction(keyCallbacks[key])) {
        keyCallbacks[key].call(entity);
      }
    };

    $.each(params, function(key, callback){
      self.onKey(key, callback);
    });

    /**
     * @listens keyboard#keypress
     */
    var onKeyPress = function(event){
      var keyCode = event.keyCode || event.which;
      self.onKeyDown(String.fromCharCode(keyCode));
    };

    /**
     * @fires keyboard#keypress
     */
    $(document).on("keypress", onKeyPress);
  };

  /**
   * Create a new KeyPress
   *
   * @param {object} params
   * @param {CanvasEngine.Entities.Entity} entity
   * @returns {CanvasEngine.Components.KeyPress}
   */
  var construct = function(params, entity){
    return new KeyPress(params, entity);
  };

  /**
   * Add the KeyPress component to the CanvasEngine storage.
   */
  CanvasEngine.EntityManager.addComponent("KeyPress", construct, true);
})(window.CanvasEngine);