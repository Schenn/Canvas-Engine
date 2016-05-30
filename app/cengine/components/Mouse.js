/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~MouseParams
 * @property {function | Array} [onClick]
 * @property {function | Array} [onMouseOver]
 * @property {function | Array} [onMouseDown]
 * @property {function | Array} [onMouseUp]
 * @property {function | Array} [onMouseOut]
 */
(function(CanvasEngine){
  /**
   * The click component manages the click response for an entity
   *
   * @memberOf CanvasEngine.Components
   * @param {LocalParams~MouseParams} params params.onClick == the functions being assigned.
   * @param {CanvasEngine.Entities.Entity} entity The entity that the component is being attached to.
   *
   * @class
   */
  var Mouse = function(params, entity){
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
     * @returns {CanvasEngine.Entities.Entity}
     */
    this.getEntity = function(){
      return entity;
    };

    /**
     * When clicked...
     * @param {coord} args
     */
    this.Click = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onClick, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    /**
     * When the mouse is over the entity
     * @param {coord} args
     */
    this.onMouseOver = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseOver, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    /**
     * When the mouse is down on the entity
     * @param {coord} args
     */
    this.onMouseDown = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseDown, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    /**
     * When the mouse is released over the entity
     * @param {coord} args
     */
    this.onMouseUp = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseUp, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    /**
     * When the mouse is moved over the entity
     * @param {coord} args
     */
    this.onMouseMove = function(args){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseMove, function (index, callback) {
          callback.call(entity, args);
        });
      }
    };

    /**
     * When the mouse is leaves the entity
     */
    this.onMouseOut = function(){
      if(!CanvasEngine.isPaused()) {
        $.each(onMouseOut, function (index, callback) {
          callback.call(entity);
        });
      }
    };

    /**
     * Add click methods to the click container
     * @param {Array} methods
     */
    this.addClickMethods = function(methods){
      onClick = onClick.concat(methods);
    };

    /**
     * Add Methods for the other mouse callbacks
     *
     * @param {LocalParams~MouseParams} methodContainer
     */
    this.addMouseMethods = function(methodContainer){
      var mouseMethods = Object.keys(methodContainer);
      var self = this;
      $.each(mouseMethods, function(mouseMethod, callback){
        self[mouseMethod].push(callback);
      });
    };
  };

  /**
   * @construct
   * @memberOf CanvasEngine.Components.Mouse
   */
  var construct = function(params, entity){
    return new Mouse(params, entity);
  };

  // Add the Click component to the CanvasEngine Storage
  CanvasEngine.EntityManager.addComponent("Mouse", construct, true);
})(window.CanvasEngine);