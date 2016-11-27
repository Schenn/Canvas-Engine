/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~AnimatedSpriteParams
 * @property {object.<string, LocalParams~AnimatorParams>} animations
 */

import {Sprite} from "entities/Sprite.js";
import * as utilities from "../engineParts/utilities.js";
const privateProperties = new WeakMap();

export class AnimatedSprite extends Sprite {
  /**
   * @returns {string}
   */
  get CurrentAnimation(){
    return privateProperties[this.name].currentAnimation;
  }

  /**
   *
   * @param {string} animation
   */
  set CurrentAnimation(animation){
    if(utilities.exists(privateProperties[this.name].animations.has(animation))){
      this.messageToSubEntity(privateProperties[this.name].currentAnimation, "disable");
      privateProperties[this.name].currentAnimation = animation;
      this.messageToSubEntity(privateProperties[this.name].currentAnimation, "enable");
    }
  }

  constructor(params, EntityManager){
    super(params, EntityManager);
    privateProperties[this.name] = {};
    privateProperties[this.name].animations = new Map();
    privateProperties[this.name].currentAnimation = "default";

    for(var {[name]:animation} of params.animations) {
      this.addAnimation(name, animation);
    }
  }

  addAnimation(name, animation){
    let animator = this.EntityManager.create("Animator", Object.assign({}, {
        name: name,
        // When the sprite's frame has changed, tell the entity to set the sprite to the next frame.
        onFrameChange: nextFrame=>{
          if(privateProperties[this.name].currentAnimation === name){
            this.setSprite(nextFrame);
          }
        }
      },
      animation));
    if(name !== "default") {
      animator.disable();
    }

    privateProperties[this.name].animations[name] = true;

    this.attachSubEntity(name, animator);
  }
}