(function(){
  /**
   * The click component manages the click response for an entity
   * @param params params.onClick == the functions being assigned.
   * @param entity The entity that the component is being attached to.
   */
  var mouse = function(params, entity){
    var onClick = [];
    var onMouseOver = [];
    var onMouseDown = [];
    var onMouseUp = [];
    var onMouseMove = [];
    var onMouseOut = [];

    if(CanvasEngine.utilities.isFunction(params.onClick)){
      onClick.push(params.onClick);
    } else if(Array.isArray(params.onClick)){
      onClick = onClick.concat(params.onClick);
    }

    if(CanvasEngine.utilities.isFunction(params.onMouseOver)){
      onMouseOver.push(params.onMouseOver);
    } else if(Array.isArray(params.onMouseOver)){
      onMouseOver = onClick.concat(params.onMouseOver);
    }

    if(CanvasEngine.utilities.isFunction(params.onMouseDown)){
      onMouseDown.push(params.onMouseDown);
    } else if(Array.isArray(params.onMouseDown)){
      onMouseDown = onClick.concat(params.onMouseDown);
    }

    if(CanvasEngine.utilities.isFunction(params.onMouseUp)){
      onMouseUp.push(params.onMouseUp);
    } else if(Array.isArray(params.onMouseUp)){
      onMouseUp = onClick.concat(params.onMouseUp);
    }

    if(CanvasEngine.utilities.isFunction(params.onMouseOut)){
      onMouseOut.push(params.onMouseOut);
    } else if(Array.isArray(params.onMouseOut)){
      onMouseOut = onClick.concat(params.onMouseOut);
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
      if(!CanvasEngine.isPaused()) {
        $.each(onClick, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    this.onMouseOver = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseOver, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    this.onMouseDown = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseDown, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    this.onMouseUp = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseUp, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    this.onMouseMove = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseMove, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    this.onMouseOut = function(){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseOut, function (index, callback) {
          callback.call(entity);
        });
      }
    };

    this.addClickMethods = function(methods){
      onClick = onClick.concat(methods);
    };

    this.addMouseMethods = function(methodContainer){
      var mouseMethods = Object.keys(methodContainer);
      var self = this;
      $.each(mouseMethods, function(mouseMethod, callback){
        self[mouseMethod].push(callback);
      });
    };
  };

  // Add the Click component to the CanvasEngine Storage
  CanvasEngine.EntityManager.addComponent("Mouse", function(params, entity){
    return new mouse(params, entity);
  }, true);
})();