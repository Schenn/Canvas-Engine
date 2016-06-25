/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {Object.<string, number>} GeneralTypes~CoordinateCollection
 * @property {number} ...x
 * @property {number} ...y
 */

import Component from "Component.js"
import properties from "../engineParts/propertyDefinitions.js"
import * as utilities from "../engineParts/utilities.js"

let coordinateArray = Symbol("coordinateArray");
let coordinates = Symbol("coordinates");

class PointPlotter extends Component {
  constructor(params, entity){
    super(entity, params.callback);
    this[coordinateArray] = [];
    let coordinateObj = {};
    this.setProperty("coords", coordinateObj);
    if(utilities.exists(params.coords)){
      this.plot(params.coords);
    }
  }

  /**
   * Transform the set of coordinates into xy positions that trigger the callback on change.
   * @param {GeneralTypes~coords} coords
   */
  plot(coords){
    this[coordinateArray] = coords;
    for (var i = 1; i <= coords.length; i++) {

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
    var smallX = 0;
    var smallY = 0;
    var bigX = 0;
    var bigY = 0;
    for (var i = 0; i < this[coordinateArray].length; i++) {
      if (this[coordinateArray][i].x <= smallX) {
        smallX = this[coordinateArray][i].x;
      }
      if (this[coordinateArray][i].y <= smallX) {
        smallY = this[coordinateArray][i].y;
      }
      if (this[coordinateArray][i].x >= bigX) {
        bigX = this[coordinateArray][i].x;
      }
      if (this[coordinateArray][i].y >= bigY) {
        bigY = this[coordinateArray][i].y;
      }
    }

    return ({
      x: smallX, y: smallY,
      width:  bigX - smallX, height: bigY - smallY
    });
  };

  get CoordinateArray(){
    return properties.proxy(this[coordinateArray]);
  }

  get Coordinates(){
    return properties.proxy(this.coords);
  }

  asObject(){
    return this.Coordinates;
  }
}

export default PointPlotter