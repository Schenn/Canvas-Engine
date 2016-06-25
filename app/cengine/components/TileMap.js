/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @typedef {object} GeneralTypes~Tile
 * @property {*} tile
 * @property {number} x
 * @property {number} y
 * @property {number} row
 * @property {number} col
 *
 */
/**
 * @callback Callbacks~onScroll
 */
/**
 * @callback Callbacks~onTileClick
 * @this {GeneralTypes~Tile}
 */

import properties from "../engineParts/propertyDefinitions.js";
import Component from "Component.js";
import * as utilities from "../engineParts/utilities";

let tiles = Symbol("Tiles");
let scrollOffset = Symbol("ScrollOffset");
let tileSize = Symbol("TileSize");
let onTileClick = Symbol("onTileClick");

/**
 * A TileMap Component manages maintaining a collection of values in specific 2-d array positions.
 *  Those values can then be used against other components or data in reference.
 *
 * @class TileMap
 * @param {object} params
 * @param {number} params.width
 * @param {number} params.height
 * @param {Array} [params.tiles]
 * @param {Callbacks~onScroll} [params.onScroll]
 * @param {Callbacks~onTileClick} [params.onTileClick]
 * @param {CanvasEngine.Entities.Entity} entity
 *
 * @memberOf CanvasEngine.Components
 */
class TileMap extends Component {
  get TileSize(){
    return this[tileSize];
  }


  constructor(params, entity){
    super(entity);
    this[tiles] = utilities.exists(params.tiles) ? params.tiles :[];
    this[scrollOffset] = {};
    this[tileSize] = {
      width: params.width, height: params.height
    };

    if(utilities.isFunction(params.onTileClick)) {
      this[onTileClick]= params.onTileClick;
    }

    properties.observe({name: "x", value: 0, callback: params.onScroll}, this[scrollOffset]);
    properties.observe({name: "y", value: 0, callback: params.onScroll}, this[scrollOffset]);
  }

  asObject(){
    return properties.proxy(this[tiles]);
  }

  /**
   * Scroll the TileMap
   * @param {coords} direction
   */
  scroll(direction){
    var actualX = Math.round(direction.x / this[tileSize].width);
    var actualY = Math.round(direction.y / this[tileSize].height);
    // Change our initial tile position based on the distance in pixels over the size of a tile.
    this[scrollOffset].x += actualX;
    this[scrollOffset].y += actualY;

    // Tell the CanvasEngine event manager to fire a scrollMap event.
    // If there's a scrollMap event, living, non-gui entities should be forced
    //    to move the tileDistance which actually occurred.

    // CanvasEngine.EventManager.fire("ScrollWorld", {x: actualX * tileSize.width, y: actualY * tileSize.height});
  }

  /**
   * Get the tiles visible inside an area starting from the scrolled-to position
   * @param {{height: number, width: number}} area
   * @returns {Array}
   */
  getVisibleTiles(area){
    if(this[tileSize].height === 0 || this[tileSize].width ===0){
      return [];
    }

    let tiles = [];
    // y index for return tiles
    let yI = 0;
    // x index for return tiles
    let xI;
    // y position in tileMap
    // scrollOffset.y = firstColumn
    // scrollOffset.y + Math.round(area.height / tileSize.height) = maxY?

    let maxY = this[scrollOffset].y + Math.round(area.height / this[tileSize].height);
    let maxX = this[scrollOffset].x + Math.round(area.width / this[tileSize].width);
    for(let y = this[scrollOffset].y; y < maxY; y++) {
      tiles[yI] = [];
      xI= 0;
      // x position in tileMap
      for (let x = this[scrollOffset].x; x < maxX; x++) {
        tiles[yI][xI] = this[tiles][y][x];
        xI++;
      }
      yI++;
    }
    return tiles;
  }

  /**
   * Convert a pixel position into a tile element.
   *  x, and y represent the position's area in pixels.
   *
   * @param {coords} coord
   * @returns {{tile: *, x: number, y: number, row: number, col: number}}
   */
  pixelToTile(coord){
    let row = Math.floor(coord.y / this[tileSize].height) + this[scrollOffset].y;
    let col = Math.floor(coord.x / this[tileSize].width);

    if (utilities.exists(this[tiles][row]) && utilities.exists(this[tiles][row][col])) {
      return {
        tile: this[tiles][row][col],
        x: col * this[tileSize].width,
        y: row * this[tileSize].height,
        row: row,
        col: col
      };
    }
  }

  /**
   * Do some user set function when a Tile is Clicked.
   * The user function is run against the position of the tile being clicked.
   *  In other words: The 'this' in your method will be the return value for pixelToTile
   *
   * @param {coords} coord
   *
   */
  TileClick(coord){
    if(utilities.isFunction(this[onTileClick])){
      var tile = this.pixelToTile(coord);
      this[onTileClick].call(tile);
    }
  }

  /**
   * Override a tile state value
   *
   * @param {coords} coord
   * @param {*} newName - Should just be a string or number but realistically could be anything.
   */
  setTile(coord, newName){
    if(utilities.exists(this[tiles][coord.y][coord.x])) {
      this[tiles][coord.y][coord.x] = newName;
    }
  }
}

export default TileMap;