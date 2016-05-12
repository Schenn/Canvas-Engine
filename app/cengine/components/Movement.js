(function(){
  var props = CanvasEngine.EntityManager.properties;
  var utils = CanvasEngine.utilities;

  /**
   * The movement component adjusts the current position based on speed and the passage of time
   *
   * @param params
   * @param entity
   */
  var movement = function(params, entity){
    var x = params.x,
      y = params.y,
      xSpeed = utils.exists(params.xSpeed) ? params.xSpeed : 0,
      ySpeed = utils.exists(params.ySpeed) ? params.ySpeed : 0;

    var lastDirection;

    if(utils.isFunction(params.onDirectionChange)){
      this.onDirectionChange = params.onDirectionChange.bind(this);
    }

    Object.defineProperties(this, {
      "x": props.defaultProperty(x,params.onMoveX),
      "y": props.defaultProperty(y, params.onMoveY)
    });

    /**
     * Adjust the position based on axis speeds
     *
     * @param delta
     */
    this.move = function(delta){
      if(delta > 0){
        this.x += (xSpeed > 0) ? xSpeed * delta : 0;
        this.y += (ySpeed > 0) ? ySpeed * delta : 0;
      } else {
        this.x += (xSpeed > 0) ? xSpeed : 0;
        this.y += (ySpeed > 0) ? ySpeed : 0;
      }
      if(this.getDirection().direction !== lastDirection && utils.isFunction(this.onDirectionChange)){
        var dir = this.getDirection();
        this.onDirectionChange(dir);
        lastDirection = dir.direction;
      }
    };

    /**
     * Set the axis speeds.
     *
     * @param speeds
     */
    this.setSpeed = function(speeds){
      xSpeed = utils.exists(speeds.xSpeed)? speeds.xSpeed : xSpeed;
      ySpeed = utils.exists(speeds.ySpeed)? speeds.ySpeed : ySpeed;
    };

    /**
     * Set the origin point
     * @param coords
     */
    this.setOrigin = function(coords){
      this.x = coords.x;
      this.y = coords.y;
    };


    /**
     * Get the entity that the component is attached to.
     *
     * @returns {*}
     */
    this.getEntity = function(){
      return entity;
    };

    /**
     * Get this components data as a jso
     */
    this.asObject = function(){
      return $.extend({}, {x:this.x, y:this.y,xSpeed: xSpeed, ySpeed: ySpeed});
    };

    /**
     * Get a "Direction" of movement based on the given axis speeds.
     *
     * @returns {{direction: string, xSpeed: number, ySpeed: *}}
     */
    this.getDirection = function () {
      var direction = "";

      direction += (ySpeed > 0) ? "S" : "N";
      if(xSpeed !== 0) {
        direction += (xSpeed > 0) ? "E" : "W";
      }

      return {
        direction: direction,
        xSpeed: xSpeed,
        ySpeed: ySpeed
      };
    };


  };

  // Add the movement component to the CanvasEngine storage
  CanvasEngine.EntityManager.addComponent("Movement", function(params, entity){
    return new movement(params, entity);
  }, true);
})();
