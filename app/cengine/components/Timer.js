/**
 * Created by schenn on 4/17/16.
 */
(function() {
  var utils = CanvasEngine.utilities;

  /**
   * The Timer component tracks the passage of time.
   *  It can run a function when a pre-determined amount of time has passed and/or on every update.
   * @param params
   * @param entity
   */
  var timer = function(params, entity){
    var date = new Date();
    var delta = new Date();
    var isActive = true;

    var onBeep = utils.isFunction(params.onElapsed) ? params.onElapsed : null,
      onUpdate = utils.isFunction(params.onUpdate) ? params.onUpdate : null,
      timeUntilBeep = utils.exists(params.duration) ? params.duration : 0,
      beep = date.getDate() + timeUntilBeep;

    /**
     * Update the date information.
     */
    this.update = function(){
      if(isActive) {
        delta = date;
        date = new Date();
        // Only beep if we have all the information we need to beep.
        if (utils.isFunction(onBeep) &&
          timeUntilBeep > 0 &&
          this.getMS() >= beep) {

          onBeep(this.deltaTime);
          beep = this.getMS()+ timeUntilBeep;
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
    this.getMS = function () {
      return (date.getTime());
    };

    /**
     * Get the current last updated time in seconds
     * @type {Function}
     * @method
     */
    this.getS = function () {
      return (Math.round(date.getTime / 1000));
    };

    /**
     * Get the time since the last update request
     * @type {Function}
     * @method
     */
    this.deltaTime = function () {
      return ((date.getTime() - delta.getTime()) / 1000);
    };

    this.getEntity = function(){
      return entity;
    };

    /**
     * Don't do anything.
     */
    this.disable = function(){
      isActive = false;
    };

    /**
     * Do things again
     */
    this.enable = function(){
      isActive = true;
      this.update();
    };

  };

  CanvasEngine.EntityManager.addComponent("Timer", function(params, entity){
    return new timer(params, entity);
  }, true);
})();
