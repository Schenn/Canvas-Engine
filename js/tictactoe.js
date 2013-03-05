
function tictactoeGame () {
     var canvas;   //gameScreen 
     var player1Wins =0;  //total wins
     var player2Wins=0;
     var counter;  //turns taken (faster then checking if every position is occupied)
     var jcH;  //the engine
     
     tictactoeGame.prototype.start = (function(){
          canvas = $("#game");  //the initial canvas  
          jcH = canvas.attachjcHandler({imagePath: "cImages/"});  //attaches our game engine to the canvas, hands over an image path
          
          //Adds the basic game spritesheet to the engine
          jcH.addSpritesheet({name:"ticTacSprites", source: "tictacsprites.png", height: 100, width: 100},
                             {"oToken": {},
                              "xToken": {sx: 50},
                              "positionBack": {sy: 50},
                              "winStar": {sx:50, sy:50}
                             });
          //Adds the animated star spritesheet to the engine
          jcH.addSpritesheet({name: "winningStar", source: "starsprites.png", height: 100, width: 100},
                             {"first": {},
                              "second": {sx: 50},
                              "third": {sy: 50},
                              "last": {sx:50, sy:50}
                              });
          //maximizes the canvas size
          jcH.maximize(); 
          curPlayer = 1; //sets the first player
          this.drawPositions();  //generates the basic elements of the board
          
     });
     
     tictactoeGame.prototype.drawPositions = function(){
          
          var positions = new Array();  //array of game objects
          
          jcH.clearPositions(); //clears all the game elements in use by our engine
          counter = 0; //resets the counter
          curPlayer = 1;
          
          var cHeight = parseInt(canvas.attr("height")); //screen dimensions
          var cWidth = parseInt(canvas.attr("width"));
          
          //our black background
          var background = {
               height: cHeight,
               width: cWidth,
               type: "rect",
               z_index: 0
          }
          
          positions[0] = background;
          
          // the basic grey box for the tokens to go in
          var position = {
               type: "sprite",
               spritesheet: "ticTacSprites",
               sprite: "positionBack",
               height: ((cHeight*.8)/4),
               width: ((cWidth*.8)/4),
               onClick: tictactoe.addToken,  //calls the addToken function of our tic-tac-toe game when the box is clicked
               fromCenter: false,
               z_index: 2
          };
          
          //begins counting up the x and y coordinates for our boxes.
          //Since our board is a grid, it is simpler to calculate then write out.
          var xcount =1;
          var xcounter =(cWidth*.25);
          var ycounter =(cHeight*.25);
          
          for(var i=1; i<=9; i++)
          {
               var temp = $.extend(true, {slot: i}, position);
               temp.name = "slot"+i;  //gives the slot an appropriate name tied to its position in the grid
               
               temp.x = (xcounter);
               temp.y = (ycounter);
               
               
               if(xcount >=3)
               {
                    xcount = 1;
                    xcounter =(cWidth*.25);
                    ycounter += temp.height + 10;
               }
               else
               {
                    xcount++;
                    xcounter += temp.width +10;
               }
               positions[i]=temp;
          }
          
          
          //player 1 score labels
          var score1label = {name:"score1label",
               x:10,
               y:20,
               text: "Player 1 Wins: ",
               z_index:1,
               type:"label"
          };
          var score1 = {name:"score1",
               x:25,
               y:35,
               align:"left",
               text: player1Wins,
               z_index:1,
               type:"label"
          };
          
          //player 2 score labels
          var score2label = {name:"score2label",
               x:10,
               y:60,
               text: "Player 2 Wins: ",
               z_index:1,
               type:"label"
          };
          
          var score2 = {name:"score2",
               x:25,
               y:80,
               align:"left",
               text: player2Wins,
               z_index:1,
               type:"label"
          };
          
          //new game button
          var buttonBack = {
               name: "newMatchBack",
               type: "rect",
               x: 15,
               y: 120,
               z_index: 2,
               height: 30,
               width: 100,
               onClick: (function(x){
                    if(x.fillStyle == "#666") //if the button is shown
                    {
                         jcH.PAUSE(); //pause the game loop
                         tictactoe.drawPositions(); //reset the board
                         jcH.PAUSE(); //redraw the game loop
                    }
               })
          };
          
          var buttonText = {
               type: "label",
               x: 30, y:135, z_index: 3,
               name: "newMatchLabel"
          };
          
          // wiiner announcement label
          var winnerText = {
               type: "label",
               x: cWidth/2, y:40, z_index: 1,
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
          
          jcH.addMap(positions, true);  //feeds our game objects to our engine
          
          //ensures quicker game response by marking 
          //specific z_index's as unresponsive to clicks and collisions
          jcH.excludeZIndex([0,1,3]);  
     };
     
     
     tictactoeGame.prototype.addToken = (function(position)
     {
          //get all positions(2 expected) from our engine which is a check for a token at this position and our winner announcement label
          var spots = jcH.getPositions([position.name + "owned", "winnerLabel"]);
          
          //if there is no token in this position, the game is not paused and the winner announcement label is blank
          if((spots[0] === false) && (jcH.paused === false) && (spots[1].text === ""))
          {
          
               //our Player Token
               var token = ({
                    name: position.name + "owned",
                    type: "sprite",
                    spritesheet: "ticTacSprites",
                    x: position.x + (position.width/2), y: position.y + (position.height/2),
                    height: position.height * .5, width: position.width * .5,
                    fromCenter: true,
                    z_index: 3
               });
               
               
               //sets the token sprite to the current player, advances to the next player
               if(curPlayer == 1)
               {
                    token.sprite = "xToken";
                    curPlayer = 2;
               }
               else
               {
                    token.sprite = "oToken";
                    curPlayer =1;
               }
               
               //increases our slots captured counter
               counter++;
               jcH.addMap([token], true); //feeds our token to the game engine with the instruction to continue the game loop
               
               
               //check for winner
               
               //see which applicable squares are occupied
               //first we get ask the engine for the tokens relevant to our current position
               switch(position.slot)
               {
                    case(1):
                         var slots = [jcH.getPositions(["slot2owned","slot3owned"]),
                                      jcH.getPositions(["slot4owned","slot7owned"]),
                                      jcH.getPositions(["slot5owned","slot9owned"])];
                         break;
                    case(2):
                         var slots = [jcH.getPositions(["slot1owned","slot3owned"]),
                                      jcH.getPositions(["slot5owned","slot8owned"])];
                         break;
                    case(3):
                         var slots = [jcH.getPositions(["slot2owned","slot1owned"]),
                                      jcH.getPositions(["slot5owned","slot7owned"]),
                                      jcH.getPositions(["slot6owned","slot9owned"])];
                         break;
                    case(4):
                         var slots = [jcH.getPositions(["slot1owned","slot7owned"]),
                                      jcH.getPositions(["slot5owned","slot6owned"])];
                         break;
                    case(5):
                         var slots = [jcH.getPositions(["slot1owned","slot9owned"]),
                                      jcH.getPositions(["slot2owned","slot8owned"]),
                                      jcH.getPositions(["slot3owned","slot7owned"]),
                                      jcH.getPositions(["slot4owned","slot6owned"])];
                         break;
                    case(6):
                         var slots = [jcH.getPositions(["slot4owned","slot5owned"]),
                                      jcH.getPositions(["slot3owned","slot9owned"])];
                         break;
                    case(7):
                         var slots = [jcH.getPositions(["slot1owned","slot4owned"]),
                                      jcH.getPositions(["slot3owned","slot5owned"]),
                                      jcH.getPositions(["slot9owned","slot8owned"])];
                         break;
                    case(8):
                         var slots = [jcH.getPositions(["slot5owned","slot2owned"]),
                                      jcH.getPositions(["slot7owned","slot9owned"])];
                         break;
                    case(9):
                         var slots = [jcH.getPositions(["slot1owned","slot5owned"]),
                                      jcH.getPositions(["slot3owned","slot6owned"]),
                                      jcH.getPositions(["slot7owned","slot8owned"])];
                         break;
               }
               
               //then for each potential token
               for(var i=0; i<slots.length;i++)
               {
                    var check = slots[i];
                    if((check[0] != false)&&(check[1] != false)) //if both of the appropriate token positions were retrieved
                    {
                         if((check[0].spriteName === check[1].spriteName) && (check[0].spriteName == token.sprite)) //if everyone is using the same image for their token
                         {
                              //we have a winner
                              var thisSpot = jcH.getPositions([position.name + "owned"]); //get this current processed token
                              check[3] = thisSpot[0]; //put it in our array of positions
                              tictactoe.announceWinner(check[0].spriteName, [check[0], check[1], check[3]]); //call our announcewinner function
                              
                              i = slots.length; //stop the for loop
                         }
                    }
               }
               
               if(counter >=9) //if the maximum number of turns has been taken
               {
                    tictactoe.announceWinner("#",[]); //call our announcewinner function, but as a tie game
               }
          }
     });
     
     tictactoeGame.prototype.announceWinner = function(token, spotArray)
     {
          var winner; //text of who won
          if(token !== "#") //if its not a tie
          { 
               var winPlayer;
               if(token === "xToken") //if its player 1
               {
                    player1Wins++; 
                    winner = "PLAYER 1 WINS!";
               }
               else if(token === "oToken") //if its player 2
               {
                    player2Wins++;
                    winner = "PLAYER 2 WINS!";
               }
               
               //set winner marks to collidable
               
               jcH.makePositionsCollidable([spotArray[0].name, spotArray[1].name, spotArray[2].name]);
               
               //init the coords for the line drawing
               var lineArray = []; 
               
               for(var i=0; i<spotArray.length; i++)
               {
                    lineArray.push({
                         x:spotArray[i].x,
                         y:spotArray[i].y
                    });
               }
               
               //define our line object
               var winLine = {type: "line", strokeStyle:"#ff0000", strokeJoin: "round", xyArray: lineArray, z_index:4};
               
               //define our falling star movable object
               //this object moves and animates the relevant positions while moving
               //it requires an already processed spritesheet
               function winMob(){
                    this.type= "mob";
                    this.spritesheet= "winningStar";
                    this.ySpeed= 100, this.x= Math.ceil(Math.random() * canvas.width()),
                    this.y= 0, this.z_index=5,
                    this.directions= {"S": ["first","second","third","last"]}, //this sets our South direction to the sprites in the array which are already in our game engine
                    this.fromCenter= false,
                    this.name= "winStar";
                    this.height = 100;
                    this.width = 100;
               };
               
               //the preDraw function must be created to call the move function in order for your mob to be able to move
               //you want to use the predraw for pathfinding, setting Directions and other stuff you want to do.
               //if you want your mob to move, you must call its move() function which is pre-built for you in such a way to automate animations
               //as well as ensuring a smooth animation speed.
               winMob.prototype.preDraw = (function(){
                    //"pathfinding"
                    //use jcH.collides(destination) to
                    //determine if a movement will generate a collision
                    if(this.y > canvas.height())
                    {
                         this.y = 0;
                         this.x = Math.ceil(Math.random() * canvas.width());
                    }
                    
                    //call move - automatically animates frame and moves a direction
                    this.move();
                    
               });
               
               winMob.prototype.postDraw = (function(){
                    //call collision detection on this in the postDraw.  This allows the movement to update the object.
                    jcH.collideOrPass(this);
               });
               
               
               winMob.prototype.onCollide = (function(collider){
                    
                    //check if colliding with winner token
                    //get winner from winnerText
                    
                    jcH.updatePosition("winnerLabel", {text: collider.name});
                    //jcH.clonePosition(this.name, {y:0, x:Math.ceil(Math.random() * canvas.width())});
                    //this.ySpeed = 0;
                    //this.x = collider.x;
                    //this.y = collider.y;
                    
               });
               
               
               //instantiates an object from our star class
               var winStar = new winMob();
               
               
               //our flashing stars next to the winner announcement
               //note how even though our star is a little on top of our announcement text, that it isn't erasing the text behind it as it animates.
               //that is due to our use of different z_index.  
               var congratsStar = {type: "sprite",
                    spritesheet: "winningStar",
                    fromCenter: false,
                    x: (canvas.width() / 4.5),
                    y: -5,
                    height: 100, width: 100,
                    z_index:6,
                    frames: ["first", "second", "third", "last"],
                    duration: 500
               }
               
               var congratsStar2 = {type: "sprite",
                    spritesheet: "winningStar",
                    fromCenter: false,
                    x: (canvas.width() / 1.5),
                    y: -5,
                    height: 100, width: 100,
                    z_index:6,
                    frames: ["first", "second", "third", "last"],
                    duration: 500
               }
               
               
               jcH.addMap([winLine, winStar, congratsStar, congratsStar2]); //feeds our new batch of winner objects to the game engine
               jcH.excludeZIndex([4,6]); //marks those z_indexs as unclickable, uncollidable for efficiency
          }
          else
          {
               winner = "TIE GAME!"; //sets the announcement text to Tie Game
          }
          
          //updates our positions with the included details in such a way to ensure proper rendering.
          jcH.updatePosition("score1", {text: player1Wins});
          jcH.updatePosition("score2", {text: player2Wins});
          jcH.updatePosition("newMatchBack", {fillStyle: "#666"}); //reveals the new match button which we created at game start
          jcH.updatePosition("newMatchLabel", {text: "New Match"});
          jcH.updatePosition("winnerLabel", {text: winner});
          
          
          jcH.LOOP();  //tells our engine to start animating again after taking all the changes
          
     }
     
}

window.tictactoe = new tictactoeGame(); //creates a tic tac toe object from the class and puts it into the context of the browser window