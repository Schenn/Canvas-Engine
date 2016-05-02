var game = function(){
  this.currentPlayer = 1;
  this.player1Wins = 0;  //total wins
  this.player2Wins = 0;
  this.turnCounters = [0,0];  //turns taken
  this.positionsClaimed = {};
  this.gameOver = false;

  this.loadResources = function(){
    CanvasEngine.ResourceManager.onResourcesLoaded(function(){
      CanvasEngine.EntityTracker.getEntities(["Loading"])[0].messageToComponent("Text", "setText", "All resources loaded.");
    });
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
  };

  this.setup = function(canvas){
    CanvasEngine.setup(canvas);
    CanvasEngine.Screen.maximize();

    CanvasEngine.ResourceManager.setImagePath("tictacgraphics");

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

    this.loadResources();

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
      height: parseInt(((screenHeight * .8) / 4)),
      width: parseInt(((screenWidth * .8) / 4)),
      onClick: function (e) {
        tictactoe.addToken(this)
      },  //calls the addToken function of our tic-tac-toe game when the box is clicked
      fromCenter: false,
      z_index: 2
    };

    //begins counting up the x and y coordinates for our boxes.
    //Since our board is a grid, it is simpler to calculate then write out.
    var xcount = 1;
    var xcounter = parseInt((screenWidth * .25));
    var ycounter = parseInt((screenHeight * .25));

    for (var i = 1; i <= 9; i++) {
      var temp = $.extend(true, {
        slot: i
      }, position);
      temp.name = "slot" + i;  //gives the slot an appropriate name tied to its position in the grid

      temp.x = (xcounter);
      temp.y = (ycounter);


      if (xcount >= 3) {
        xcount = 1;
        xcounter = (parseInt(screenWidth * .25));
        ycounter += temp.height + 10;
      }
      else {
        xcount++;
        xcounter += temp.width + 10;
      }
      gamePieces[i] = temp;
    }

    //player 1 score labels
    gamePieces.push({
      name: "score1label",
      x: 10,
      y: 20,
      align: 'left',
      text: "Player 1 Wins: ",
      z_index: 1,
      type: "LABEL"
    });
    gamePieces.push({
      name: "score1",
      x: 25,
      y: 35,
      align: "left",
      text: this.player1Wins.toString(),
      z_index: 1,
      type: "LABEL"
    });

    //player 2 score labels
    gamePieces.push({
      name: "score2label",
      x: 10,
      y: 60,
      align: 'left',
      text: "Player 2 Wins: ",
      z_index: 1,
      type: "LABEL"
    });

    gamePieces.push({
      name: "score2",
      x: 25,
      y: 80,
      align: "left",
      text: this.player2Wins.toString(),
      z_index: 1,
      type: "LABEL"
    });

    CanvasEngine.addMap(gamePieces);

  };

  this.addToken = function(position){
    if(!CanvasEngine.utilities.exists(this.positionsClaimed[position.name]) && !this.gameOver){
      this.positionsClaimed[position.name] = this.currentPlayer;
      var spriteName;
      switch(this.currentPlayer){
        case 1:
          spriteName = "oToken";
          break;
        case 2:
          spriteName = "xToken";
          break;
        default:
          console.log("Invalid Player number");
          break;
      }
      var positionData = position.getFromComponent("Renderer", "asObject");
      var token = {
        x:positionData.x,
        y:positionData.y,
        type: "SPRITE",
        spritesheet: "ticTacSprites",
        defaultSprite: spriteName,
        height: positionData.height,
        width: positionData.width,
        fromCenter: positionData.fromCenter,
        z_index:3
      };

      CanvasEngine.addMap([token]);

      this.turnCounters[this.currentPlayer-1]++;

      if(this.turnCounters[this.currentPlayer-1] >= 3){
        this.checkForWinner(position);
      }
      this.currentPlayer = (this.currentPlayer ==1) ? 2 : 1;
    }
  };

  this.checkForWinner = function(position){
    // Check to see if the claimed positions form a line and have the same owner
    /**
    var slots;
    switch (position.name) {
      case(1):
        slots = [this.ce.getEntities(["slot2owned", "slot3owned"]),
          this.ce.getEntities(["slot4owned", "slot7owned"]),
          this.ce.getEntities(["slot5owned", "slot9owned"])];
        break;
      case(2):
        slots = [this.ce.getEntities(["slot1owned", "slot3owned"]),
          this.ce.getEntities(["slot5owned", "slot8owned"])];
        break;
      case(3):
        slots = [this.ce.getEntities(["slot2owned", "slot1owned"]),
          this.ce.getEntities(["slot5owned", "slot7owned"]),
          this.ce.getEntities(["slot6owned", "slot9owned"])];
        break;
      case(4):
        slots = [this.ce.getEntities(["slot1owned", "slot7owned"]),
          this.ce.getEntities(["slot5owned", "slot6owned"])];
        break;
      case(5):
        slots = [this.ce.getEntities(["slot1owned", "slot9owned"]),
          this.ce.getEntities(["slot2owned", "slot8owned"]),
          this.ce.getEntities(["slot3owned", "slot7owned"]),
          this.ce.getEntities(["slot4owned", "slot6owned"])];
        break;
      case(6):
        slots = [this.ce.getEntities(["slot4owned", "slot5owned"]),
          this.ce.getEntities(["slot3owned", "slot9owned"])];
        break;
      case(7):
        slots = [this.ce.getEntities(["slot1owned", "slot4owned"]),
          this.ce.getEntities(["slot3owned", "slot5owned"]),
          this.ce.getEntities(["slot9owned", "slot8owned"])];
        break;
      case(8):
        slots = [this.ce.getEntities(["slot5owned", "slot2owned"]),
          this.ce.getEntities(["slot7owned", "slot9owned"])];
        break;
      case(9):
        slots = [this.ce.getEntities(["slot1owned", "slot5owned"]),
          this.ce.getEntities(["slot3owned", "slot6owned"]),
          this.ce.getEntities(["slot7owned", "slot8owned"])];
        break;
    }
  **/
  };
};

window.tictactoe = new game();