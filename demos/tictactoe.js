var game = function(){
  this.currentPlayer = 1;
  this.player1Wins = 0;  //total wins
  this.player2Wins = 0;
  this.turnCounter = 0;  //turns taken

  this.setup = function(canvas){
    CanvasEngine.setup(canvas);
    CanvasEngine.Screen.maximize();

    CanvasEngine.ResourceManager.setImagePath("tictacgraphics");
    CanvasEngine.ResourceManager.onResourcesLoaded();
    CanvasEngine.ResourceManager.addSpriteSheet("ticTacSprites", "tictacsprites.png",
      {
        height: 50,
        width: 50,
        sprites:[
          "oToken", "xToken", "positionBack", "winStar"
        ]
      }
    );
    CanvasEngine.ResourceManager.addSpriteSheet("winningStar", "starsprites.png",{
      height: 50,
      width: 50
    });

    CanvasEngine.ResourceManager.finishedAddingResources();

    var gamePieces = [];

    // Black background box
    gamePieces[0] = {
      type: "RECT",
      height:CanvasEngine.Screen.height(),
      width: CanvasEngine.Screen.width(),
      fillStyle: "#000000"
    };

    gamePieces[1] = {
      type: "LABEL",
      name: "Loading",
      text: "Loading...",
      x: CanvasEngine.Screen.width()/2,
      y: CanvasEngine.Screen.height()/2,
      z_index: 1
    };

    CanvasEngine.addMap(gamePieces, true);
  };

  // We have to wait for our assets to finish loading before we can use them.
  this.start = function(){
    CanvasEngine.clearEntities();

    var gamePieces = [];

    var screenHeight = CanvasEngine.Screen.height();
    var screenWidth = CanvasEngine.Screen.width();

    // Black background box
    gamePieces[0] = {
      type: "RECT",
      height:screenHeight,
      width: screenWidth,
      fillStyle: "#000000"
    };

    // the basic grey box for the tokens to go in
    var position = {
      type: "SPRITE",
      spritesheet: "ticTacSprites",
      defaultSprite: "positionBack",
      height: ((screenHeight * .8) / 4),
      width: ((screenWidth * .8) / 4),
      onClick: function (e) {
        tictactoe.addToken(e)
      },  //calls the addToken function of our tic-tac-toe game when the box is clicked
      fromCenter: false,
      z_index: 2
    };

    //begins counting up the x and y coordinates for our boxes.
    //Since our board is a grid, it is simpler to calculate then write out.
    var xcount = 1;
    var xcounter = (screenWidth * .25);
    var ycounter = (screenHeight * .25);

    for (var i = 1; i <= 9; i++) {
      var temp = $.extend(true, {
        slot: i
      }, position);
      temp.name = "slot" + i;  //gives the slot an appropriate name tied to its position in the grid

      temp.x = (xcounter);
      temp.y = (ycounter);


      if (xcount >= 3) {
        xcount = 1;
        xcounter = (screenWidth * .25);
        ycounter += temp.height + 10;
      }
      else {
        xcount++;
        xcounter += temp.width + 10;
      }
      gamePieces[i] = temp;
    }

    CanvasEngine.addMap(gamePieces);

  };

  this.addToken = function(position){
    console.log(position);
  };
};

window.tictactoe = new game();