var game = function(){
  let CanvasEngine = null;
  var randomTileMap = [];

  // Tell canvas engine to point to our canvas
  this.setup = function(canvas, CEngine){
    CanvasEngine = CEngine;
    CanvasEngine.ResourceManager.ImagePath = "demos/chakara_graphics";
    CanvasEngine.Screen.attachToCanvas(canvas);
    CanvasEngine.Screen.maximize();

    for(var y=0; (y * 32) < CanvasEngine.Screen.height;y++){
      randomTileMap[y]=[];
      for(var x=0; (x * 32) < CanvasEngine.Screen.width; x++){
        randomTileMap[y][x] = Math.floor(Math.random() * (4));
      }
    }

    CanvasEngine.addMap([
      {
        type: "Rect",
        height:CanvasEngine.Screen.height,
        width: CanvasEngine.Screen.width,
        fillStyle: "#000000"
      },
      {
        type: "Label",
        name: "Loading",
        text: "Loading...",
        x: CanvasEngine.Screen.width/2,
        y: CanvasEngine.Screen.height/2,
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
        type: "TileMap",
        spritesheet: "medieval",
        tileMap: {
          height: 32, width: 32,
          tiles: randomTileMap
        }
      },
      {
        type: "Button",
        x: CanvasEngine.Screen.width / 2,
        y: CanvasEngine.Screen.height / 2,
        z_index: 3,
        text: "Add Movable Entity",
        padding: 2,
        onClick: function(){
          chakara.addMovable();
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

  this.addMovable = function(){
    CanvasEngine.addMap([
      {
        type: "MobileSprite",
        x: 98, y:98,
        z_index: 2,
        spritesheets: {
          default: "medieval"
        },
        animations: {
          default:{
            duration: 0,
            frames: ["90"]
          }
        },
        defaultSprite: "90",
        height: 32, width: 32, fromCenter: false,
        keys: {
          w: function(){
            this.messageToComponent("Movement", "travel", {
              y: -32,
              speed: 50
            });
          },
          a: function(){
            this.messageToComponent("Movement", "travel", {
              x: -32,
              speed: 50
            });
          },
          s: function(){
            this.messageToComponent("Movement", "travel", {
              y: 32,
              speed: 50
            });
          },
          d: function(){
            this.messageToComponent("Movement", "travel", {
              x: 32,
              speed: 50
            });
          }
        }
      }
    ]);

  };

};

window.chakara = new game();