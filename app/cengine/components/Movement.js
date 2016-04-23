(function(){
  var props = CanvasEngine.EntityManager.properties;
  var utils = CanvasEngine.utilities;
  var lastDirection;

  var movement = function(params, entity){
    var x = params.x,
      y = params.y,
      xSpeed = params.xSpeed,
      ySpeed = params.ySpeed;

    if(utils.isFunction(params.onDirectionChange)){
      this.onDirectionChange = params.onDirectionChange.bind(this);
    }

    this.move = function(delta){
      if(delta > 0){
        x += xSpeed * delta / 1000;
        y += ySpeed * delta / 1000;
      } else {
        x += xSpeed;
        y += ySpeed;
      }
      if(this.getDirection() !== lastDirection && utils.isFunction(this.onDirectionChange)){
        this.onDirectionChange(this.getDirection());
      }
    };

    this.setSpeed = function(speeds){
      xSpeed = utils.exists(speeds.xSpeed)? speeds.xSpeed : xSpeed;
      ySpeed = utils.exists(speeds.ySpeed)? speeds.ySpeed : ySpeed;
    };

    this.setOrigin = function(coords){
      x = coords.x;
      y = coords.y;
    };

    this.getEntity = function(){
      return entity;
    };

    this.asObject = function(){
      return $.extend({}, {x:x, y:y,xSpeed: xSpeed, ySpeed: ySpeed});
    };

    this.getDirection = function () {
      var direction = "";
      switch (ySpeed){
        case ySpeed < 0:
          direction = "N";
          break;
        case ySpeed > 0:
          direction = "S";
          break;
        default:
          break;
      }

      switch (xSpeed){
        case xSpeed < 0:
          direction += "W";
          break;
        case xSpeed > 0:
          direction += "E";
          break;
        default:
          break;

      }

      return {
        direction: direction,
        xSpeed: xSpeed,
        ySpeed: ySpeed
      }
    };


  };

  CanvasEngine.EntityManager.addComponent("Movement", function(params, entity){
    return new movement(params, entity);
  }, true);
})();
