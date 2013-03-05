//Javascript Canvas Handler

// Author: Steven Chennault

// Official creation start date: 02/15/12 10AM Pacific

// Dependencies:

//        jQuery

//        jCanvas (a jQuery plugin by Caleb Evans which simplifies the drawing process)

//

//


window.requestAnimationFrame = function(){

    return (

        window.requestAnimationFrame       ||

        window.webkitRequestAnimationFrame ||

        window.mozRequestAnimationFrame    ||

        window.oRequestAnimationFrame      ||

        window.msRequestAnimationFrame     ||

        function(/* function */ callback){

            window.setTimeout(callback, 1000 / 60);

        }

    );

}();



function jcHandler(init)

{

    // No-Default variables

    this.jcArray = [];

    this.jcArray[0] = $(init.myCanvas);

    this.excludes = [];

    // Default variables



    this.imagePath  = init.imagePath;



    // Empty Variables

    this.positions = {}; // Position objects (positions.positionname)

    this.z_index = []; // The order objects should be drawn

    this.spritesheets = {};

    this.gradients = {};  // Stored Gradients

    this.filters = {}; // Pixel filters -- Adds an effect to the canvas screen

    //user-generated functions

    this.onCall = {};

    this.paused = false;

    //this.timer = new TIMER();



    //Canvas Display Default Classes



    function cLabel()

    {

        //Private Properties

        this.fillStyle = "#fff";

        this.align = "left";

        this.baseline = "middle";

        this.font = "normal 1em Georgia, 'Times New Roman', Times, serif";



        //Public Properties

        this.text = "";



    }



    cLabel.prototype.fontWeight = (function(newWeight){



            var newFont = "";

            if(typeof(newWeight) !== "undefined") // if the new font weight is set

            {

                var index = this.font.indexOf("normal"); //is fontweight normal?

                var boldIndex = this.font.indexOf("bold"); // is fontweight bold?

                if(index >-1) // if normal

                {

                    newFont = this.font.slice(0, index); //cut the font string up to the location of normal

                    newFont += newFontWeight + this.font.slice((index+6)); //Add in new font and append rest of string after normal

                }

                if(boldIndex >-1); // if bold

                {

                    newFont = this.font.slice(0, boldIndex); // cut font string up bold

                    newFont += newFontWeight + this.font.slice((boldIndex+4)); // adds in new font and appends rest of string after bold

                }



                this.font = newFont; // reassign the labels font

                return(true); // returns true to verify function was success

            }

            else //return the current font weight

            {

                if(this.font.indexOf("normal")) // if fontwieght == normal

                {

                    return("normal");

                }

                if(this.font.indexOf("bold")) // if fontweight == bold

                {

                    return("bold");

                }

            }

            return(false); // invalid or missing fontweight

        });



    cLabel.prototype.fontSize = (function(newSize){



            var index = this.font.search(/\d{2}/, this.font); // search the font for a 2 digit number

            if(typeof(newSize) != "undefined")  //if newsize is set

            {

                if(index >= 0) //if fontSize found

                {

                    var newFontString = this.font.slice(0, index); // cut beginning of font up to location of font size

                    newFontString += newSize + this.font.slice((index+2)); // appends rest of the string with new font size



                    this.font = newFontString; // updates the labels font

                    return(true); // returns success

                }

            }

            else

            {

                var oldSize = parseInt(this.font.slice(index, index+2)); //cuts out the current font size

                return(oldSize) // returns the current Size

            }



            return(false); // returns failure



        });



      cLabel.prototype.fontFamily = (function(newFamily){



            var index = this.font.indexOf("px"); // get string up to the font family

            index +=3; // moves pointer to beginning of font name



            if(typeof(newFamily) !== "undefined") // if new Font Family is set

            {

                var resetfont = this.font.slice(0, index); //cut out the old font family

                resetfont += newFamily + (this.font.slice((index+newFamily.length))); // put in the new font family

                this.font = resetfont; // reset font

                return(true);

            }

            else

            {

                var oldFont = this.font.slice(index); // cut out the string up the expected font family

                var trimFont = "";

                index = oldFont.indexOf("px"); //if the current string still has a font size spec - cut it out

                if(index)

                {

                    trimfont = oldFont.slice(0, index-1);

                    trimFont += oldFont.slice(index+2);

                }

                var numindex = oldFont.search(/\d{2}/, oldFont); //if the current string still has a font size - cut it out

                if(numindex)

                {

                    trimfont = oldFont.slice(0, index-1);

                    trimfont += oldFont.slice(index+2);

                }



                var weightIndex = oldFont.indexOf("normal"); // cut out font weight

                if(!(weightIndex))

                {

                    weightIndex = oldFont.indexOf("bold");

                    if(weightIndex)

                    {

                        trimfont = oldFont.slice(0, weightIndex);

                        trimfont += oldFont.slice(index+4);

                    }

                }

                else

                {

                    trimfont = oldFont.slice(0, weightIndex);

                    trimfont += oldFont.slice(index+6);

                }



                return(oldFont); // return current font name

            }

            return(false); // return failed

        });



      cLabel.prototype.clearInfo = (function(canvas){

            var size = this.fontSize(),

            c = canvas.loadCanvas();

            c.font = this.font;



            var s1 = c.measureText(this.text);

            var s2 = c.measureText("M");



            var _x = this.x;



            if(this.align === "left")

            {

                _x += s1.width/2;

            }

            else if(this.align === "right")

            {

                _x -= s1.width/2;

            }



            return({x: Math.ceil(_x), y: Math.ceil(this.y),

            height: Math.ceil(s2.width * 1.25),

            width: Math.ceil(s1.width * 1.25), fromCenter: true});



        });



      cLabel.prototype.render = (function(canvas){



            if(typeof(this.text) !== "undefined")

            {

                canvas.drawText({

                    fillStyle: this.fillStyle,

                    strokeStyle: this.strokeStyle,

                    strokeWidth: this.strokeWidth,

                    x: this.x,

                    y: this.y,

                    text: this.text,

                    align: this.align,

                    baseline: this.baseline,

                    font: this.font

                });

            }

        });



    function cRect()

    {

        this.fromCenter = false;

        this.height = 100;

        this.width = 100;

        this.fillStyle = "#000000";

    }



    cRect.prototype.clearInfo = (function(){

            return({x: Math.ceil(this.x -1) , y:Math.ceil(this.y), height: Math.ceil(this.height), width: Math.ceil(this.width), fromCenter: this.fromCenter});

        });



    cRect.prototype.render = (function(canvas){

            canvas.drawRect({

                fillStyle: this.fillStyle,

                x: this.x, y: this.y,

                height: this.height, width: this.width,

                fromCenter: this.fromCenter,

                strokeStyle: this.strokeStyle,

                strokeWidth: this.strokeWidth,

                cornerRadius: this.cornerRadius

            });

        });



    function cLine()

    {

        this.strokeStyle = "#000000";

        this.strokeCap = "round";

        this.strokeJoin = "miter";

        this.strokeWidth = 10;

        this.rounded = false;



        this.normalPlot;

    }



    cLine.prototype.plot = (function(xyArray){

            this.normalPlot = xyArray;



            for(var i=1; i<=xyArray.length; i++)

            {

                this["x"+i]=xyArray[i-1].x;

                this["y"+i]=xyArray[i-1].y;



            }

         });



    cLine.prototype.clearInfo = (function(){



            var smallx = 0;

            var smally = 0;

            var bigx = 0;

            var bigy = 0;



            for(var i =0; i<this.normalPlot.length;i++)

            {

                if(this.normalPlot[i].x <= smallx)

                {

                    smallx = this.normalPlot[i].x;

                }

                if(this.normalPlot[i].y <= smallx)

                {

                    smallx = this.normalPlot[i].y;

                }

                if(this.normalPlot[i].x >= bigx)

                {

                    bigx = this.normalPlot[i].x;

                }

                if(this.normalPlot[i].y >= bigy)

                {

                    bigy = this.normalPlot[i].y;

                }

            }



            var cwidth = bigx - smallx;

            var cheight = bigy - smally;



          return({

            x: smallx,y: smally,

            width: cwidth, width: cheight, fromCenter: false});

        });



    cLine.prototype.render = (function(canvas){

              var l = $.extend({}, this);



              canvas.drawLine(l);

        });



    function cImage()

    {

         this.height = 0;

         this.width = 0;

         this.fromCenter = false;

         this.source = "";

         this.load;

    }



    cImage.prototype.clearInfo = (function(){



              return({x: Math.ceil(this.x -1) , y:Math.ceil(this.y), height: Math.ceil(this.height), width: Math.ceil(this.width), fromCenter: this.fromCenter});



         });



    cImage.prototype.render = (function(canvas){

            canvas.drawImage({

                 source: this.source,

                 x: this.x, y: this.y,

                 height: this.height, width: this.width, sx: this.sx, sy: this.sy,

                 sWidth: this.sWidth, sHeight: this.sHeight,

                 fromCenter: this.fromCenter, cropFromCenter: this.cropFromCenter, load: this.load

            });



            delete this.load;

        });







    function TIMER(){

         this.date = new Date();

         this.delta = new Date();

    }



    TIMER.prototype.update = (function() {

            this.delta = this.date;

            var d = new Date();

            this.date = d;

        });



    TIMER.prototype.getMS = (function() {

            return(this.date.getTime());

        });



    TIMER.prototype.getS = (function() {

            return(Math.round(this.date.getTime / 1000));

        });



    TIMER.prototype.deltaTime = (function() {

            return((this.date.getTime() - this.delta.getTime()) / 1000);

        });





    function cSprite(source, positionInfo)

    {

        this.timer = new TIMER();



        this.fTime = 0;

        this.collides = true;





        if(typeof(positionInfo.sprite) !== "undefined")

        {

            this.sprite = source[positionInfo.sprite];

            this.spriteName = positionInfo.sprite;

            this.duration = 0;

        }



        if(typeof(positionInfo.frames) !== "undefined")

        {

            this.frames = [];

            for(var i = 0; i < positionInfo.frames.length; i++)

            {

                this.frames[i] = $.extend({frameName: positionInfo.frames[i]},source[positionInfo.frames[i]]);

            }



            this.sprite = this.frames[0];

            this.spriteName = this.frames[0].frameName;

            this.duration = positionInfo.duration || 500;

            this.currentFrame = 0;

            this.lastFrame = -1;



            var d = new Date();

            if(this.frames.length > 0)

            {

                this.fTime = d.getTime() + (this.duration / this.frames.length);

            }



        }



        if(positionInfo.height)

        {

            this.sprite.height = positionInfo.height;

        }

        if(positionInfo.width)

        {

            this.sprite.width = positionInfo.width;

        }

    }



    cSprite.prototype.init = (function()

        {

            var d = new Date();

            if(this.frames.length > 0)

            {

                this.fTime = d.getTime() + (this.duration / this.frames.length);

            }

        });



    cSprite.prototype.animateFrame = (function(){

            if(this.duration > 0) {

                var d = new Date();

                if(this.frames.length > 0)

                {

                    this.fTime = d.getTime() + (this.duration / this.frames.length);

                }

                else

                {

                    this.fTime = 0;

                }



                if(this.currentFrame === this.frames.length-1)

                {

                    this.currentFrame = 0;

                }

                else

                {

                    this.currentFrame++;

                }



                this.sprite = $.extend({}, this.frames[this.currentFrame]);

            }

        });



    cSprite.prototype.render = (function(canvas){

            this.timer.update();

            if(this.duration > 0)

            {

                if(this.timer.getMS() > this.fTime)

                {

                    this.animateFrame();

                }

            }



            var myx = (this.x + 0.5) | 0; //strips out partial pixels.

            var myy = (this.y + 0.5) | 0;



            canvas.drawImage({

                source: this.sprite.source,

                x: myx, y: myy,

                height: this.sprite.height, width: this.sprite.width, sx: this.sprite.sx, sy: this.sprite.sy,

                sWidth: this.sprite.sWidth, sHeight: this.sprite.sHeight, fromCenter: this.fromCenter, cropFromCenter: this.sprite.cropFromCenter, load: this.load

            });



            delete this.sprite.load;



        });



    cSprite.prototype.clearInfo = (function(){



            return({x: Math.floor(this.x -1) , y:Math.floor(this.y),

                height: Math.ceil(this.sprite.height), width: Math.ceil(this.sprite.width),

                fromCenter: this.fromCenter});



        });



    function BOUNDRYBOX(height, width)

    {

        this.V = []; //top and bottom y

        this.V[0] =[]; //West

        this.H = []; //left and right x

        this.H[0] = []; //North



        this.maxY = parseInt(height-1);

        this.maxX = parseInt(width-1);

        this.V[this.maxX]=[]; //west

        this.H[this.maxY]=[]; //south



        //fill edges

        for(var x = 0; x <= this.maxX; x++)

        {

            if(x === 0)

            {

                for(var y = 0; y <= this.maxY; y++)

                {

                    this.V[0][y] = true; //load north line

                    this.V[this.maxX][y] = true; //load south line

                }

            }

            this.H[0][x] = true; //load west line

            this.H[this.maxY][x] = true; //load east line

        }



    }



    BOUNDRYBOX.prototype.getEdgePixels = (function(edge, coords){ //top-left coords of mob

        var pixels = [];

        if((edge === "N") || (edge === "S"))

        {

            if(edge === "N")

            {

                var y = coords.y;

            }

            else

            {

                var y = this.maxY + coords.y;

            }

            for(var xc = 0; xc < this.H[0].length; xc++)

            {

                pixels[(xc + coords.x)];

                pixels[(xc + coords.x)]=y;

            }

        }

        else if((edge === "E") || (edge === "W"))

        {

            if(edge === "W")

            {

                var x = coords.x;

            }

            else

            {

                var x = this.maxX + coords.x;

            }

            for(var yc = 0; yc < this.V[this.maxX].length; yc++)

            {

                pixels[x] = yc + coords.y;

            }

        }



        return(pixels);

    });



    function cMob(spritesheet, directions)

    {

        this.directionAnimations = {};

        this.spritesheet = spritesheet;

        this.direction = "S";

        this.xSpeed = 0;

        this.ySpeed = 0;

        this.x = -50;

        this.y = -50;

        this.height = 50;

        this.width = 50;

        this.animationSpeed = 500;

        this.currentFrame = 0;

        this.atimer = new TIMER();

        this.mtimer = new TIMER();

        this.fTime = 0;

        this.hasGravity = false;

        this.collides = true;





        for(var direction in directions){

            this.directionAnimations[direction] = [];

            for(var i = 0; i < directions[direction].length; i++)

            {

                this.directionAnimations[direction][i] = directions[direction][i];

            }

        };





    }



    cMob.prototype.addDirection = (function(direction, spriteNames)

        {

            this.directionAnimations[direction] = [];

            for(var i = 0; i < spriteNames.length; i++)

            {

                this.directionAnimations[direction][i] = this.spritesheet[spriteNames[i]];

            }



        });



    cMob.prototype.setCollidable = (function(){

        this.boundryBox = new BOUNDRYBOX(this.height, this.width);

    });



    cMob.prototype.setDirection = (function(direction, xSpeed, ySpeed)

        {

            var d = new Date();

            this.fTime = d.getTime() + (this.animationSpeed / this.directionAnimations[direction].length);



            this.direction = direction;

            this.xSpeed = xSpeed;

            this.ySpeed = ySpeed;

        });



    cMob.prototype.animateDirection = (function()

        {

            var d = new Date();

            if(this.directionAnimations[this.direction].length > 0)

            {

                this.fTime = d.getTime() + (this.animationSpeed / this.directionAnimations[this.direction].length);

            }

            else

            {

                this.fTime = 0;

            }



            if(this.currentFrame === this.directionAnimations[this.direction].length-1)

            {

                this.currentFrame = 0;

            }

            else

            {

                this.currentFrame++;

            }





        });



    cMob.prototype.clearInfo = (function(){



            return({x: Math.ceil(this.x -1) , y:Math.ceil(this.y),

                height: Math.ceil(this.height), width: Math.ceil(this.width),

                fromCenter: this.fromCenter});



        });



    cMob.prototype.render = (function(canvas){



            this.atimer.update();

            this.mtimer.update();



            if(this.atimer.getMS() > this.fTime)

            {

                this.animateDirection();

            }





            var spriteInfo = this.spritesheet[this.directionAnimations[this.direction][this.currentFrame]];



            canvas.drawImage({

                source: spriteInfo.source,

                x: this.x, y: this.y,

                height: this.height, width: this.width, sx: spriteInfo.sx, sy: spriteInfo.sy,

                sWidth: spriteInfo.sWidth, sHeight: spriteInfo.sHeight, fromCenter: this.fromCenter, cropFromCenter: spriteInfo.cropFromCenter

            });



            if(typeof(this.load) === "function")

            {

                this.load();

            }

            delete this.load;



        });



    cMob.prototype.move = (function(canvas){



       this.clearLast = this.clearInfo();

       this.lastX = this.x;

       this.lastY = this.y;

       if(this.ySpeed !== 0)

       {

            this.moveY();

       }

       if(this.xSpeed !== 0)

       {

            this.moveX();

       }



    });



    cMob.prototype.moveY = (function()

        {

            this.y += this.ySpeed * this.mtimer.deltaTime();



        });



    cMob.prototype.moveX = (function()

        {

            this.x += this.xSpeed * this.mtimer.deltaTime();

        });



    cMob.prototype.boundryEdgePixels = (function(){



            var pixels = [];

            if((this.x + this.xSpeed) > this.x)

            {

                pixels.push(this.boundryBox.getEdgePixels("E", {x: this.x, y: this.y}));

            }

            else if((this.x + this.xSpeed) < this.x)

            {

                pixels.push(this.boundryBox.getEdgePixels("W", {x: this.x, y: this.y}));

            }

            if((this.y + this.ySpeed) > this.y)

            {

                pixels.push(this.boundryBox.getEdgePixels("S", {x: this.x, y: this.y}));

            }

            else if((this.y + this.ySpeed) < this.y)

            {

                pixels.push(this.boundryBox.getEdgePixels("N", {x: this.x, y: this.y}));

            }



            if(pixels.length === 0)

            {

                pixels = false;

            }







            return(pixels);



        });







    function cTilemap(tilesheet )

    {

        this.tilesheet = typeof(tilesheet) !== "undefined" ? tilesheet : "rect";

        this.tile = {height: 32, width: 32};

        this.grid = {height: 1000, width: 1000};

        this.map = [];

        this.collides = true;

        this.stopsMovement = true;

        this.scroll = {

            x: 0, y: 0

        }

        this.isDrawn = false;



    }



    cTilemap.prototype.render = (function(canvas){



            var startRow = Math.floor(scroll.x / tile.width);

            var startCol = Math.floor(scroll.y / tile.height);



            var rowCount = startRow + Math.floor(canvas.width() / this.tile.width) + 1;

            var colCount = startCol + Math.floor(canvas.height() / this.tile.height) + 1;



            rowCount = ((startRow + rowCount) > this.grid.width) ? grid.width : rowCount;

            colCount = ((startCol + colCount) > this.grid.height) ? grid.height : colCount;



            for(var row = startRow; row < rowCount; row++)

            {

                for(var col = startCol; col < colCount; col++)

                {

                    var tileX = tile.width * row;

                    var tileY = tile.height * col;



                    tileX -= scroll.x;

                    tileY -= scroll.y;



                    if(typeof(this.map[row]) !== "undefined")

                    {

                        if(typeof(this.map[row][col]) !== "undefined")

                        {

                            if(tilesheet === "rect")

                            {

                                canvas.drawRect({x: tileX, y: tileY, height: tile.height, width: tile.width, fillStyle: "#000", fromCenter: false});

                            }

                            else

                            {

                                canvas.drawImage({

                                    source: this.tilesheet.source,

                                    x: tileX, y: tileY,

                                    height: tile.height, width: tile.width,

                                    sx: this.tilesheet[this.map[row][col]].sx,

                                    sy: this.tilesheet[this.map[row][col]].sy,

                                    sWidth: this.tilesheet[this.map[row][col]].sWidth,

                                    sHeight: this.tilesheet[this.map[row][col]].sHeight,

                                    fromCenter: false,

                                    cropFromCenter: this.tilesheet[this.map[row][col]].cropFromCenter

                                });

                            }

                        }

                    }

                }

            }



         });



    cTilemap.prototype.scroll = (function(vector, canvas){

              this.scroll.x += vector.x;

              this.scroll.y += vector.y;

              this.render(canvas);

         });



    cTilemap.prototype.clear = (function(canvas){

              canvas.clearCanvas();

         });



    cTilemap.prototype.pixelToTile = (function(coord){

              var row = Math.floor(coord.x / tile.width);

              var col = Math.floor(coord.y / tile.height);



              if(typeof(this.map[row]) !== "undefined")

              {

                   if(typeof(this.map[row][col]) !== "undefined")

                   {

                        return({r: row, c: col});

                   }

              }

              return(false);

         })



    cTilemap.prototype.onClick = (function(coord){



              //get col and row from pixel

              //call this.tileClick(col,row)





         });



    //Prototyped Functions



    //////////////////////////

    // CANVAS FUNCTIONS BEGIN

    //////////////////////////



    /*

    * Name: maximize

    * Params: modifier = 100

    * Description: When run on a canvas element, it changes the canvas size to

    * the size of the parent element modified by the modifier which defaults at 100%

    *

   */

    this.maximize = (function(modifier)

    {

        modifier = typeof(modifier) != 'undefined' ? modifier/100 : 1; // if modifier is not set, set it to 100%



        var folks = this.jcArray[0].parent(),

        fWidth = parseInt(folks.width())*modifier,

        fHeight = parseInt(folks.height()) * modifier;



        //for each z_level canvas, maximize the canvas

        for(var i=0; i<this.jcArray.length; i++)

        {

            this.jcArray[i].attr("height", fHeight).attr("width", fWidth);

        }

    });





    /*

     * Name: addMap

     * Params: screenMap - array of json/objects

     * Description: Applies an array of objects to the canvas, creating manipulatable positional

     * information.  Controls the display and animation of canvas objects.

     * Applies default settings to missing settings

    */

    this.addMap = (function(screenMap, doLoop)

    {

        //Position Handler Tags

        var defaultPositionInfo = {

            z_index: this.z_index.length

        };



        var ziIndex = [];



        for(var i=0; i<screenMap.length; i++) // for each object in the screenMap

        {

            var newPositionInfo = screenMap[i]; // extract the position info from screenMap which is translated from a string to an object

            var positionHead = {  // Create a header for the position

                "name": (typeof(newPositionInfo.name) !== "undefined"? newPositionInfo.name : $.fn.randjcHName()),

                "type": newPositionInfo.type

            }



            // Remove header from the info



            // Place the object header in the this.z_index at either a specified position

            // Defaults at the current top level of the z_index



            // jcHandler position management tags are appended to the object

            var positionInfo = $.extend(true, {}, defaultPositionInfo, newPositionInfo);



            delete newPositionInfo;



            if(typeof(this.z_index[positionInfo.z_index]) === "undefined")

            {

                this.z_index[positionInfo.z_index] = [];

                if(typeof(this.jcArray[positionInfo.z_index]) === "undefined") this.addZLayer(positionInfo.z_index);

            }

            if(typeof(ziIndex[positionInfo.z_index])==="undefined")

            {

                ziIndex[positionInfo.z_index] = this.z_index[positionInfo.z_index].length;

            }



            //according to jsPerf, switch is terribly inefficient (88% slower).  Use if-elseif instead



            if(positionHead.type === "label")

            {

                var label = $.extend(true, {}, new cLabel, positionInfo);

                positionHead.clearInfo = label.clearInfo(this.jcArray[positionInfo.z_index]);

                this.positions[positionHead.name] = label;

            }

            else if(positionHead.type === "rect")

            {

                var rect = $.extend(true, {}, new cRect, positionInfo);

                positionHead.clearInfo = rect.clearInfo(this.jcArray[positionInfo.z_index]);

                this.positions[positionHead.name] = rect;

            }

            else if(positionHead.type === "image")

            {

                var image = $.extend(true, {}, new cImage, positionInfo);

                positionHead.clearInfo = image.clearInfo(this.jcArray[positionInfo.z_index]);

                image.source = this.imagePath + image.source;

                this.positions[positionHead.name] = image;

            }

            else if(positionHead.type === "line")

            {

                var line = new cLine;

                line.plot(positionInfo.xyArray);

                positionHead.clearInfo = line.clearInfo(this.jcArray[positionInfo.z_index]);

                delete positionInfo.xyArray;

                $.extend(true, line, positionInfo);

                this.positions[positionHead.name]=line;

            }

            else if(positionHead.type === "sprite")

            {

                var sprite = new cSprite(this.spritesheets[positionInfo.spritesheet], positionInfo);



                delete positionInfo.sprite;

                delete positionInfo.frames;

                $.extend(true, sprite, positionInfo);



                positionHead.clearInfo = sprite.clearInfo(this.jcArray[positionInfo.z_index]);

                this.positions[positionHead.name] = sprite;

            }

            else if(positionHead.type === "mob")

            {

                var mob = new cMob(this.spritesheets[positionInfo.spritesheet], positionInfo.directions);

                delete positionInfo.spritesheet;

                delete positionInfo.directions;

                $.extend(true, mob, positionInfo);

                positionHead.clearInfo = mob.clearInfo(this.jcArray[positionInfo.z_index]);



                if(mob.collides)

                {

                    mob.setCollidable();

                }

                this.positions[positionHead.name] = mob;

            }

            else if(positionHead.type === "tilemap")

            {

                var tMap = new cTilemap(this.spritesheets[positionInfo.spritesheet]);

            }





            this.z_index[positionInfo.z_index][ziIndex[positionInfo.z_index]] = positionHead;

            ziIndex[positionInfo.z_index]++;





        }



        if(doLoop)

        {

            this.LOOP();

        }

    });





    /*

    * Name: addZLayer

    * Description: adds a zLayer Canvas to the jcH for drawing zlayers on, delegates the onclick event

   */

    this.addZLayer = (function(z)

    {

        var tag = "zLayer" +z;

        $("<canvas id='"+ tag +"'></canvas>").appendTo(this.jcArray[0].parent());

        tag = "#" + tag;

        $(tag).attr("height", this.jcArray[0].attr("height"))

        .attr("width", this.jcArray[0].attr("width"))

        .css("z_index", z)

        .on("click", this.checkClickMap);

        this.jcArray[z] = $(tag);





    });





    /*

    * Name: drawCanvas

    * Description: Iterates through the z_index, drawing the stored objects

   */

    this.drawCanvas = (function()

    {

        for(var z=0; z<this.z_index.length; z++) // for each spot in the z_index, starting at the beginning

        {

            if(typeof(this.z_index[z]) !== "undefined")

            {

                if(typeof(this.z_index[z][0]) !== "undefined")

                {

                    this.drawZ(z, this.z_index[z]);

                }

            }

        }

    });





      /*

     * Name: drawPosition

     * Description: Takes an object and draws it to the appropriate canvas

    */



    this.drawZ = (function(Z, zPositions)

    {



        for(var i=0; i<zPositions.length; i++) // for each position in the z_index

        {

            var positionHead = zPositions[i]; // get the position Header



            var positionInfo = this.positions[positionHead.name];



            //Pre-Render



            if(typeof(positionInfo.preDraw) !== "undefined")

            {

                positionInfo.preDraw(this.jcArray[Z]);

            }



            // RENDERING

            if((positionHead.type === "tilemap")&&(!(positionInfo.isDrawn)))

            {

                positionInfo.clear(this.jcArray[Z]);

                positionInfo.render(this.jcArray[Z]);

                positionInfo.isDrawn = true;

            }



            var clear = positionHead.clearInfo || positionInfo.clearLast;



            if(typeof(clear) !== "undefined")

            {

                // get the position Info from the positions





                this.jcArray[Z].clearCanvas(clear);



                positionInfo.render(this.jcArray[Z]);



                // Remove clear info as item is only drawn once.  If it changes, the clearInfo will reset



                if(typeof(positionInfo.duration) === "undefined")

                {

                     delete positionHead.clearInfo;

                }

                else if(positionInfo.duration === 0)  //non-animating sprite/mob  - updating the sprite with a new sprite source will refresh

                {

                     delete positionHead.clearInfo;

                }



                delete positionInfo.clearLast;

            }



            //Post-Render

            if((typeof(positionInfo.postDraw) === "function")||(typeof(positionInfo.postDraw) === "object"))

            {

                positionInfo.postDraw(this.jcArray[Z]);

            }

        }

    });





    /*

    * Name: position

    * Params: positionName

    * Description: Returns a specific position from the canvas

    *

    */

    this.getPositions = (function(positionNames)

    {

        var found = [];

        for(var i = 0; i < positionNames.length; i++)

        {

            if(this.positions[positionNames[i]])

            {

                found[i] = this.positions[positionNames[i]];

            }

            else

            {

                found[i] = false;

            }

        }



        if(found.length === 0)

        {

            return(false);

        }

        else

        {

            return(found);

        }



        return(false);

    });





    /* makePositionsCollidable

      * params: positionNames Array

      * description: sets sprites and mobs to be collidable

     */

    this.makePositionsCollidable = (function(positionNames){

        for(var i=0; i< positionNames.length; i++)

        {

            this.positions[positionNames[i]].collides = true;

            this.excludeZIndex(this.positions[positionNames[i]].z_index, true);

            this.positions[positionNames[i]].boundryBox = new BOUNDRYBOX(this.positions[positionNames[i]].height, this.positions[positionNames[i]].width);

        }

    });



    /*

    * Name: collideOrPass

    * Params: positionName, {x, y}, bothCollisions

    * Description: triggers collision and returns false if colliding object stops movement or returns true if can move through.

    * if bothCollisions is true, will fire collision on both objects.

    */

    this.collideOrPass = (function(collider, trigger, bothCollisions)

    {

        //Collision Detector



        //get direction

        //can have 2 non-opposing directions



        var collidablePixels = collider.boundryEdgePixels();

        var cPositionsFound = [];



        for(var i = 0; i < collidablePixels.length; i++)

        {

            var pixelList = collidablePixels[i];



            var lastX = pixelList.length-1;

            if(typeof(pixelList[lastX]) !== "undefined")

            {

                if(typeof(pixelList[lastX-1]) !== "undefined") //if x-line

                {

                    cPositionsFound.push(this.positionsAtPixel({x: lastX, y: pixelList[lastX]}, collider.width, 1));

                }

                else

                {

                    cPositionsFound.push(this.positionsAtPixel({x: lastX, y: pixelList[lastX]}, 1, collider.height));

                }



            }

        }



        var coords = {};



        for(var i=0; i<cPositionsFound.length; i++)

        {

            var bang = this.positions[cPositionsFound[i]];



            if(typeof(trigger) === "undefined")

            {

                trigger = true;

            }

            if(bang)

            {

                if(trigger)

                {

                    if(typeof(collider.onCollide) === "function")

                    {

                        collider.onCollide(bang, coords);

                    }

                    if((bothCollisions) && (typeof(bang.onCollide) === "function"))

                    {

                        bang.onCollide(this.positions[cPositionsFound[i]], coords);

                    }

                }



                if(bang.stopsMovement)

                {

                    return(false);

                }

                else{

                    return(true);

                }

            }

            else

            {

                return(true);

            }

        }

        return(true);



    });









     /*

      * Name: collides

      * Describes: Checks if a position is collidable

      * Params: coords

      */

     this.collides = (function(coords)

     {

        var posArray = this.positionsAtPixel(positionEdge[i].x,  positionEdge[i].y);

        if(posArray.length > 0)

        {

            return(posArray);

        }

        return(false);



     });





     /* Name: excludeZIndex

      * Description: Sets a z_index to be excluded from position checks.  (For example, score values, background layers)

      */

     this.excludeZIndex = (function(zArray, undo)

     {

        for(var i=0; i<zArray.length; i++)

        {

            if(!(undo))

            {

                this.excludes[zArray[i]] = true;

            }

            else

            {

                delete this.excludes[zArray[i]];

            }

        }



     });



    /* Name: positionAtPixel

     * Description: returns an array of position headers at a particular pixel across the z_indexes

     *

     */

    this.positionsAtPixel = (function(coords, w, h)

    {

        var positions = [];

        for(var z = this.z_index.length-1; z>=0; z--)

        {

            if(!(this.excludes[z]))

            {

                if(this.jcArray[z].atPixel(coords.x, coords.y, h, w, true))

                {

                    for(var i = 0; i< this.z_index[z].length; i++)

                    {

                        var positionName = this.z_index[z][i].name;

                        var box = this.positions[positionName].clearInfo(this.jcArray[z]);



                        var x = Math.ceil(box.x);

                        var y = Math.ceil(box.y);

                        var width = Math.ceil(box.width);

                        var height = Math.ceil(box.height);



                        var leftboundry = x;

                        var rightboundry = x;

                        var topboundry = y;

                        var bottomboundry = y;



                        if(box.fromCenter)

                        {

                            leftboundry -= (0.5 * width);

                            rightboundry += (0.5 * width);

                            topboundry -= (0.5 * height);

                            bottomboundry += (0.5 * height);

                        }

                        else

                        {

                            rightboundry += width;

                            bottomboundry += height;

                        }



                        if((coords.x >= leftboundry) && (coords.x <= rightboundry)

                            && ((coords.y >= topboundry) && (coords.y <= bottomboundry)))

                        {



                            positions.push(positionName)

                            break;

                        }

                    }

                }

            }

        }

        if(typeof(positions[0]) !== "undefined")

        {

            return(positions);

        }

        else

        {

            return(false);

        }

    });



    /*

    * Name: removePosition

    * Params: positionName

    * Description: Removes a specific position from the canvas

    *

    */

    this.removePosition = (function(positionName)

    {

        if((positionName != "") && (typeof(positionName) != "undefined")) // if positionName

        {

            this.jcArray[this.positions[positionName].z_index].clearCanvas(this.positions[positionName]); // clear the object

            if(typeof(this.positions[positionName].onDie) === "function")

            {

                 this.positions[positionName].onDie();

            }

            delete(this.positions[positionName]); // delete the position at positionName



            for(var z = this.z_index.length-1; z >=0 ; z--) // for each layer of zindex

            {

                for(var i = this.z_index[z].length-1; i >=0 ; i--) // for each object in that z layer

                {

                    if(this.z_index[z][i].name === positionName)

                    {

                        this.z_index[z].splice(i,1); // delete the position header in the z_index

                        this.z_index[z] = $.fn.cleanArray(this.z_index[z]);



                        if((this.z_index[z].length <=0) && (z > 0))

                        {

                            this.removeZLayer(z);

                        }

                        var end = true;

                        break;

                    }

                }

                if(end)

                {

                    break;

                }

            }

        }

    });



    /*

     * Name: removeZLayer

     * Description: removes a zLayer Canvas

    */

    this.removeZLayer = (function(z)

    {

        var tag = "#zLayer" +z;

        $(tag).remove();



        this.z_index.splice(z,1);

        this.jcArray.splice(z,1);





    });



     /*

     * Name: clearPositions

     * Params: labelName

     * Description: Removes a specific label from the canvas

     */

     this.clearPositions = (function(f) {



        for(z = this.z_index.length-1; z >=0; z--)

        {

            for(i = this.z_index[z].length-1; i >= 0; i--)

            {

                 this.removePosition(this.z_index[z][i].name);

            }

        }



        if(typeof(f)==="function")

        {

            f();

        }

     });



     /* Name: checkClickMap

     * Params: Click Event

     * Description: Checks the position map for a 'hit' from a click event

     */

     this.checkClickMap = (function(e) {



        var offset = $(this).offset();

        var jcH = $(this).parent().data("jcHandler");

        var clickX = Math.floor(e.pageX - offset.left);

        var clickY = Math.floor(e.pageY - offset.top);



        var pixelPositions = jcH.positionsAtPixel({x:clickX, y:clickY}, 1, 1);



        for(var i=0; i<pixelPositions.length; i++)

        {

            if(typeof(jcH.positions[pixelPositions[i]].onClick) === "function")

            {

                if(jcH.positions[pixelPositions[i]].type === "tileMap")

                {

                    jcH.positions[pixelPositions[i]].onClick(jcH.positions[pixelPositions[i]],{x:clickX, y:clickY});

               }

                else

                {

                    jcH.positions[pixelPositions[i]].onClick(jcH.positions[pixelPositions[i]]);

                }

                break;

           }

        }



     });



     /* Name: addGradient

     * Params: gradientName, colorObject1, colorObject2

     * Description: Adds a gradient to list of gradients

     */



     this.addGradient = (function(gradientName, color1, color2) {



        var grad = {

            x1: color1.x, y1: color1.y,

            x2: color2.x, y2: color2.y,

            c1: color1.color, s1: color1.s,

            c2: color2.color, s2: color2.s

        }



        this.gradients[gradientName] = this.jcArray[0].gradient(grad);



     });



     /* Name: removeGradient

     * Params: gradientName

     * Description: Adds a gradient to list of gradients

     */



     this.removeGradient = (function(gradientName){

          delete this.gradients.gradientName;

     });





     /* Name: scrollTileMap

     * Params: tileMapName, vector {x: y:}

     * Description: scrolls a tilemap by a given amount

     */

     this.scrollTileMap = (function(positionName, vector){

        this.positions[positionName].scroll(vector);



        var _i;



        for(var i=0; i<this.z_index[z].length;i++)

        {

            if(this.z_index[this.positions[positionName].z_index][i].name === positionName)

            {

                _i = i;

                break;

            }

        }



        this.positions[positionName].clear(this.jcArray[this.positions[positionName].z_index]);

        this.positions[positionName].render(this.jcArray[this.positions[positionName].z_index]);



     });





     /* Name: applyGradient

     * Params: positionName, gradientName

     * Description: applies an active gradient to a position

     */

     this.applyGradient = (function(positionName, gradientName){

          this.positions[positionName].fillStyle = this.gradients[gradientName];

     });



      /* Name: updatePosition

     * Description: updates a position with new information

     */

     this.updatePosition = (function(positionName, newInfo)

     {

        var type = "", _z, _i;



        for(var z=this.z_index.length-1;z>=0;z--)

        {

            for(var i=0; i<this.z_index[z].length;i++)

            {

                if(this.z_index[z][i].name === positionName)

                {

                    _z = z;

                    _i = i;

                    break;

                }

            }

            if(_z)

            {

                 break;

            }

        }



        this.z_index[_z][_i].clearInfo = this.positions[positionName].clearInfo(this.jcArray[_z]);



        $.extend(true, this.positions[positionName], newInfo);





     });



     /*Name: addSpritesheet

      *Params: object {spritesheet url, array of sprite positions}

      */



     this.addSpritesheet = (function(spriteSheet, subSprites)

     {

        var imgpath = this.imagePath;

        var sheet = this.processSpritesheet(this.imagePath, spriteSheet, subSprites);

        this.spritesheets[spriteSheet.name] = sheet;

     });





    this.processSpritesheet = (function(imagePath, spritesheet, subsprites){



        $.each(subsprites, function(spriteName, subSpriteInfo)

            {

               if(typeof(spritesheet.height)!=="undefined") {

                    subSpriteInfo.height = spritesheet.height;

                    subSpriteInfo.width = spritesheet.width;

               }



               subSpriteInfo.sx = subSpriteInfo.sx || 0;

               subSpriteInfo.sy = subSpriteInfo.sy || 0;

               subSpriteInfo.sWidth = subSpriteInfo.sWidth || 50;

               subSpriteInfo.sHeight = subSpriteInfo.sHeight || 50;

               subSpriteInfo.cropFromCenter = subSpriteInfo.cropFromCenter || false;

               subSpriteInfo.height = subSpriteInfo.height || 50;

               subSpriteInfo.width = subSpriteInfo.width || 50;



               var sprite = $.extend(true, {}, {source: imagePath + spritesheet.source},subSpriteInfo);





               spritesheet[spriteName] = sprite;



            });

        return(spritesheet);

    });



      /* Name: LOOP

     * Description: A default drawing function which draws the objects on the canvas at the currently set fps

     */

     this.LOOP = (function(){

        var self = this;

        if(self.paused === false)

        {

            requestAnimationFrame(function(){

                 self.drawCanvas();

                 self.LOOP();

            });

        }

     });



     /* Name: PAUSE

     * Description: A default drawing function which draws the objects on the canvas at the currently set fps

     */

     this.PAUSE = (function(){

        if(this.paused === false)

        {

             this.paused = true;

        }

        else

        {

             this.paused = false;

             this.LOOP();

        }

     });



}





///////////////////////

//   jQuery Plugins  //

///////////////////////



     /* Name: attachjcHandler

     * Params: init (object)

     * Description: creates a new jcHandler and attaches it to a canvas.

     */

(function($) {

     $.fn.attachjcHandler = (function(init){

        init.myCanvas = $(this);



        $(this).css("z_index",0);



        var handle = new jcHandler(init);



        $(this).parent().data("jcHandler", handle);



        $(this).on({

             click: handle.checkClickMap

        });



        return(handle);

     });

})( jQuery );





/*Name: atPixel

 *Params: canvas, x, y, t

 *Description: Returns pixel information for a canvas at a specified location

 * if t is true, returns true the pixel is transparent or false if it is not

 */



(function($) {



     $.fn.atPixel = (function(x,y,w,h, t)

     {



        var c = $(this).loadCanvas();



        var img = c.getImageData(x,y,w,h);

        var data = img.data;



        //data = [r,g,b,a] at pixel



        if(t) //if checking for transparency

        {

            var counter = 0;

            for(var a = 3; a < data.length; a+=4)

            {



                if(data[a] > 0) //if alpha not transparent

                {

                    return(true);

                }

            }

            return(false);



        }



        return(data); // return pixel data



     });



})(jQuery);





(function($) {



    $.fn.copyCanvas = (function(destination, destOptions)

    {

        var c = $(this).loadCanvas();



        var img = c.getImageData(0,0, source.width(), source.height());

        var data =img.data;



        var d = destination.loadCanvas();



        destOptions.x = destOptions.x || 0;

        destOptions.y = destOptions.y || 0;





        if(!(destOptions.dx))

        {

          d.putImageData(data, destOptions.x, destOptions.y);

        }

        else

        {

          d.putImageData(data, destOptions.x, destOptions.y, destOptions.dx, destOptions.dy, destOptions.dw, destOptions.dh);

        }



    });



})(jQuery);





/* Name: cleanArray

     * Params: array

     * Description: removes undefined indexes from an array

     */

(function($) {

    $.fn.cleanArray = (function(cleanMe){



        var cleaner = new Array();

        for(var i=0;i<cleanMe.length;i++)

        {

             if(typeof(cleanMe[i]) !== "undefined")

             {

                  cleaner.push(cleanMe[i]);

             }

        }



        return(cleaner);



    });

})(jQuery);



 /* Name: randName

     * Description: Generates a random name for a canvas object

     */

(function($) {

    $.fn.randjcHName = (function(){

        var length = 8 + Math.floor(7*(Math.random() % 1));

        var val = "jcH";

        for(var i=1; i<=length; i++)

          {

              var slots = 1 + Math.floor(4*(Math.random() % 1));

              switch(slots)

              {

               case 1:

                 val += 48 + Math.floor(10*(Math.random() % 1));

                 break;

               case 2:

                 val += String.fromCharCode(65 + Math.floor(26*(Math.random() % 1)));

                 break;

               case 3:

                 val += String.fromCharCode(97 + Math.floor(26*(Math.random() % 1)));

                 break;

              }

           }

          return(val);



    });

})(jQuery);





//Name: jsonToMap

//Description: translates an array of json objects into a an array of objects

(function($) {

     $.fn.parsejArray = (function(screenMap){

        if(typeof(screenMap) === "string")

        {

             screenMap = $.parseJSON(screenMap);

        }



        for(var i=0; i<screenMap.length; i++)

        {

             if($.parseJSON(screenMap[i]) != null)

             {

                  screenMap[i] = $.parseJSON(screenMap[i])

             }

        }

        return(screenMap);



        });

})(jQuery);
