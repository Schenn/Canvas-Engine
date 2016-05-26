(function(){

var game = function(){

  var randomTileMap = [];

  // Tell canvas engine to point to our canvas
  this.setup = function(canvas){
    CanvasEngine.ResourceManager.setImagePath("demos/chakara_graphics");
    CanvasEngine.Screen.setScreen(canvas);
    CanvasEngine.Screen.maximize();

    for(var y=0; (y * 32) < CanvasEngine.Screen.height();y++){
      randomTileMap[y]=[];
      for(var x=0; (x * 32) < CanvasEngine.Screen.width(); x++){
        randomTileMap[y][x] = Math.floor(Math.random() * (4));
      }
    }

    CanvasEngine.addMap([
      {
        type: "RECT",
        height:CanvasEngine.Screen.height(),
        width: CanvasEngine.Screen.width(),
        fillStyle: "#000000"
      },
      {
        type: "LABEL",
        name: "Loading",
        text: "Loading...",
        x: CanvasEngine.Screen.width()/2,
        y: CanvasEngine.Screen.height()/2,
        z_index: 1
      }
    ], true);


    // Load Resources
    CanvasEngine.ResourceManager.loadResourceCollection([
      {
        "SpriteSheet":{
          name:"medieval",
          source: "ToensMedievalStrategy.png",
          details:{
            height: 16, width: 16
          }
        }
      }
    ], function(){
      CanvasEngine.EntityTracker.getEntities(["Loading"])[0].messageToComponent("Text", "setText", "All resources loaded.");
    });

  };

  this.start = function(){
    CanvasEngine.clearEntities();

    // Show that even though the sprites are in 16 x 16, we can ask for them to be drawn at 32 x 32.

    CanvasEngine.addMap([
      {
        type: "TILEMAP",
        spritesheet: "medieval",
        tileMap: {
          height: 32, width: 32,
          tiles: randomTileMap
        }
      },
      {
        type: "Button",
        x: CanvasEngine.Screen.width() / 2,
        y: CanvasEngine.Screen.height() / 2,
        z_index: 2,
        text: "Click me",
        padding: 2,
        onClick: function(){
          console.log("I got clicked");
        },
        background: {
          fillStyle: "#00ff00"
        },
        hover: {
          fillStyle: "#00aa00",
          strokeStyle: "#000000",
          strokeWidth: 2
        }
      }
    ], true);
  };

};

window.chakara = new game();

})();