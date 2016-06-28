/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @typedef {object} LocalParams~TileMapEntityParams
 * @property {LocalParams~TileMapParams} tileMap
 *
 */

import Entity from "Entity.js";

class TileMap extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);
    let self=this;

    EntityManager.attachComponent("TileMap", {
      Click: {
        "TileClick": {
          onClick: function(coord){
            self.messageToComponent("TileMap", "TileClick", coord);
          }
        }
      }
    });

    // A tilemap needs to reference a spritesheet
    EntityManager.attachComponent(this, "SpriteSheet", params);

    // A tilemap needs to reference a tilemap component
    EntityManager.attachComponent(this, "TileMap", $.extend({},{
      onScroll: function(){
        TileMap.messageToComponent("Renderer", "markDirty");
      }
    }, params.tileMap));

    // A tilemap needs a renderer component
    EntityManager.attachComponent(this, "Renderer", $.extend({}, {
      draw: function(ctx){
        // Draw each tile in the tilemap
        var tiles = self.getFromComponent("TileMap", "getVisibleTiles", {width: CanvasEngine.Screen.width(), height: CanvasEngine.Screen.height()});
        var tileSize = self.getFromComponent("TileMap", "getTileSize");
        // for each row
        for(let y =0; y < tiles.length; y++){
          // for each col in row
          for(let x=0; x < tiles[y].length; x++){
            let spriteName = tiles[y][x];
            let tile = self.getFromComponent("SpriteSheet", "getSprite", spriteName);

            let imgSource = self.getFromComponent("SpriteSheet", "source");
            let output =$.extend({},{
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
          x:0, y:0, height: CanvasEngine.Screen.height(), width: CanvasEngine.Screen.width()
        };
      }
    }, params));
  }

  scroll(direction){
    this.messageToComponent("TileMap", "scroll", direction);
  }

  setTileAt(coord, value){
    this.messageToComponent("TileMap", "setTile", {coord: coord, val: value});
    this.messageToComponent("Renderer", "markDirty");
  }
}

export default TileMap;