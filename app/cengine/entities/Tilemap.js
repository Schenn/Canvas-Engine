(function(){

  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  /**
   * Tell the EntityManager how to make a TileMap
   */
  EM.setMake("TILEMAP", function(entity, params){

    // A tilemap needs to reference a spritesheet
    EM.attachComponent(entity, "SpriteSheet", params);

    // A tilemap needs to reference a tilemap component
    EM.attachComponent(entity, "TileMap", $.extend({},{
      onScroll: function(){
        entity.messageToComponent("Renderer", "markDirty");
      }
    }, params.tileMap));

    // A tilemap needs a renderer component
    EM.attachComponent(entity, "Renderer", $.extend({}, {
      draw: function(ctx){
        // Draw each tile in the tilemap
        var tiles = entity.getFromComponent("TileMap", "getVisibleTiles", {width: CanvasEngine.Screen.width(), height: CanvasEngine.Screen.height()});
        var tileSize = entity.getFromComponent("TileMap", "getTileSize");
        // for each row
        for(var y =0; y < tiles.length; y++){
          // for each col in row
          for(var x=0; x < tiles[y].length; x++){
            var spriteName = tiles[y][x];
            if(spriteName !== null) {
              var tile = entity.getFromComponent("SpriteSheet", "getSprite", spriteName);

              var imgSource = entity.getFromComponent("SpriteSheet", "source");
              var output = $.extend({}, {
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
        }
      },
      clearInfo: function(ctx){
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

    if(utilities.isFunction(params.tileMap.onTileClick)){
      var clickFunc = function (coord) {
        entity.messageToComponent("TileMap", "TileClick", coord);
      };
      if(!entity.hasComponent("Click")) {
        EM.attachComponent(entity, "Click", $.extend({}, {
          onClick: clickFunc
        }));
      } else {
        entity.messageToComponent("Click", "addClickMethods", clickFunc);
      }
    }

    /**
     * Pass-through to tell a tilemap to scroll in a given direction.
     * @param direction
     */
    entity.scroll = function(direction){
      entity.messageToComponent("TileMap", "scroll", direction);
    };

    /**
     * Pass through to set a specific tile to a new tile value.
     *    (e.g. an explosion converts the grass tiles into rock tiles)
     *
     * @param coord
     * @param value
     */
    entity.setTileAt = function(coord, value){
      entity.messageToComponent("TileMap", "setTile", {coord: coord, val: value});
      entity.messageToComponent("Renderer", "markDirty");
    };

    return entity;

  });

})();