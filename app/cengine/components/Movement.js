/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @callback Callbacks~onDirectionChange
 * @param {object} direction
 * @param {string} direction.direction - The character representation of the direction of movement
 * @param {number} direction.xSpeed - The x axis speed
 * @param {number} direction.ySpeed - The y axis speed.
 * @this CanvasEngine.Components#Movement
 *
 * @todo Bind this to the Entity, not the movement component
 *
 * @see {CanvasEngine.Components.getDirection}
 */

import {Component} from "./Component.js";
import {properties} from "../engineParts/propertyDefinitions.js";
import * as utilities from "../engineParts/utilities.js";
const privateProperties = new WeakMap();

/**
 * The movement component adjusts the current position based on speed and the passage of time
 *
 * @class Movement
 * @memberOf CanvasEngine.Components
 * @property {number} Movement.x
 * @property {number} Movement.y

 */
export class Movement extends Component {
  /**
   * @param {object} params
   * @param {number} params.x
   * @param {number} params.y
   * @param {number} [params.xSpeed]
   * @param {number} [params.ySpeed]
   * @param {Callbacks~onDirectionChange} [params.onDirectionChange] A callback which is fired when the direction of the movement component changes
   * @param {Callbacks~onPropertyChanged} [params.onMoveX] A callback which is fired when the component moves along the x Axis
   * @param {Callbacks~onPropertyChanged} [params.onMoveY] A callback which is fired when the component moves along the y Axis
   * @param {CanvasEngine.Entities.Entity} entity
   */
  constructor(params, entity) {
    super(entity);
    privateProperties[this.id] = {};
    if(!utilities.exists(params.x) || !utilities.exists(params.y)){
      throw "Movement component did not get point of origin in constructor.";
    }
    privateProperties[this.id].currentX = params.x;
    privateProperties[this.id].currentY = params.y;
    privateProperties[this.id].xSpeed = utilities.exists(params.xSpeed) ? params.xSpeed : 0;
    privateProperties[this.id].ySpeed = utilities.exists(params.ySpeed) ? params.ySpeed : 0;

    privateProperties[this.id].destX = 0;
    privateProperties[this.id].destY = 0;
    privateProperties[this.id].lastDirection = null;

    if (utilities.isFunction(params.onDirectionChange)) {
      this.onDirectionChange = params.onDirectionChange.bind(this);
    }

    properties.observe({name: "x", value: privateProperties[this.id].currentX, callback: params.onMoveX}, this);
    properties.observe({name: "y", value: privateProperties[this.id].currentY, callback: params.onMoveY}, this);
  }

  /**
   * Adjust the position based on axis speeds
   *
   * @param {number} delta The seconds as a decimal since the last render call.
   */
  move(delta) {
    if(!utilities.exists(delta)){
      delta = 1;
    }

    this.x += (privateProperties[this.id].xSpeed !== 0) ? privateProperties[this.id].xSpeed * delta : 0;
    this.y += (privateProperties[this.id].ySpeed !== 0) ? privateProperties[this.id].ySpeed * delta : 0;

    if (privateProperties[this.id].xSpeed > 0) {
      if (privateProperties[this.id].destX !== 0 && this.x >= privateProperties[this.id].destX) {
        privateProperties[this.id].xSpeed = 0;
      }
    } else if (privateProperties[this.id].xSpeed < 0) {
      if (this.x <= privateProperties[this.id].destX && privateProperties[this.id].destX !== 0) {
        privateProperties[this.id].xSpeed = 0;
      }
    }

    if (privateProperties[this.id].ySpeed > 0) {
      if (privateProperties[this.id].destY !== 0 && this.y >= privateProperties[this.id].destY) {
        privateProperties[this.id].ySpeed = 0;
      }
    } else if (privateProperties[this.id].ySpeed < 0) {
      if (privateProperties[this.id].destY !== 0 && this.y <= privateProperties[this.id].destY) {
        privateProperties[this.id].ySpeed = 0;
      }
    }

    if (this.getDirection().direction !== privateProperties[this.id].lastDirection && utilities.isFunction(this.onDirectionChange)) {
      var dir = this.getDirection();
      this.onDirectionChange(dir);
      privateProperties[this.id].lastDirection = dir.direction;
    }
  }

  /**
   * Set the axis speeds.
   *
   * @param {object} speeds
   * @param {number} [speeds.xSpeed]
   * @param {number} [speeds.ySpeed]
   *
   */
  setSpeed(speeds) {
    privateProperties[this.id].xSpeed = utilities.exists(speeds.xSpeed) ? speeds.xSpeed : privateProperties[this.id].xSpeed;
    privateProperties[this.id].ySpeed = utilities.exists(speeds.ySpeed) ? speeds.ySpeed : privateProperties[this.id].ySpeed;
  }

  /**
   * Set the origin point
   *
   * @param {GeneralTypes~coords} coords
   */
  setOrigin(coords) {
    this.x = coords.x;
    this.y = coords.y;
  }

  /**
   * Get this components data as a literal object
   *
   * @returns {{x: number, y: number, xSpeed: number, ySpeed: number}}
   */
  asObject() {
    return {x: this.x, y: this.y, xSpeed: privateProperties[this.id].xSpeed, ySpeed: privateProperties[this.id].ySpeed};
  }

  /**
   * Get a "Direction" of movement based on the given axis speeds.
   *
   * @returns {{direction: string, xSpeed: number, ySpeed: number}}
   */
  getDirection() {
    var direction = "";

    if(privateProperties[this.id].ySpeed > 0) {
      direction += "S";
    } else if(privateProperties[this.id].ySpeed < 0) {
      direction += "N";
    }

    if(privateProperties[this.id].xSpeed > 0) {
      direction += "E";
    } else if(privateProperties[this.id].xSpeed < 0){
      direction += "W";
    }

    return {
      direction: direction,
      xSpeed: privateProperties[this.id].xSpeed,
      ySpeed: privateProperties[this.id].ySpeed
    };
  }

  /**
   * Travel a distance in a given direction.
   *
   * When the entity reaches that destination,
   *  it will set it's speeds to 0 and stop moving.
   *
   * @param distance {{x: number, y: number, speed: number }}
   */
  travel(distance) {
    if (privateProperties[this.id].ySpeed === 0) {
      if (utilities.exists(distance.y)) {
        privateProperties[this.id].destY = this.y + distance.y;
        if (distance.y < 0) {
          privateProperties[this.id].ySpeed = Math.abs(distance.speed) * -1;
        } else {
          privateProperties[this.id].ySpeed = Math.abs(distance.speed);
        }
      }
    }

    if (privateProperties[this.id].xSpeed === 0) {
      if (utilities.exists(distance.x)) {
        privateProperties[this.id].destX = this.x + distance.x;
        if (distance.x < 0) {
          privateProperties[this.id].xSpeed = Math.abs(distance.speed) * -1;
        } else {
          privateProperties[this.id].xSpeed = Math.abs(distance.speed);
        }
      }
    }

  }

}