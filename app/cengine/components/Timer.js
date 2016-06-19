/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~TimerParams
 * @property {number} [duration]
 * @property {function} [onUpdate]
 * @property {function} [onElapsed]
 */
(function(CanvasEngine) {
  var utils = CanvasEngine.utilities;

  /**
   * The Timer component tracks the passage of time.
   *  It can run a function when a pre-determined amount of time has passed and/or on every update.
   * @param {LocalParams~TimerParams}params
   * @param {CanvasEngine.Entities.Entity} entity
   * @class
   * @memberOf CanvasEngine.Components
   */
  var Timer = function(params, entity){
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
     * @returns {number}
     */
    this.getMS = function () {
      return (date.getTime());
    };

    /**
     * Get the current last updated time in seconds
     * return {number}
     */
    this.getS = function () {
      return (Math.round(date.getTime / 1000));
    };

    /**
     * Get the time since the last update request in fractions of a second
     * return {number}
     */
    this.deltaTime = function () {
      return ((date.getTime() - delta.getTime()) / 1000);
    };

    this.getEntity = function(){
      return entity;
    };

    /**
     * Stop doing things
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
    return new Timer(params, entity);
  }, true);
})(window.CanvasEngine);
