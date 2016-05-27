(function(){
  var props = CanvasEngine.EntityManager.properties;
  var utils = CanvasEngine.utilities;

  /**
   * A TileMap Component manages maintaining a collection of values in specific 2-d array positions.
   *  Those values can then be used against other components or data to
   *
   * @param params
   * @param entity
   * @constructor
   */
  var TileMap = function(params, entity){
    var map = utils.exists(params.tiles) ? params.tiles :[];
    var scrollOffset = {};
    Object.defineProperties(scrollOffset,{
      "x":props.defaultProperty(0, params.onScroll),
      "y":props.defaultProperty(0, params.onScroll)
    });
    var tileSize = {
      width:params.width, height:params.height
    };

    var onTileClick = utils.isFunction(params.onTileClick) ? params.onTileClick : null;

    this.getEntity = function(){
      return entity;
    };

    /**
     * Scroll the TileMap
     * @param direction
     */
    this.scroll = function(direction){
      if(!CanvasEngine.isPaused()) {
        var actualX = Math.round(direction.x / tileSize.width);
        var actualY = Math.round(direction.y / tileSize.height);
        // Change our initial tile position based on the distance in pixels over the size of a tile.
        scrollOffset.x += actualX;
        scrollOffset.y += actualY;

        // Tell the CanvasEngine event manager to fire a scrollMap event.
        // If there's a scrollMap event, living, non-gui entities should be forced
        //    to move the tileDistance which actually occurred.

        // CanvasEngine.EventManager.fire("ScrollWorld", {x: actualX * tileSize.width, y: actualY * tileSize.height});
      }
    };

    this.getVisibleTiles = function(area){
      if(tileSize.height === 0 || tileSize.width ===0){
        return [];
      }

      var tiles = [];
      // y index for return tiles
      var yI = 0;
      // x index for return tiles
      var xI;
      // y position in tileMap
      // scrollOffset.y = firstColumn
      // scrollOffset.y + Math.round(area.height / tileSize.height) = maxY?

      var maxY = scrollOffset.y + Math.round(area.height / tileSize.height);
      var maxX = scrollOffset.x + Math.round(area.width / tileSize.width);
      for(var y = scrollOffset.y; y < maxY; y++) {
        tiles[yI] = [];
        xI= 0;
        // x position in tileMap
        for (var x = scrollOffset.x; x < maxX; x++) {
          tiles[yI][xI] = map[y][x];
          xI++;
        }
        yI++;
      }
      return tiles;
    };

    /**
     * Convert a pixel position into a tile element.
     *  x, and y represent the position's area in pixels.
     *
     * @param coord
     * @returns {{tile: *, x: number, y: number, row: number, col: number}}
     */
    this.pixelToTile = function(coord){
      var row = Math.floor(coord.y / tileSize.height) + scrollOffset.y;
      var col = Math.floor(coord.x / tileSize.width);

      if (utils.exists(map[row]) && utils.exists(map[row][col])) {
        return {
          tile: map[row][col],
          x: col * tileSize.width,
          y: row * tileSize.height,
          row: row,
          col: col
        };
      }
    };

    /**
     * Do some user set function when a Tile is Clicked.
     * The user function is run against the position of the tile being clicked.
     *  In other words: The 'this' in your method will be the return value for pixelToTile
     *
     * @param coord
     * @constructor
     */
    this.TileClick = function(coord){
      if(onTileClick !== null){
        var tile = this.pixelToTile(coord);
        onTileClick.call(tile);
      }
    };

    /**
     * Override a tile state
     *
     * @param coord
     * @param newName
     */
    this.setTile = function(coord, newName){
      if(utils.exists(map[coord.y][coord.x])) {
        map[coord.y][coord.x] = newName;
      }
    };

    /**
     * Get the TileSize data
     *
     * @returns {{width: number, height: number}}
     */
    this.getTileSize = function(){
      return $.extend({}, tileSize);
    };

  };

  CanvasEngine.EntityManager.addComponent("TileMap", function(params, entity){
    return new TileMap(params, entity);
  });
})();