/**
 * Created by schenn on 3/25/16.
 */
/**
 * This class keeps track of the time between animation requests and should be used to modulate the speed of simulations
 * @constructor
 * @class Timer
 */
function Timer() {
  this.date = new Date();
  this.delta = new Date();
}

/**
 * Update the times on the timer
 *
 * @method
 * @type {Function}
 */
Timer.prototype.update = (function () {
  this.delta = this.date;
  this.date = new Date();
});

/**
 * Get the current last updated time in milliseconds
 * @type {Function}
 * @method
 *
 */
Timer.prototype.getMS = (function () {
  return (this.date.getTime());
});

/**
 * Get the current last updated time in seconds
 * @type {Function}
 * @method
 */
Timer.prototype.getS = (function () {
  return (Math.round(this.date.getTime / 1000));
});

/**
 * Get the time since the last update request
 * @type {Function}
 * @method
 */
Timer.prototype.deltaTime = (function () {
  return ((this.date.getTime() - this.delta.getTime()) / 1000);
});