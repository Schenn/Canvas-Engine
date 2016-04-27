var game = function(){
  this.currentPlayer = 1;
  this.player1Wins = 0;  //total wins
  this.player2Wins = 0;
  this.turnCounter = 0;  //turns taken

  this.setup = function(canvas){
    CanvasEngine.ResourceManager.setImagePath("tictacgraphics/");
    CanvasEngine.ResourceManager.addSpriteSheet(
      {
        name: "ticTacSprites",
        source: "tictacsprites.png",
        height: 100,
        width: 100,
        sprites:[
          "oToken", "xToken", "positionBack", "winStar"
        ]
      }
    );
    CanvasEngine.ResourceManager.addSpriteSheet({
      name: "winningStar",
      source: "starsprites.png",
      height: 100,
      width: 100
    });

    CanvasEngine.setup(canvas);
    CanvasEngine.Screen.maximize();
  };
};

