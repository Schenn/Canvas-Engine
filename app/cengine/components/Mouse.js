(function(){
  /**
   * The click component manages the click response for an entity
   * @param params params.onClick == the functions being assigned.
   * @param entity The entity that the component is being attached to.
   */
  var click = function(params, entity){
    var onClick = [];

    if(CanvasEngine.utilities.isFunction(params.onClick)){
      onClick.push(params.onClick);
    } else if(Array.isArray(params.onClick)){
      onClick = onClick.concat(params.onClick);
    }

    /**
     * Get the entity that belongs to the component
     * @returns {*}
     */
    this.getEntity = function(){
      return entity;
    };

    /**
     * When clicked...
     * @param args
     * @constructor
     */
    this.Click = function(args){
      $.each(onClick, function(index, callback){
        callback.call(entity, args);
      });
    };

    this.addClickMethods = function(methods){
      onClick = onClick.concat(methods);
    };
  };

  // Add the Click component to the CanvasEngine Storage
  CanvasEngine.EntityManager.addComponent("Click", function(params, entity){
    return new click(params, entity);
  }, true);
})();