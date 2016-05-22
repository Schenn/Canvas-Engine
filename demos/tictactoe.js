(function(){


var game = function(){
  this.currentPlayer = 1;
  var player1 = 0;  //total wins
  var player2 = 0;
  this.turnCounters = [0,0];  //turns taken
  this.positionsClaimed = {};
  var gameOver = false;


  var self = this;
  Object.defineProperties(this, {
    "player1Wins": CanvasEngine.EntityManager.properties.defaultProperty(player1, function(){
      CanvasEngine.EntityTracker.getEntities(["score1"])[0].messageToComponent("Text", "setText", self.player1Wins);
    }),
    "player2Wins": CanvasEngine.EntityManager.properties.defaultProperty(player2, function(){
      CanvasEngine.EntityTracker.getEntities(["score2"])[0].messageToComponent("Text", "setText", self.player2Wins);
    }),
    "gameOver": CanvasEngine.EntityManager.properties.defaultProperty(gameOver, function(){
      self.onGameOver();
    })
  });

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
      spritesheets: {
        default: "ticTacSprites"
      },
      defaultSprite: "positionBack",
      height: parseInt(((screenHeight * .8) / 4)),
      width: parseInt(((screenWidth * .8) / 4)),
      onClick: function () {
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
    var slot = position.name.substr(4,1);
    if(!CanvasEngine.utilities.exists(this.positionsClaimed[slot]) && !this.gameOver){
      this.positionsClaimed[slot] = this.currentPlayer;
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
        spritesheets: {
          default: "ticTacSprites"
        },
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
    // Slots is an array of other positions which may form a line with this position
    var slots = [[],
      [
        [2,3],
        [4,7],
        [5,9]
      ],[
        [1,3],
        [5,8]
      ],[
        [2,1],
        [5,7],
        [6,9]
      ],[
        [1,7],
        [5,6]
      ],[
        [1,9],
        [2,8],
        [3,7],
        [4,6]
      ],[
        [4,5],
        [3,9]
      ],[
        [
          [1,4],
          [3,5],
          [8,9]
        ]
      ],[
        [2,5],
        [7,9]
      ],[
        [1,5],
        [3,6],
        [7,8]
      ]
    ];

    var positionSlot = position.name.substr(4,1);
    var matchingSlots = slots[positionSlot];
    var winner = 0;
    var matching = [];
    for(var i=0; i<matchingSlots.length; i++){
      var slotA = matchingSlots[i][0];
      var slotB = matchingSlots[i][1];
      console.log("Slot: "+i+" A: "+slotA+" B: "+slotB);
      console.log("Cleared: A: "+ this.positionsClaimed[slotA]+ " B: "+ this.positionsClaimed[slotB] + " this: "+ this.positionsClaimed[positionSlot]);
      console.log("isCleared: " + this.positionsClaimed[slotA] == this.positionsClaimed[slotB] == this.positionsClaimed[positionSlot]);
      if(this.positionsClaimed[slotA] == this.positionsClaimed[slotB] && this.positionsClaimed[slotB] == this.positionsClaimed[positionSlot]){
        winner = this.positionsClaimed[slotA];
        matching.push(slotA, slotB, positionSlot);
        break;
        // break the loop and announce the winner!
      }
    }

    if(winner > 0){
      // Announce the winner
      this.announceWinner(winner,matching);
    } else if(this.turnCounters[0] + this.turnCounters[1] >= 9){
      // It's a draw!
      this.announceDraw();
    }

  };

  this.announceWinner = function(winner, matchingPositions){

    // Sort the positions into lowest -> highest order
    // We're only sorting 1-9, so regular js sort will work ok here.
    matchingPositions = matchingPositions.sort();

    // Get the positions of the 3 matching positions
    var positions = CanvasEngine.EntityTracker.getEntities(
      ["slot"+matchingPositions[0],
        "slot"+matchingPositions[1],
        "slot"+matchingPositions[2]]);

    // Draw a line between their xy coordinates + 1/2 their height and width as they are not being drawn fromCenter
    var coords = [];
    for(var i = 0; i < positions.length; i++){
      var data = positions[i].getFromComponent("Renderer", "asObject");
      coords.push ({
        x: data.x + data.width/2, y:data.y + data.height/2
      });
    }

    var line = CanvasEngine.EntityManager.create("LINE",{
      z_index:4,
      strokeStyle: "#ffffff",
      strokeJoin: "round"
    });

    line.plot(coords);
    var winLabel = CanvasEngine.EntityManager.create("LABEL",{
      x: (CanvasEngine.Screen.width() / 2),
      y: 40,
      z_index: 1,
      font: "bold 22px Verdana, Arial, Helvetica, sans-serif",
      align: "center",
      text: "Player "+winner+ " Wins!"
    });

    var entities = {
      1: [winLabel],
      4: [line]
    };

    CanvasEngine.addEntities(entities);

    switch(winner){
      case 1:
        this.player1Wins++;
        break;
      case 2:
        this.player2Wins++;
        break;
      default:
        break;
    }

    this.gameOver = true;
  };

  this.announceDraw = function(){
    CanvasEngine.addMap([
      {
        type: "LABEL",
        x: (CanvasEngine.Screen.width() / 2),
        y: 40,
        z_index: 1,
        font: "bold 22px Verdana, Arial, Helvetica, sans-serif",
        align: "center",
        text: "DRAW GAME"
      }
    ]);

    this.gameOver = true;
  };

  this.onGameOver = function(){
    // Add game over stars

    var star = {
      type: "ASPRITE",
      spritesheets: {
        default: "winningStar"
      },
      fromCenter: false,
      x: (CanvasEngine.Screen.width() *0.2),
      y: -5,
      height: 100,
      width: 100,
      z_index: 6,
      animations: {
        default:{
          duration: 2000,
          frameCount:4
        }
      }
    };

    var leftStar = $.extend({}, star);
    leftStar.name = "LeftStar";
    leftStar.x = (CanvasEngine.Screen.width() *0.2);

    var rightStar = $.extend({}, star);
    rightStar.name = "RightStar";
    rightStar.x = (CanvasEngine.Screen.width() *0.8);

    var fallingStar ={
      type:"MSPRITE",
      spritesheets: {
        default:"winningStar"
      },
      animations: {
        default:{
          duration: 2000,
          frameCount: 1
        },
        S: {
          duration: 2000,
          frameCount:4
        }
      },
      ySpeed: 50,
      z_index: 5,
      height: 100,
      width: 100,
      x:100,
      y:0,
      onMovement: function(data){
        if(data.dir == "y" && data.val >= CanvasEngine.Screen.height()){
          this.messageToComponent("Movement", "setOrigin",
            {x : Math.ceil(Math.random() * CanvasEngine.Screen.width()),
              y: 0
            });

        }
      }
    };

    CanvasEngine.addMap([
      leftStar,
      rightStar,
      fallingStar

    ]);

  }
};

window.tictactoe = new game();

})();