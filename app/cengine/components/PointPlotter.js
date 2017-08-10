/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {Object.<string, number>} GeneralTypes~CoordinateCollection
 * @property {number} ...x
 * @property {number} ...y
 */

import {Component} from "./Component.js";
import {properties} from "../engineParts/propertyDefinitions.js";

const privateProperties = new WeakMap();

/**
 * @class PointPlotter
 * @memberOf CanvasEngine.Components
 * @property {GeneralTypes~CoordinateCollection} coords
 */
export class PointPlotter extends Component {
  /**
   * @param {object} params
   * @param {GeneralTypes~coords[]} params.coords
   * @param {Callbacks~onPropertyChanged} params.callback
   * @param {Entity} entity
   */
  constructor(params, entity){
    super(entity, params.callback);
    privateProperties[this.id] = {};
    privateProperties[this.id].coordinateArray = [];
    let coordinateObj = {};
    this.setProperty("coords", coordinateObj);
    if(Component.utilities.exists(params.coords)){
      this.plot(params.coords);
    }
  }

  /**
   * Transform the set of coordinates into xy positions that trigger the callback on change.
   * @param {GeneralTypes~coords[]} coords
   */
  plot(coords){
    privateProperties[this.id].coordinateArray = coords;
    for (let i = 1; i <= coords.length; i++) {

      // If we don't have the x coordinate property, create it.
      if(!this.coords.hasOwnProperty("x"+i)) {
        properties.observe({name:"x"+i,value: coords[i-1].x, callback: this.propertyCallback}, this.coords);
      }
      else {
        this.coords["x" + i] = coords[i - 1].x;
      }

      // If we don't have the y coordinate property, create it.
      if(!this.coords.hasOwnProperty("y"+i)) {
        properties.observe({name:"y"+i,value: coords[i-1].x, callback: this.propertyCallback}, this.coords);
      } else {
        this.coords["y" + i] = coords[i - 1].y;
      }
    }
  }
  /**
   * Get the bounding area of the points
   *
   * @todo use iterator instead of for loop
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  getArea(){
    let smallX = 0;
    let smallY = 0;
    let bigX = 0;
    let bigY = 0;
    for (let i = 0; i < privateProperties[this.id].coordinateArray.length; i++) {
      if (privateProperties[this.id].coordinateArray[i].x <= smallX) {
        smallX = privateProperties[this.id].coordinateArray[i].x;
      }
      if (privateProperties[this.id].coordinateArray[i].y <= smallX) {
        smallY = privateProperties[this.id].coordinateArray[i].y;
      }
      if (privateProperties[this.id].coordinateArray[i].x >= bigX) {
        bigX = privateProperties[this.id].coordinateArray[i].x;
      }
      if (privateProperties[this.id].coordinateArray[i].y >= bigY) {
        bigY = privateProperties[this.id].coordinateArray[i].y;
      }
    }

    return ({
      x: smallX, y: smallY,
      width:  bigX - smallX, height: bigY - smallY
    });
  }

  get CoordinateArray(){
    return properties.proxy(privateProperties[this.id].coordinateArray);
  }

  get Coordinates(){
    return properties.proxy(this.coords);
  }

  asObject(){
    return this.Coordinates;
  }
}