/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~TimerParams
 * @property {number} [duration]
 * @property {function} [onUpdate]
 * @property {function} [onElapsed]
 */

import Component from "Component.js";
import * as utilities from "../engineParts/utilities.js";

import privateProperties from "../engineParts/propertyDefinitions";

class Timer extends Component{

  /**
   * Get the current last updated time in milliseconds
   * @return {number}
   */
  get MS(){
    return privateProperties[this].date.getTime();
  }

  /**
   * Get the current last updated time in seconds
   * @return {number}
   */
  get S(){
    return (Math.round(privateProperties[this].date.getTime() / 1000));
  }

  /**
   * Get the time since the last update request in fractions of a second
   * @return {number}
   *
   */
  get deltaTime() {
    return ((privateProperties[this].date.getTime() - privateProperties[this].delta.getTime()) / 1000);
  }

  constructor(params, entity){
    super(entity);

    privateProperties[this].date = new Date();
    privateProperties[this].delta = new Date();
    privateProperties[this].isActive = true;

    privateProperties[this].onBeep = utilities.isFunction(params.onElapsed) ? params.onElapsed : null;
    privateProperties[this].onUpdate = utilities.isFunction(params.onUpdate) ? params.onUpdate : null;
    privateProperties[this].timeUntilBeep = utilities.exists(params.duration) ? params.duration : 0;
    privateProperties[this].beep = privateProperties[this].date.getDate() + privateProperties[this].timeUntilBeep;

  }

  /**
   * Update the date information.
   */
  update(){
    if(privateProperties[this].isActive === true) {
      privateProperties[this].delta = privateProperties[this].date;
      privateProperties[this].date = new Date();
      // Only beep if we have all the information we need to beep.
      if (utilities.isFunction(privateProperties[this].onBeep) &&
        privateProperties[this].timeUntilBeep > 0 &&
        this.MS >= privateProperties[this].beep) {

        privateProperties[this].onBeep(this.deltaTime);
        privateProperties[this].beep = this.MS+ privateProperties[this].timeUntilBeep;
      }

      if (utilities.isFunction(privateProperties[this].onUpdate)) {
        privateProperties[this].onUpdate(this.deltaTime);
      }
    }
  }

  /**
   * Stop doing things
   */
  disable(){
    privateProperties[this].isActive = false;
  }

  /**
   * Do things again
   */
  enable(){
    privateProperties[this].isActive = true;
    this.update();
  }
}

export default Timer;