var tictactoeGame = function () {
  this.canvas = null;   //gameScreen
  this.player1Wins = 0;  //total wins
  this.player2Wins = 0;
  this.counter = 0;  //turns taken (faster then checking if every position is occupied)
  this.ce = null;  //the engine

};
tictactoeGame.prototype.start = (function () {
  this.canvas = $("#game");  //the initial canvas
  this.ce = this.canvas.attachCanvasEngine({
    imagePath: "cImages/"
  });  //attaches our game engine to the canvas, hands over an image path
  this.ce.maximize();

  //Adds the basic game spritesheet to the engine
  this.ce.addSpritesheet({
      name: "ticTacSprites",
      source: "tictacsprites.png",
      height: 100,
      width: 100
    },
    {
      "oToken": {},
      "xToken": {
        sx: 50
      },
      "positionBack": {
        sy: 50
      },
      "winStar": {
        sx: 50,
        sy: 50
      }
    });

  //Adds the animated star spritesheet to the engine
  this.ce.addSpritesheet({
      name: "winningStar",
      source: "starsprites.png",
      height: 100,
      width: 100
    },
    {
      "first": {},
      "second": {
        sx: 50
      },
      "third": {
        sy: 50
      },
      "last": {
        sx: 50,
        sy: 50
      }
    });
  //maximizes the canvas size

  curPlayer = 1; //sets the first player
  this.drawPositions();  //generates the basic elements of the board

});

tictactoeGame.prototype.drawPositions = function () {

  var positions = [];  //array of game objects

  this.ce.clearPositions(); //clears all the game elements in use by our engine
  counter = 0; //resets the counter
  curPlayer = 1;

  var cHeight = parseInt(this.canvas.attr("height")); //screen dimensions
  var cWidth = parseInt(this.canvas.attr("width"));

  positions[0] = {
    height: cHeight,
    width: cWidth,
    type: "rect",
    z_index: 0,
    x: 0, y: 0
  };

  // the basic grey box for the tokens to go in
  var position = {
    type: "sprite",
    spritesheet: "ticTacSprites",
    sprite: "positionBack",
    height: ((cHeight * .8) / 4),
    width: ((cWidth * .8) / 4),
    onClick: function (e) {
      tictactoe.addToken(e)
    },  //calls the addToken function of our tic-tac-toe game when the box is clicked
    fromCenter: false,
    z_index: 2
  };

  //begins counting up the x and y coordinates for our boxes.
  //Since our board is a grid, it is simpler to calculate then write out.
  var xcount = 1;
  var xcounter = (cWidth * .25);
  var ycounter = (cHeight * .25);

  for (var i = 1; i <= 9; i++) {
    var temp = $.extend(true, {
      slot: i
    }, position);
    temp.name = "slot" + i;  //gives the slot an appropriate name tied to its position in the grid

    temp.x = (xcounter);
    temp.y = (ycounter);


    if (xcount >= 3) {
      xcount = 1;
      xcounter = (cWidth * .25);
      ycounter += temp.height + 10;
    }
    else {
      xcount++;
      xcounter += temp.width + 10;
    }
    positions[i] = temp;
  }


  //player 1 score labels
  var score1label = {
    name: "score1label",
    x: 10,
    y: 20,
    align: 'left',
    text: "Player 1 Wins: ",
    z_index: 1,
    type: "label"
  };
  var score1 = {
    name: "score1",
    x: 25,
    y: 35,
    align: "left",
    text: this.player1Wins.toString(),
    z_index: 1,
    type: "label"
  };

  //player 2 score labels
  var score2label = {
    name: "score2label",
    x: 10,
    y: 60,
    align: 'left',
    text: "Player 2 Wins: ",
    z_index: 1,
    type: "label"
  };

  var score2 = {
    name: "score2",
    x: 25,
    y: 80,
    align: "left",
    text: this.player2Wins.toString(),
    z_index: 1,
    type: "label"
  };
  var ce = this.ce;
  //new game button
  var buttonBack = {
    name: "newMatchBack",
    type: "rect",
    x: 15,
    y: 120,
    z_index: 2,
    height: 30,
    width: 100,
    onClick: (function (x) {
      if (x.fillStyle == "#666") //if the button is shown
      {
        ce.pause(); //pause the game loop
        tictactoe.drawPositions(); //reset the board
        ce.pause(); //redraw the game loop
      }
    })
  };

  var buttonText = {
    type: "label",
    x: 30,
    y: 135,
    z_index: 3,
    name: "newMatchLabel"
  };

  // wiiner announcement label
  var winnerText = {
    type: "label",
    x: cWidth / 2,
    y: 40,
    z_index: 1,
    name: "winnerLabel",
    font: "bold 22px Verdana, Arial, Helvetica, sans-serif",
    align: "center"
  };

  //places the rest of our game objects into our array
  positions[10] = score1label;
  positions[11] = score1;
  positions[12] = score2label;
  positions[13] = score2;
  positions[14] = buttonBack;
  positions[15] = buttonText;
  positions[16] = winnerText;

  this.ce.addMap(positions, true);  //feeds our game objects to our engine
  //ensures quicker game response by marking
  //specific z_index's as unresponsive to clicks and collisions
  this.ce.excludeZIndex([0, 1, 3]);

};

tictactoeGame.prototype.addToken = (function (position) {
  //get all positions(2 expected) from our engine which is a check for a token at this position and our winner announcement label
  var spots = this.ce.getEntities([position.name + "owned", "winnerLabel"]);
  //if there is no token in this position, the game is not paused and the winner announcement label is blank
  if ((spots[0] === false) && (this.ce.paused === false) && (spots[1].text === "")) {

    //our Player Token
    var token = ({
      name: position.name + "owned",
      type: "sprite",
      spritesheet: "ticTacSprites",
      x: position.x + (position.width / 2),
      y: position.y + (position.height / 2),
      height: position.height * .5,
      width: position.width * .5,
      fromCenter: true,
      z_index: 3
    });


    //sets the token sprite to the current player, advances to the next player
    if (curPlayer == 1) {
      token.sprite = "xToken";
      curPlayer = 2;
    }
    else {
      token.sprite = "oToken";
      curPlayer = 1;
    }

    //increases our slots captured counter
    counter++;
    this.ce.addMap([token], true); //feeds our token to the game engine with the instruction to continue the game loop

    window.dispatchEvent(new CustomEvent("sendGA", {
      detail:['Demos', "Demo Interaction", "Tic Tac Toe position ticked:"+ position.name]
    }));

    //check for winner

    //see which applicable squares are occupied
    //first we get ask the engine for the tokens relevant to our current position
    var slots;
    switch (position.slot) {
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
    //then for each potential token
    for (var i = 0; i < slots.length; i++) {
      var check = slots[i];
      if ((check[0] != false) && (check[1] != false)) //if both of the appropriate token positions were retrieved
      {
        if ((check[0].spriteName === check[1].spriteName) && (check[0].spriteName == token.sprite)) //if everyone is using the same image for their token
        {
          //we have a winner
          var thisSpot = this.ce.getEntities([position.name + "owned"]); //get this current processed token
          check[3] = thisSpot[0]; //put it in our array of positions
          tictactoe.announceWinner(check[0].spriteName, [check[0], check[1], check[3]]); //call our announcewinner function

          i = slots.length; //stop the for loop
        }
      }
    }

    if (counter >= 9) //if the maximum number of turns has been taken
    {
      tictactoe.announceWinner("#", []); //call our announcewinner function, but as a tie game
    }
  }
});

tictactoeGame.prototype.announceWinner = function (token, spotArray) {
  var winner; //text of who won
  if (token !== "#") //if its not a tie
  {
    var winPlayer;
    if (token === "xToken") //if its player 1
    {
      this.player1Wins++;
      winner = "PLAYER 1 WINS!";
    }
    else if (token === "oToken") //if its player 2
    {
      this.player2Wins++;
      winner = "PLAYER 2 WINS!";
    }

    //set winner marks to collidable

    this.ce.makePositionsCollidable([spotArray[0].name, spotArray[1].name, spotArray[2].name]);
    var ce = this.ce;

    //init the coords for the line drawing
    var lineArray = [];

    for (var i = 0; i < spotArray.length; i++) {
      lineArray.push({
        x: spotArray[i].x,
        y: spotArray[i].y
      });
    }

    //define our line object

    var winLine = {
      type: "line",
      strokeStyle: "#ff0000",
      strokeJoin: "round",
      xyArray: lineArray,
      z_index: 4
    };


    //define our falling star movable object
    //this object moves and animates the relevant positions while moving
    //it reuires an already processed spritesheet
    var width = this.canvas[0].width;
    var height = this.canvas[0].height;
    var self = this;

    var winMob = function () {
      this.type = "mob";
      this.spritesheet = "winningStar";
      this.ySpeed = 50;
      this.x = Math.ceil(Math.random() * width);
      this.y = 0;
      this.z_index = 5;
      this.directions = {
        "S": ["first", "second", "third", "last"]
      }; //this sets our South direction to the sprites in the array which are already in our game engine
      this.fromCenter = false;
      this.name = "winStar";
      this.height = 100;
      this.width = 100;
      this.animationSpeed = 2000;
    };


    //the preDraw function must be created to call the move function in order for your mob to be able to move
    //you want to use the predraw for pathfinding, setting Directions and other stuff you want to do.
    //if you want your mob to move, you must call its move() function which is pre-built for you in such a way to automate animations
    //as well as ensuring a smooth animation speed.

    winMob.prototype.preDraw = function () {
      //"pathfinding"
      //use canvasengine.collides(destination) to
      //determine if a movement will generate a collision
      if (this.y > height) {
        this.y = 0;
        this.x = Math.ceil(Math.random() * width);
      }
      //call move - automatically animates frame and moves a direction
      this.move();

    };

    winMob.prototype.postDraw = function () {
      //call collision detection on this in the postDraw.  This allows the movement to update the object.
      ce.collideOrPass(this);
    };

    winMob.prototype.onCollide = function (collider) {

      //check if colliding with winner token
      //get winner from winnerText

      self.ce.updateEntity("winnerLabel", {
        text: collider.name
      });

      //jcH.clonePosition(this.name, {y:0, x:Math.ceil(Math.random() * canvas.width())});
      //this.ySpeed = 0;
      //this.x = collider.x;
      //this.y = collider.y;
    };

    //instantiates an object from our star class

    var winStar = new winMob();


    //our flashing stars next to the winner announcement
    //note how even though our star is a little on top of our announcement text, that it isn't erasing the text behind it as it animates.
    //that is due to our use of different z_index.

    var congratsStar = {
      type: "sprite",
      spritesheet: "winningStar",
      fromCenter: false,
      x: (width / 4.5),
      y: -5,
      height: 100,
      width: 100,
      z_index: 6,
      frames: ["first", "second", "third", "last"],
      duration: 2000
    };


    var congratsStar2 = {
      type: "sprite",
      spritesheet: "winningStar",
      fromCenter: false,
      x: (width / 1.5),
      y: -5,
      height: 100,
      width: 100,
      z_index: 6,
      frames: ["first", "second", "third", "last"],
      duration: 2000
    };
    this.ce.addMap([winLine, winStar, congratsStar, congratsStar2]); //feeds our new batch of winner objects to the game engine
    this.ce.excludeZIndex([4, 6]); //marks those z_indexs as unclickable, uncollidable for efficiency
  }
  else {
    winner = "TIE GAME!"; //sets the announcement text to Tie Game
  }
  //updates our positions with the included details in such a way to ensure proper rendering.

  this.ce.updateEntity("score1", {
    text: this.player1Wins.toString()
  });
  this.ce.updateEntity("score2", {
    text: this.player2Wins.toString()
  });
  this.ce.updateEntity("newMatchBack", {
    fillStyle: "#666"
  }); //reveals the new match button which we created at game start
  this.ce.updateEntity("newMatchLabel", {
    text: "New Match"
  });
  this.ce.updateEntity("winnerLabel", {
    text: winner
  });
  this.ce.Loop();  //tells our engine to start animating again after taking all the changes

  window.dispatchEvent(new CustomEvent("sendGA", {
    detail:['Demos', "Demo Win", "Tic Tac Toe "+ winner]
  }));
};

window.tictactoe = new tictactoeGame(); //creates a tic tac toe object from the class and puts it into the context of the browser window