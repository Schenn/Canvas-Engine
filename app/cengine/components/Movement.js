(function(){
  var props = CanvasEngine.EntityManager.properties;
  var utils = CanvasEngine.utilities;

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

    this.setSpeed = function(speeds){
      xSpeed = utils.exists(speeds.xSpeed)? speeds.xSpeed : xSpeed;
      ySpeed = utils.exists(speeds.ySpeed)? speeds.ySpeed : ySpeed;
    };

    this.setOrigin = function(coords){
      this.x = coords.x;
      this.y = coords.y;
    };

    this.getEntity = function(){
      return entity;
    };

    this.asObject = function(){
      return $.extend({}, {x:this.x, y:this.y,xSpeed: xSpeed, ySpeed: ySpeed});
    };

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

  CanvasEngine.EntityManager.addComponent("Movement", function(params, entity){
    return new movement(params, entity);
  }, true);
})();
