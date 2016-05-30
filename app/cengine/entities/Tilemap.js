/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @typedef {object} LocalParams~TileMapEntityParams
 * @property {LocalParams~TileMapParams} tileMap
 *
 */
(function(CanvasEngine){

  var EM = CanvasEngine.EntityManager;

  /**
   * Tell the EntityManager how to make a TileMap
   */
  EM.setMake("TILEMAP",

    /**
     * @param {CanvasEngine.Entities.Entity} entity
     * @param {LocalParams~TileMapEntityParams} params
     * @returns {CanvasEngine.Entities.TileMap}
     */
    function(entity, params){

      /**
       * @class
       * @memberOf CanvasEngine.Entities
       * @augments CanvasEngine.Entities.Entity
       */
      var TileMap = $.extend(true, {}, {
        scroll: function(direction){
          this.messageToComponent("TileMap", "scroll", direction);
        },
        setTileAt: function(coord, value){
          this.messageToComponent("TileMap", "setTile", {coord: coord, val: value});
          this.messageToComponent("Renderer", "markDirty");
        }

      }, entity);

      EM.attachComponent(TileMap, {
        Click: {
          "TileClick": {
            onClick: function(coord){
              TileMap.messageToComponent("TileMap", "TileClick", coord);
            }
          }
        }
      });


      // A tilemap needs to reference a spritesheet
      EM.attachComponent(TileMap, "SpriteSheet", params);

      // A tilemap needs to reference a tilemap component
      EM.attachComponent(TileMap, "TileMap", $.extend({},{
        onScroll: function(){
          TileMap.messageToComponent("Renderer", "markDirty");
        }
      }, params.tileMap));

      // A tilemap needs a renderer component
      EM.attachComponent(TileMap, "Renderer", $.extend({}, {
        draw: function(ctx){
          // Draw each tile in the tilemap
          var tiles = TileMap.getFromComponent("TileMap", "getVisibleTiles", {width: CanvasEngine.Screen.width(), height: CanvasEngine.Screen.height()});
          var tileSize = TileMap.getFromComponent("TileMap", "getTileSize");
          // for each row
          for(var y =0; y < tiles.length; y++){
            // for each col in row
            for(var x=0; x < tiles[y].length; x++){
              var spriteName = tiles[y][x];
              var tile = TileMap.getFromComponent("SpriteSheet", "getSprite", spriteName);

              var imgSource = TileMap.getFromComponent("SpriteSheet", "source");
              var output =$.extend({},{
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


      return TileMap;

  });

})(window.CanvasEngine);