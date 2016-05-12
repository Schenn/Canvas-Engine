/**
 * Created by schenn on 4/17/16.
 */
(function(){
  var props = CanvasEngine.EntityManager.properties;

  /**
   * The PointPlotter component manages an array of coordinates (points)
   *
   * @param params
   * @param entity
   */
  var pointPlotter = function(params, entity){

    var coordinateArray=[];
    var coordinateObj = {};

    Object.defineProperty(this,"coords",props.defaultProperty(coordinateObj));

    /**
     * Plot out the coordinates as a property on the coordinateObj
     * @param coords
     */
    this.plot = function(coords){
      coordinateArray = coords;
      for (var i = 1; i <= coords.length; i++) {

        // If we don't have the x coordinate property, create it.
        if(!coordinateObj.hasOwnProperty("x"+i)) {
          Object.defineProperty(coordinateObj,"x"+i,props.defaultProperty(coords[i-1].x, params.callback));
        }
        else {
          coordinateObj["x" + i] = coords[i - 1].x;
        }

        // If we don't have the y coordinate property, create it.
        if(!coordinateObj.hasOwnProperty("y"+i)) {
          Object.defineProperty(coordinateObj,"y"+i,props.defaultProperty(coords[i-1].y, params.callback));
        } else {
          coordinateObj["y" + i] = coords[i - 1].y;
        }
      }
    };

    /**
     * Get the bounding area of the points
     *
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    this.getArea = function(){
      var smallX = 0;
      var smallY = 0;
      var bigX = 0;
      var bigY = 0;
      for (var i = 0; i < coordinateArray.length; i++) {
        if (coordinateArray[i].x <= smallX) {
          smallX = coordinateArray[i].x;
        }
        if (coordinateArray[i].y <= smallX) {
          smallY = coordinateArray[i].y;
        }
        if (coordinateArray[i].x >= bigX) {
          bigX = coordinateArray[i].x;
        }
        if (coordinateArray[i].y >= bigY) {
          bigY = coordinateArray[i].y;
        }
      }

      return ({
        x: smallX, y: smallY,
        width:  bigX - smallX, height: bigY - smallY
      });
    };

    if(CanvasEngine.utilities.exists(params.coords)){
      this.plot(params.coords);
    }

    this.getEntity = function(){
      return entity;
    };

    this.getCoordinatesAsArray = function(){
      return coordinateArray;
    };

    this.getCoordinatesAsObject = function(){
      return coordinateObj;
    };

  };

  // Add the PointPlotter component to CanvasEngins storage
  CanvasEngine.EntityManager.addComponent("PointPlotter", function(params, entity){
    return new pointPlotter(params, entity);
  }, true);
})();