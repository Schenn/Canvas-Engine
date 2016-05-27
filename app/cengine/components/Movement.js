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

    var destX, destY;

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
      if(!CanvasEngine.isPaused()) {
        this.x += (xSpeed !== 0) ? xSpeed * delta : 0;
        this.y += (ySpeed !== 0) ? ySpeed * delta : 0;

        if (xSpeed > 0) {
          if (this.x >= destX && destX !== 0) {
            xSpeed = 0;
          }
        } else if (xSpeed < 0) {
          if (this.x <= destX && destX !== 0) {
            xSpeed = 0;
          }
        }

        if (ySpeed > 0) {
          if (this.y >= destY && destY !== 0) {
            ySpeed = 0;
          }
        } else if (ySpeed < 0) {
          if (this.y <= destY && destY !== 0) {
            ySpeed = 0;
          }
        }

        if (this.getDirection().direction !== lastDirection && utils.isFunction(this.onDirectionChange)) {
          var dir = this.getDirection();
          this.onDirectionChange(dir);
          lastDirection = dir.direction;
        }
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
     *
     * @returns {{x: number, y: number, xSpeed: number, ySpeed: number}}
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

    /**
     * Travel a distance in a given direction.
     *
     * When the entity reaches that destination,
     *  it will set it's speeds to 0 and stop moving.
     *
     * @param distance {{x: number, y: number, speed: number }}
     */
    this.travel = function(distance){
      if(ySpeed === 0) {
        if (utils.exists(distance.y)) {
          destY = this.y + distance.y;
          if (distance.y < 0) {
            ySpeed = Math.abs(distance.speed) * -1;
          } else {
            ySpeed = Math.abs(distance.speed);
          }
        }
      }

      if(xSpeed === 0){
        if(utils.exists(distance.x)){
          destX = this.x + distance.x;
          if(distance.x < 0){
            xSpeed = Math.abs(distance.speed) * -1;
          } else {
            xSpeed = Math.abs(distance.speed);
          }
        }
      }

    };


  };

  // Add the movement component to the CanvasEngine storage
  CanvasEngine.EntityManager.addComponent("Movement", function(params, entity){
    return new movement(params, entity);
  }, true);
})();
