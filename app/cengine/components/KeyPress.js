(function () {
  var props = CanvasEngine.EntityManager.properties;


  var KeyPress = function (params, entity) {

    this.getEntity = function () {
      return entity;
    };

    /**
     * Get the component as a JSO
     * @returns {{source: *}}
     */
    this.asObject = function () {

    };

  };

  /**
   * Add the KeyPress component to the CanvasEngine storage.
   */
  CanvasEngine.EntityManager.addComponent("KeyPress", function (params, entity) {
    return new KeyPress(params, entity);
  }, true);
})();