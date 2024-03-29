/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @typedef {object} LocalParams~TileMapEntityParams
 * @property {LocalParams~TileMapParams} tileMap
 *
 */

import {Entity} from "./Entity.js";

/**
 * Maintain the collection of information needed to render a tilesheet in a desired way.
 *  Can also handle triggering mouse events on its tiles.
 *  Can scroll that tilemap if it's larger than the screen dimensions.
 */
export class TileMap extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);
    EntityManager.attachComponent(this,"TileMap", {
      Click: {
        "TileClick": {
          onClick: coord=>{
            this.askComponent("TileMap", "TileClick", coord);
          }
        },
        onScroll: ()=>{
          this.askComponent("Renderer", "markDirty");
        }
      },
      tileSize: {
        height: params.tileMap.height,
        width: params.tileMap.width
      },
      tiles: params.tileMap.tiles
    });

    // A tilemap needs to reference a spritesheet
    EntityManager.attachComponent(this, "SpriteSheet", params);

    // A tilemap needs a renderer component
    EntityManager.attachComponent(this, "Renderer", Object.assign({}, {
      draw: function(ctx){
        // Draw each tile in the tilemap
        let tiles = this.Entity.askComponent("TileMap", "getVisibleTiles", {width: CanvasEngine.Screen.width, height: CanvasEngine.Screen.height});
        let tileSize = this.Entity.askComponent("TileMap", "TileSize");
        let imgSource = this.Entity.askComponent("SpriteSheet", "source");

        // for each row
        for(let y =0; y < tiles.length; y++){
          // for each col in row
          for(let x=0; x < tiles[y].length; x++){
            let spriteName = tiles[y][x];
            let tile = this.Entity.askComponent("SpriteSheet", "getSprite", spriteName);


            let output =Object.assign({},{
              x: x * tileSize.width,
              y: y * tileSize.height,
              source: imgSource,
              sx: tile.x, sy: tile.y,
              sHeight: tile.height, sWidth: tile.width,
              height: tileSize.height, width: tileSize.width
            });
            ctx.drawImage(output);
          }
        }
      },
      clearInfo: function(){
        // Clear the whole screen.
        // When a Tilemap changes, it's because it scrolled.

        /**
         * We may be able to get away with only clearing the area that the visible tiles don't cover...
         *
         * The tiles will be re-drawn on their 'dirty' area when their draw pass comes. However,
         *    If there aren't enough tiles to fill the visible area (due to the extent of the scroll and
         *      the resolution of the canvas), then we only need to clear the area without tiles.
         */

        return {
          x:0, y:0, height: CanvasEngine.Screen.height, width: CanvasEngine.Screen.width
        };
      }
    }, params));
  }

  /**
   * Update the currently visible tiles based off a requested direction
   *
   * @param direction
   */
  scroll(direction){
    this.askComponent("TileMap", "scroll", direction);
  }

  /**
   * Set a given tile to another one from the already loaded tileset.
   * @param coord
   * @param value
   */
  setTileAt(coord, value){
    this.askComponent("TileMap", "setTile", {coord: coord, val: value});
    this.askComponent("Renderer", "markDirty");
  }
}