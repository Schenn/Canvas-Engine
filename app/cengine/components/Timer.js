/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~TimerParams
 * @property {number} [duration]
 * @property {function} [onUpdate]
 * @property {function} [onElapsed]
 */

import Component from "Component.js"
import * as utilities from "../engineParts/utilities.js"

let date = Symbol("date");
let delta = Symbol("delta");
let isActive = Symbol("isActive");
let onBeep = Symbol("onBeep");
let onUpdate = Symbol("onUpdate");
let timeUntilBeep = Symbol("timeUntilBeep");
let beep = Symbol("beep");

class Timer extends Component{
  constructor(params, entity){
    super(entity);

    this[date] = new Date();
    this[delta] = new Date();
    this[isActive] = true;

    this[onBeep] = utilities.isFunction(params.onElapsed) ? params.onElapsed : null;
    this[onUpdate] = utilities.isFunction(params.onUpdate) ? params.onUpdate : null;
    this[timeUntilBeep] = utilities.exists(params.duration) ? params.duration : 0;
    this[beep] = this[date].getDate() + this[timeUntilBeep];

  }

  /**
   * Update the date information.
   */
  update(){
    if(this[isActive] == true) {
      this[delta] = this[date];
      this[date] = new Date();
      // Only beep if we have all the information we need to beep.
      if (utilities.isFunction(this[onBeep]) &&
        this[timeUntilBeep] > 0 &&
        this.getMS() >= this[beep]) {

        this[onBeep](this.deltaTime);
        this[beep] = this.getMS()+ this[timeUntilBeep];
      }

      if (utilities.isFunction(this[onUpdate])) {
        this[onUpdate](this.deltaTime());
      }
    }
  }

  /**
   * Get the current last updated time in milliseconds
   * @returns {number}
   */
  getMS() {
    return (this[date].getTime());
  }

  /**
   * Get the current last updated time in seconds
   * return {number}
   */
  getS() {
    return (Math.round(this[date].getTime() / 1000));
  }

  /**
   * Get the time since the last update request in fractions of a second
   * return {number}
   */
  deltaTime() {
    return ((this[date].getTime() - this[delta].getTime()) / 1000);
  }

  /**
   * Stop doing things
   */
  disable(){
    this[isActive] = false;
  }

  /**
   * Do things again
   */
  enable(){
    this[isActive] = true;
    this.update();
  }
}

export default Timer;