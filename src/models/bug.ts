class clsBug
{
    // public properties
    posX = 0; // center of bug
    posY = 0; // center of bug
    imgBug; // image for this bug
    imgBugX1 // dead bug 0
    imgBugX2 // dead bug 0
    audBugEnd; // sound for this bug end
    msecTick = 0;
    isActive = false;
    cntHit = 0;


    // called when you create a new bug
    constructor()
    {
        this.imgBug = document.getElementById("imgBug");
        this.imgBugX1 = document.getElementById("imgBugX1");
        this.imgBugX2 = document.getElementById("imgBugX2");
        this.audBugEnd = document.getElementById("audBugEnd");
    }

    // called to start bug
    initialize()
    {
        this.msecTick = 0;
        this.isActive = true;
        this.cntHit = 0;
    }

    // called every frame to update position of bug and draw the bug
    update()
    {
        if (this.isActive == false) return;
        if (this.cntHit == 1)
        {
            oContext.drawImage(this.imgBugX1, this.posX - 12, this.posY - 12);
            this.cntHit = 2;
            return;
        }
        if (this.cntHit == 2)
        {
            oContext.drawImage(this.imgBugX2, this.posX - 12, this.posY - 12);
            this.cntHit = 3;
            return;
        }
        if (this.cntHit == 3)
        {
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
    checkHit(posX, posY)
    {
        if (this.isActive == false) return false;
        if (this.cntHit != 0) return false;
        // hit area is currently 6 pixels either side of centre
        if (posX < (this.posX - 6)) return false;
        if (posX > (this.posX + 6)) return false;
        // the ray only kills if ray end is on or above bug
        if (posY > this.posY) return false; // remember posY is top down and center of bug
        // help i'm hit
        this.audBugEnd.play();
        this.cntHit = 1;
        return true;
    }
}
