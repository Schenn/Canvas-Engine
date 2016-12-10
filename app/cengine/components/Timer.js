/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~TimerParams
 * @property {number} [duration]
 * @property {function} [onUpdate]
 * @property {function} [onElapsed]
 */

import {Component} from "../components/Component.js";
import * as utilities from "../engineParts/utilities.js";

let privateProperties = new WeakMap();

export class Timer extends Component{

  /**
   * Get the current last updated time in milliseconds
   * @return {number}
   */
  get MS(){
    return privateProperties[this.id].date.getTime();
  }

  /**
   * Get the current last updated time in seconds
   * @return {number}
   */
  get S(){
    return (Math.round(privateProperties[this.id].date.getTime() / 1000));
  }

  /**
   * Get the time since the last update request in fractions of a second
   * @return {number}
   *
   */
  get deltaTime() {
    return ((privateProperties[this.id].date.getTime() - privateProperties[this.id].delta.getTime()) / 1000);
  }

  constructor(params, entity){
    super(entity);
    privateProperties[this.id] = {};
    privateProperties[this.id].date = new Date();
    privateProperties[this.id].delta = new Date();
    privateProperties[this.id].isActive = true;

    privateProperties[this.id].onElapsed = utilities.isFunction(params.onElapsed) ? params.onElapsed : null;
    privateProperties[this.id].onUpdate = utilities.isFunction(params.onUpdate) ? params.onUpdate : null;
    privateProperties[this.id].timeUntilBeep = utilities.exists(params.duration) ? params.duration : 0;
    privateProperties[this.id].beep = privateProperties[this.id].date.getTime() + privateProperties[this.id].timeUntilBeep;

  }

  /**
   * Update the date information.
   */
  update(){
    if(privateProperties[this.id].isActive === true) {
      privateProperties[this.id].delta = privateProperties[this.id].date;
      privateProperties[this.id].date = new Date();
      // Only beep if we have all the information we need to beep.
      if (utilities.isFunction(privateProperties[this.id].onElapsed) &&
        privateProperties[this.id].timeUntilBeep > 0 &&
        this.MS >= privateProperties[this.id].beep) {

        privateProperties[this.id].onElapsed(this.deltaTime);

        delete privateProperties[this.id].onElapsed;
      }

      if (utilities.isFunction(privateProperties[this.id].onUpdate)) {
        privateProperties[this.id].onUpdate(this.deltaTime);
        privateProperties[this.id].beep = this.MS+ privateProperties[this.id].timeUntilBeep;
      }

    }
  }

  /**
   * Stop doing things
   */
  disable(){
    privateProperties[this.id].isActive = false;
  }

  /**
   * Do things again
   */
  enable(){
    privateProperties[this.id].isActive = true;
    this.update();
  }
}