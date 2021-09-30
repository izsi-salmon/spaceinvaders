"use strict";
/*
Notes
o The code is in a single html file with script in the head and all html elements in the body.
The body onload event, docLoad(), is used to get global references to the html elements after
the page loads.
o Game objects like the bugs and the gun are defined as objects using the new Javascript 'class' keyword.
These objects have their own code to 'self manage' their own behaviour. They draw their own pictures,
make their own sounds and move themselves.
o Global variables are used to keep html objects, game objects and game variables. They can be seen by
all code.
o When multiple game objects are needed, like bugs and rays, they are kept in simple Javascript arrays.
o The code uses the standard window.requestAnimationFrame() function to draw the game. This function
is used to run the game at 25 frames per second.
o The code uses the standard html canvas element and its '2D' context library to draw the game. As per standards,
the game is completely re-drawn from scratch every frame.
o Each game object has an update() function that is called every frame. In this function the object will draw
itself in its current position.
o Most objects have a simple png32 (transparency support) image that is drawn on the canvas using the library drawImage()
function. However Ray objects use the library line drawing functions.
*/
// ------------------------------------------
// Class Definitions
// ------------------------------------------
// Reusable Classes are new to JavaScript 6 (2015)
// previously you had to fudge these using a function definition & tricks
// we need Reusable Classes because we have multiple bug objects
// note there is no support for private vaiables & functions yet
// this class holds the innerworkings of 1 bug object
class clsBug {
    // called when you create a new bug
    constructor() {
        // public properties
        this.posX = 0; // center of bug
        this.posY = 0; // center of bug
        this.msecTick = 0;
        this.isActive = false;
        this.cntHit = 0;
        this.imgBug = document.getElementById("imgBug");
        this.imgBugX1 = document.getElementById("imgBugX1");
        this.imgBugX2 = document.getElementById("imgBugX2");
        this.audBugEnd = document.getElementById("audBugEnd");
    }
    // called to start bug
    initialize() {
        this.msecTick = 0;
        this.isActive = true;
        this.cntHit = 0;
    }
    // called every frame to update position of bug and draw the bug
    update() {
        if (this.isActive == false)
            return;
        if (this.cntHit == 1) {
            oContext.drawImage(this.imgBugX1, this.posX - 12, this.posY - 12);
            this.cntHit = 2;
            return;
        }
        if (this.cntHit == 2) {
            oContext.drawImage(this.imgBugX2, this.posX - 12, this.posY - 12);
            this.cntHit = 3;
            return;
        }
        if (this.cntHit == 3) {
            this.isActive = false;
            return;
        }
        this.msecTick += 1;
        this.posY = this.msecTick; // currently 1 pixel per frame
        if (this.posY > (pixGunY - 12)) // 12 is 1/2 bug height
         {
            // bug wins
            stopGame();
            this.isActive = false;
            return;
        }
        oContext.drawImage(this.imgBug, this.posX - 12, this.posY - 12);
    }
    // called by ray objects to check if bug is hit
    // hit bugs make a sound then disable and disappear
    checkHit(posX, posY) {
        if (this.isActive == false)
            return false;
        if (this.cntHit != 0)
            return false;
        // hit area is currently 6 pixels either side of centre
        if (posX < (this.posX - 6))
            return false;
        if (posX > (this.posX + 6))
            return false;
        // the ray only kills if ray end is on or above bug
        if (posY > this.posY)
            return false; // remember posY is top down and center of bug
        // help i'm hit
        this.audBugEnd.play();
        this.cntHit = 1;
        return true;
    }
}
// this class holds the innerworkings of 1 ray object
// there can be more than 1 ray objects dependent on how many the gun fires
// ray objects manage the drawing and sound of the ray
// ray objects also check for a hit on a bug
class clsRay {
    // public functions
    constructor(index) {
        // public properties
        this.posX = 0;
        this.posY = 0;
        this.msecTick = 0;
        this.isActive = false;
        //hasHit = false;
        this.posHit = 0;
        var id = "audFire" + String(index); // each ray has its own seperate sound
        this.audFire = document.getElementById(id);
    }
    // this is called by gun fire to start the ray
    initialize() {
        this.msecTick = 0;
        this.isActive = true;
        //this.hasHit = false;
        this.posHitY = 0;
        this.audFire.play();
    }
    update() {
        var posEnd;
        var posStart;
        var index;
        var isHit;
        var oBug;
        if (this.isActive == false)
            return;
        this.msecTick += 1; // 1 pixel per 50 ms
        // draw a line along y axis from x postition speed is hard wired at moment
        posEnd = pixGunY - (this.msecTick * 36); // ray moves 36 pixels per frame up towards top (0 pix pos)
        if (posEnd < 0) {
            // we are at top so bail out and free the ray for another fire
            this.isActive = false;
            return;
        }
        // this makes ray max of 288 pixels long
        posStart = posEnd + 288; //
        // We check all 8 bugs to see if my posX is same as oBug.posX (within 6 pix either side)
        if (this.posHit == 0) {
            index = 0;
            while (index < 8) {
                oBug = arrBugs[index];
                isHit = oBug.checkHit(this.posX, posEnd);
                if (isHit == true) {
                    this.posHitY = oBug.posY;
                    break; // in theory a single ray can only hit one bug so our work is done so bail out of loop
                }
                ++index;
            }
        }
        // if hit ray must end at bug PosY
        if (this.posHitY > 0) {
            posEnd = this.posHitY;
        }
        // draw ray
        if (posStart > pixGunY)
            posStart = pixGunY;
        if (posStart <= posEnd) {
            // we are near top so bail out and free the ray for another fire
            this.isActive = false;
            return;
        }
        //draw the ray using context 2d library lines
        oContext.beginPath();
        oContext.moveTo(this.posX, posStart); // start at top of gun
        oContext.lineTo(this.posX, posEnd);
        oContext.stroke();
    }
}
// this class holds the inner workings of the single gun object
// the gun object reads the mouse postion and mouse clicks and
// will fire 1 of the 8 rays available
// if no rays available then you are out of lick and player must wait for next avalable ray
// the gun keeps a modulo 8 counter of rays and fires next ray (by calling initialize) if mouse click detected
// if the next ray is not available then does nothing and user looses fire
class clsGun {
    // public functions
    constructor() {
        // public properties
        this.posX = 0; // center of gun
        this.posY = 0; // top of gun
        this.msecTick = 0;
        this.isActive = false;
        this.indexRay = 0; // which ray is next
        this.imgGun = document.getElementById("imgGun");
        this.posY = pixGunY;
    }
    // gun does not use this function at moment
    initialize() {
        this.msecTick = 0;
        this.isActive = true;
        this.indexRay = 0;
    }
    update() {
        //this.msecTick += 1;
        this.posX = mouseX;
        oContext.drawImage(imgGun, this.posX - 12, this.posY); // image drawn from top left corner so offset 12 form center
    }
    fire() {
        // get next available ray object
        var oRay = arrRays[this.indexRay];
        if (oRay.isActive == true) {
            return; // out of lick out of rays
        }
        // this index goes from 0...7 round & round (modulo counter)
        this.indexRay += 1;
        if (this.indexRay > 7) {
            this.indexRay = 0;
        }
        // start ray
        oRay.initialize(); // plays ray sound and starts ray
        oRay.posX = this.posX + 2; // ray appears from gun center
    }
}
// ------------------------------------------
// Dom html objects
// ------------------------------------------
var imgStars;
var imgGameOV;
var oCanvas;
var oContext;
var txtScore;
// ------------------------------------------
// game objects
// ------------------------------------------
// this array will hold 8 bug objects
var arrBugs = new Array(8);
// this array will hold 8 ray objects
var arrRays = new Array(8);
// holds the single gun object
var oGun;
// ------------------------------------------
// game variables
// ------------------------------------------
var mouseX = 0;
var mouseY = 0;
var runGame = false;
var msecLastTime = 0;
var pixGunY = 492; // gun moves left and right at this pixel position from top
var pixGameH = 540;
var score = 0;
// ------------------------------------------
// Dom Events
// ------------------------------------------
// body.onload() is called after all the html has been loaded
// so use it set up all our game objects
function docLoad() {
    var index;
    // initalise global objects
    oCanvas = document.getElementById("myCanvas");
    oContext = oCanvas.getContext("2d");
    imgStars = document.getElementById("imgStars");
    imgGameOV = document.getElementById("imgGameOV");
    txtScore = document.getElementById("txtScore");
    // create Gun
    oGun = new clsGun();
    // create 8 bugs
    index = 0;
    while (index < 8) {
        arrBugs[index] = new clsBug();
        ++index;
    }
    // create 8 rays
    index = 0;
    while (index < 8) {
        arrRays[index] = new clsRay(index);
        ++index;
    }
    // rays use lines so default them red 1px wide
    oContext.lineWidth = 1;
    oContext.strokeStyle = '#ff0000';
}
// Gun needs this
function canvasMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}
// Gun needs this
function canvasClick() {
    oGun.fire();
}
// ------------------------------------------
// button click events
// ------------------------------------------
// kicks off the game
function startGame() {
    oCanvas.style.cursor = "none";
    msecLastTime = 0;
    //msecTick = 0;
    score = 500;
    runGame = true;
    var index = 0;
    // start the bugs !
    while (index < 8) {
        arrBugs[index].initialize();
        arrBugs[index].posX = 62 + (index * 100);
        ++index;
    }
    // kick off animation
    window.requestAnimationFrame(drawGame); // tells DOM to call my drawGame() function to kick off animation
}
function stopGame() {
    runGame = false;
    oCanvas.style.cursor = "default";
    score = 0;
    txtScore.value = String(score);
    //oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
    oContext.drawImage(imgGameOV, 0, 0); // game over buddy
}
// ------------------------------------------
// animation update
// ------------------------------------------
//
// this function gets called by browser about to 60 times per second
// we use it to completely redraw the entire game
function drawGame(msecNow) {
    var index;
    var oBug;
    var oRay;
    var countBugs;
    if (runGame == false) {
        return; // returning here abandons the next frame update
    }
    var msecElapsed = msecNow - msecLastTime; // milliseconds are used
    if (msecElapsed < 40) // 1000/40 = 25 frames per second game
     {
        // do nothing this time as too quick
        window.requestAnimationFrame(drawGame); // calling myself creates endless frame updates at about 60fps
        return;
    }
    msecLastTime = msecNow; // keep msecNow for next time
    // all of game gets rendered from scratch every 40ms
    oContext.drawImage(imgStars, 0, 0); // background first
    oGun.update(); // draws gun in the right spot
    // draw bugs
    countBugs = 0;
    index = 0;
    while (index < 8) {
        oBug = arrBugs[index];
        oBug.update(); // draws a bug if it is active
        if (oBug.isActive == true)
            countBugs += 1;
        ++index;
    }
    // still have bugs
    if (countBugs > 0) {
        score -= 1;
        txtScore.value = String(score);
    }
    // update rays
    index = 0;
    while (index < 8) {
        oRay = arrRays[index]; // get next ray
        oRay.update(); // draws rays if active also checke for a hit on bug
        ++index;
    }
    // request next frame
    window.requestAnimationFrame(drawGame); // calling myself creates endless frame updates at 60fps
}
