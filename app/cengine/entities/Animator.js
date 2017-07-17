/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~AnimatorParams
 * @property {function} onFrameChange
 * @property {number} duration
 * @property {Array} [frames]
 * @property {number} [frameCount]
 */

import {Entity} from "./Entity.js";

import * as utilities from "../engineParts/utilities.js";

const privateProperties = new WeakMap();

/**
 * Animator uses a timer to count through a collection of strings as frames.
 * When a frame is updated, it informs whoever is listening via the onFrameChanged callback provided.
 *
 */
export class Animator extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);
    privateProperties[this.name] = {};
    if(utilities.exists(params.frames)){
      privateProperties[this.name].frames = params.frames;
      privateProperties[this.name].frameCount = frames.length;
    } else {
      privateProperties[this.name].frameCount = utilities.exists(params.frameCount) ? params.frameCount : 1;
      privateProperties[this.name].frames = [];
      for(let i =0; i < privateProperties[this].frameCount; i++){
        privateProperties[this.name].frames.push(i);
      }
    }

    privateProperties[this.name].baseDuration = params.duration;
    privateProperties[this.name].duration = (privateProperties[this.name].baseDuration > 0) ?
      privateProperties[this.name].baseDuration / privateProperties[this.name].frameCount :
      0;

    privateProperties[this.name].currentFrame = 0;

    EntityManager.attachComponent(this,"Timer",
      {
        duration: privateProperties[this.name].duration,
        onElapsed: function(){
          privateProperties[this.name].currentFrame++;
          if(privateProperties[this.name].currentFrame > privateProperties[this.name].frameCount-1){
            privateProperties[this.name].currentFrame = 0;
          }
          onFrameChange(privateProperties[this.name].frames[privateProperties[this.name].currentFrame]);
        }
      }
    );
  }

  /**
   * Disable the Animator
   */
  disable(){
    this.messageToComponent("Timer", "disable");
  }
  /**
   * Enable the Animator
   */
  enable(){
    this.messageToComponent("Timer", "enable");
  }
}

export default Animator;