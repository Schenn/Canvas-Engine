var game = function(){
  this.currentPlayer = 1;
  this.player1Wins = 0;  //total wins
  this.player2Wins = 0;
  this.turnCounter = 0;  //turns taken

  this.setup = function(canvas){
    CanvasEngine.setup(canvas);
    CanvasEngine.Screen.maximize();

    CanvasEngine.ResourceManager.setImagePath("tictacgraphics");
    CanvasEngine.ResourceManager.onResourcesLoaded(function(){
  //    tictactoe.resourcesLoaded();
    });
    CanvasEngine.ResourceManager.addSpriteSheet("ticTacSprites", "tictacsprites.png",
      {
        height: 100,
        width: 100,
        sprites:[
          "oToken", "xToken", "positionBack", "winStar"
        ]
      }
    );
    CanvasEngine.ResourceManager.addSpriteSheet("winningStar", "starsprites.png",{
      height: 100,
      width: 100
    });

    CanvasEngine.ResourceManager.finishedAddingResources();

    var gamePieces = [];

    // Black background box
    gamePieces[0] = {
      type: "RECT",
      height:canvas.height,
      width: canvas.width,
      fillStyle: "#000000"
    };

    gamePieces[1] = {
      type: "LABEL",
      text: "Loading...",
      x: canvas.width/2,
      y: canvas.height/2,
      z_index: 1
    };

    CanvasEngine.addMap(gamePieces);
    CanvasEngine.Screen.drawScreen();
  };

  // We have to wait for our assets to finish loading before we can use them.
  this.resourcesLoaded = function(){
    CanvasEngine.EntityTracker.clearEntities();
    var gamePieces = [];

    var cHeight = CanvasEngine.Screen.height();
    var cWidth = CanvasEngine.Screen.width();

    // Black background box
    gamePieces[0] = {
      type: "RECT",
      height:canvas.height,
      width: canvas.width,
      fillStyle: "#000000"
    };

    gamePieces[1] = {
      type: "SPRITE",
      spritesheet: "ticTacSprites",
      height: 100,
      width: 100,
      defaultSprite: "oToken",
      x:100
    };

    CanvasEngine.addMap(gamePieces, true);
  }
};

window.tictactoe = new game();