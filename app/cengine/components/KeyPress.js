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

/**
 * @callback Callbacks~onKeyPress
 * @this CanvasEngine.Entities.Entity
 */
(function (CanvasEngine) {

  /**
   * KeyPress listens for key presses and triggers a function call when they occur
   * @see {CanvasEngine.EntityManager.addComponent} for more information.
   * @param {Object.<string, Callbacks~onKeyPress>} params Key Callbacks
   * @param {CanvasEngine.Entities.Entity} entity
   * @memberof CanvasEngine.Components
   * @class
   */
  var KeyPress = function (params, entity) {

    var keyCallbacks = {};

    var onKeyDown = function(key){
      if(!CanvasEngine.isPaused() && CanvasEngine.utilities.isFunction(keyCallbacks[key])) {
        keyCallbacks[key].call(entity);
      }
    };

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
     * @param {Callbacks~KeyPress} callback
     */
    this.onKey = function(key, callback){
      keyCallbacks[key] = callback;
    };

    /**
     * Add a collection of key->callbacks
     *
     * @param {Object.<string, Callbacks~onKeyPress>} keys
     */
    this.onKeys = function(keys){
      $keys = Object.keys(keys);
      for(var i =0; i < $keys.length; i++){
        this.onKey($keys[i], keys[$keys[i]]);
      }
    };

    /**
     * @fires keyboard#keypress
     */
    $(document).on("keypress",
      /**
       * @listens keyboard#keypress
       */
      function(event){
        var keyCode = event.keyCode || event.which;
        onKeyDown(String.fromCharCode(keyCode));
      }
    );
  };

  /**
   * Add the KeyPress component to the CanvasEngine storage.
   */
  CanvasEngine.EntityManager.addComponent("KeyPress",
    function(params, entity){
      return new KeyPress(params, entity);
    }, true
  );
})(window.CanvasEngine);