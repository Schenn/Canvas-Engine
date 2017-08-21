/**
 * For Typing
 */
import * as utilities from "../engineParts/utilities.js";

class Resource {
  constructor(){
    this.resourceId = `RES_$(utilities.randName())`;
  }

  static get utilities (){
    return utilities;
  }
}