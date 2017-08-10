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

import {properties} from "../engineParts/propertyDefinitions.js";
import {Component} from "./Component.js";

const privateProperties = new WeakMap();

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
export class TileMap extends Component {
  get TileSize(){
    return privateProperties[this.id].tileSize;
  }

  get tiles(){
    return privateProperties[this.id].tiles;
  }

  get offset(){
    return privateProperties[this.id].scrollOffset;
  }

  get x(){
    return privateProperties[this.id].scrollOffset.x;
  }

  set x(x){
    if(Component.utilities.isNumeric(x)){
      privateProperties[this.id].scrollOffset.x = x;
      privateProperties[this.id].onScroll();
    }
  }

  get y(){
    return privateProperties[this.id].scrollOffset.y;
  }

  set y(y){
    if(Component.utilities.isNumeric(y)){
      privateProperties[this.id].scrollOffset.y = y;
      privateProperties[this.id].onScroll();
    }
  }

  constructor(params, entity){
    super(entity);
    privateProperties[this.id] = {};
    privateProperties[this.id].tiles = Component.utilities.exists(params.tiles) ?
        params.tiles :
        [];

    privateProperties[this.id].scrollOffset = {};
    privateProperties[this.id].tileSize = {
      width: params.tileSize.width,
      height: params.tileSize.height
    };

    if(Component.utilities.isFunction(params.onTileClick)) {
      privateProperties[this.id].onTileClick= params.onTileClick;
    }

    if(Component.utilities.isFunction(params.onScroll)){
      privateProperties[this.id].onScroll = params.onScroll;
    } else {
      privateProperties[this.id].onScroll = () => {};
    }

    this.x = 0;
    this.y = 0;
  }

  asObject(){
    return privateProperties[this.id].tiles;
  }

  /**
   * Scroll the TileMap
   * @param {GeneralTypes~coords} direction
   */
  scroll(direction){
    let actualX = Math.round(direction.x /
       this.TileSize.width);

    let actualY = Math.round(direction.y /
        this.TileSize.height);

    // Change our initial tile position based on the distance in pixels over the size of a tile.
    privateProperties[this.id].scrollOffset.x += actualX;
    privateProperties[this.id].scrollOffset.y += actualY;

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
    if(this.TileSize.height === 0 || this.TileSize.width ===0){
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

    let maxY = this.y + Math.round(area.height / this.TileSize.height);

    let maxX = this.x + Math.round(area.width / this.TileSize.width);

    for(let y = this.y; y < maxY; y++) {
      tiles[yI] = [];
      xI= 0;
      // x position in tileMap
      for (let x = this.x; x < maxX; x++) {
        tiles[yI][xI] = this.tiles[y][x];
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
   * @param {GeneralTypes~coords} coord
   * @returns {{tile: *, x: number, y: number, row: number, col: number}}
   */
  pixelToTile(coord){
    let row = Math.floor(coord.y / this.TileSize.height) + this.y;
    let col = Math.floor(coord.x / this.TileSize.width);

    if (Component.utilities.exists(this.tiles[row]) &&
        Component.utilities.exists(this.tiles[row][col])) {
      return {
        tile: this.tiles[row][col],
        x: col * this.TileSize.width,
        y: row * this.TileSize.height,
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
    if(Component.utilities.isFunction(privateProperties[this.id].onTileClick)){
      let tile = this.pixelToTile(coord);
      privateProperties[this.id].onTileClick.call(tile);
    }
  }

  /**
   * Override a tile state value
   *
   * @param {GeneralTypes~coords} coord
   * @param {*} newName - Should just be a string or number but realistically could be anything.
   */
  setTile(coord, newName){
    if(Component.utilities.exists(this.tiles[coord.y][coord.x])) {
      privateProperties[this.id].tiles[coord.y][coord.x] = newName;
    }
  }
}