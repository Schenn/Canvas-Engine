/**
 * Created by schenn on 4/17/16.
 */
(function() {
  var utils = CanvasEngine.utilities;

  var timer = function(params, entity){
    var date = new Date();
    var delta = new Date();
    var isActive = true;

    var onBeep = utils.isFunction(params.onElapsed) ? params.onElapsed : null,
      onUpdate = utils.isFunction(params.onUpdate) ? params.onUpdate : null,
      timeUntilBeep = utils.exists(params.duration) ? params.duration : 0,
      beep = this.getMS() + timeUntilBeep;

    this.update = function(){
      if(isActive) {
        delta = date;
        date = new Date();

        // Only beep if we have all the information we need to beep.
        if (utils.isFunction(onBeep) &&
          timeUntilBeep > 0 &&
          this.getMS() >= beep) {

          onBeep(this.deltaTime);
          beep += timeUntilBeep;
        }

        if (utils.isFunction(onUpdate)) {
          onUpdate(this.deltaTime());
        }
      }
    };

    /**
     * Get the current last updated time in milliseconds
     * @type {Function}
     * @method
     *
     */
    this.getMS = (function () {
      return (date.getTime());
    });

    /**
     * Get the current last updated time in seconds
     * @type {Function}
     * @method
     */
    this.getS = (function () {
      return (Math.round(date.getTime / 1000));
    });

    /**
     * Get the time since the last update request
     * @type {Function}
     * @method
     */
    this.deltaTime = (function () {
      return ((date.getTime() - delta.getTime()) / 1000);
    });

    this.getEntity = function(){
      return entity;
    };

    this.disable = function(){
      isActive = false;
    };

    this.enable = function(){
      isActive = true;
    }

  };

  CanvasEngine.EntityManager.addComponent("Timer", function(params, entity){
    return new timer(params, entity);
  }, true);
})();
