/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~AnimatedSpriteParams
 * @property {object.<string, LocalParams~AnimatorParams>} animations
 */

import {Sprite} from "./Sprite.js";
import * as utilities from "../engineParts/utilities.js";
const privateProperties = new WeakMap();

/**
 * An Animated Sprite is an entity which uses a collection of sprite images
 *   and a timer to animate its display through those sprites.
 *
 * By extending from an Animated Sprite, you can control what collection of sprites
 *    to use at a given time. This way your sprite can continue to
 *      animate automatically, while changing what specific effects you are rendering.
 */
export class AnimatedSprite extends Sprite {
  /**
   * The name of the current animation
   * @returns {string}
   */
  get CurrentAnimation(){
    return privateProperties[this.name].currentAnimation;
  }

  /**
   * Set the current animation to a assigned set of instructions.
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

  /**
   * Create a new Animated Sprite
   * @param {Object} params
   * @param {EntityManager} EntityManager
   */
  constructor(params, EntityManager){
    super(params, EntityManager);
    privateProperties[this.name] = {};
    privateProperties[this.name].animations = new Map();
    privateProperties[this.name].currentAnimation = "default";

    let names = Object.keys(params.animations);

    names.forEach((name, i)=>{
      this.addAnimation(name, params.animations[name]);
    });
  }

  /**
   * Add animation instructions to the Animated Sprite
   *
   * @param {String} name
   * @param {Object} animation
   */
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