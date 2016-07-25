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

import {Component} from "components/Component.js";
import {properties} from "engineParts/propertyDefinitions.js";
import * as utilities from "engineParts/utilities.js";
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
    privateProperties[this] = {};
    privateProperties[this].currentX = params.x;
    privateProperties[this].currentY = params.y;
    privateProperties[this].xSpeed = utilities.exists(params.xSpeed) ? params.xSpeed : 0;
    privateProperties[this].ySpeed = utilities.exists(params.ySpeed) ? params.ySpeed : 0;

    privateProperties[this].destX = 0;
    privateProperties[this].destY = 0;
    privateProperties[this].lastDirection = null;

    if (utilities.isFunction(params.onDirectionChange)) {
      this.onDirectionChange = params.onDirectionChange.bind(this);
    }

    properties.observe({name: "x", value: privateProperties[this].currentX, callback: params.onMoveX}, this);
    properties.observe({name: "y", value: privateProperties[this].currentY, callback: params.onMoveY}, this);
  }

  /**
   * Adjust the position based on axis speeds
   *
   * @param {number} delta The seconds as a decimal since the last render call.
   */
  move(delta) {
    this.x += (privateProperties[this].xSpeed !== 0) ? privateProperties[this].xSpeed * delta : 0;
    this.y += (privateProperties[this].ySpeed !== 0) ? privateProperties[this].ySpeed * delta : 0;

    if (privateProperties[this].xSpeed > 0) {
      if (privateProperties[this].destX !== 0 && this.x >= privateProperties[this].destX) {
        privateProperties[this].xSpeed = 0;
      }
    } else if (privateProperties[this].xSpeed < 0) {
      if (this.x <= privateProperties[this].destX && privateProperties[this].destX !== 0) {
        privateProperties[this].xSpeed = 0;
      }
    }

    if (privateProperties[this].ySpeed > 0) {
      if (privateProperties[this].destY !== 0 && this.y >= privateProperties[this].destY) {
        privateProperties[this].ySpeed = 0;
      }
    } else if (privateProperties[this].ySpeed < 0) {
      if (privateProperties[this].destY !== 0 && this.y <= privateProperties[this].destY) {
        privateProperties[this].ySpeed = 0;
      }
    }

    if (this.getDirection().direction !== privateProperties[this].lastDirection && utilities.isFunction(this.onDirectionChange)) {
      var dir = this.getDirection();
      this.onDirectionChange(dir);
      privateProperties[this].lastDirection = dir.direction;
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
    privateProperties[this].xSpeed = utilities.exists(speeds.xSpeed) ? speeds.xSpeed : privateProperties[this].xSpeed;
    privateProperties[this].ySpeed = utilities.exists(speeds.ySpeed) ? speeds.ySpeed : privateProperties[this].ySpeed;
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
    return {x: this.x, y: this.y, xSpeed: privateProperties[this].xSpeed, ySpeed: privateProperties[this].ySpeed};
  }

  /**
   * Get a "Direction" of movement based on the given axis speeds.
   *
   * @returns {{direction: string, xSpeed: number, ySpeed: number}}
   */
  getDirection() {
    var direction = "";

    direction += (privateProperties[this].ySpeed > 0) ? "S" : "N";
    if (privateProperties[this].xSpeed !== 0) {
      direction += (privateProperties[this].xSpeed > 0) ? "E" : "W";
    }

    return {
      direction: direction,
      xSpeed: privateProperties[this].xSpeed,
      ySpeed: privateProperties[this].ySpeed
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
    if (privateProperties[this].ySpeed === 0) {
      if (utilities.exists(distance.y)) {
        privateProperties[this].destY = this.y + distance.y;
        if (distance.y < 0) {
          privateProperties[this].ySpeed = Math.abs(distance.speed) * -1;
        } else {
          privateProperties[this].ySpeed = Math.abs(distance.speed);
        }
      }
    }

    if (privateProperties[this].xSpeed === 0) {
      if (utilities.exists(distance.x)) {
        privateProperties[this].destX = this.x + distance.x;
        if (distance.x < 0) {
          privateProperties[this].xSpeed = Math.abs(distance.speed) * -1;
        } else {
          privateProperties[this].xSpeed = Math.abs(distance.speed);
        }
      }
    }

  }

}