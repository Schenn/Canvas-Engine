(function () {

  var KeyPress = function (params, entity) {

    var keyCallbacks = {};
    var self = this;

    this.getEntity = function () {
      return entity;
    };

    this.onKey = function(key, callback){
      keyCallbacks[key] = callback;
    };

    this.onKeyDown = function(key){
      if(!CanvasEngine.isPaused() && CanvasEngine.utilities.isFunction(keyCallbacks[key])) {
        keyCallbacks[key].call(entity);
      }
    };

    $.each(params, function(key, callback){
      self.onKey(key, callback);
    });

    $(document).on("keypress", function(e){
      var keyCode = event.keyCode || event.which;
      self.onKeyDown(String.fromCharCode(keyCode));
    });
  };

  /**
   * Add the KeyPress component to the CanvasEngine storage.
   */
  CanvasEngine.EntityManager.addComponent("KeyPress", function (params, entity) {
    return new KeyPress(params, entity);
  }, true);
})();