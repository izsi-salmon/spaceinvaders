// this class holds the innerworkings of 1 ray object
// there can be more than 1 ray objects dependent on how many the gun fires
// ray objects manage the drawing and sound of the ray
// ray objects also check for a hit on a bug
class clsRay
{
    // public properties
    posX = 0;
    posY = 0;
    audFire; // note each ray owns 1 seperate html audio element to support polyphony
    msecTick = 0;
    isActive = false;
    //hasHit = false;
    posHit = 0;

    // public functions
    constructor(index)
    {
        var id = "audFire" + String(index); // each ray has its own seperate sound
        this.audFire = document.getElementById(id);
    }

    // this is called by gun fire to start the ray
    initialize()
    {
        this.msecTick = 0;
        this.isActive = true;
        //this.hasHit = false;
        this.posHitY = 0;
        this.audFire.play();
    }

    update()
    {
        var posEnd;
        var posStart;
        var index;
        var isHit;
        var oBug;
        if (this.isActive == false) return;
        this.msecTick += 1; // 1 pixel per 50 ms
        // draw a line along y axis from x postition speed is hard wired at moment
        posEnd = pixGunY - (this.msecTick * 36); // ray moves 36 pixels per frame up towards top (0 pix pos)
        if (posEnd < 0)
        {
            // we are at top so bail out and free the ray for another fire
            this.isActive = false;
            return;
        }
        // this makes ray max of 288 pixels long
        posStart = posEnd + 288; //
        // We check all 8 bugs to see if my posX is same as oBug.posX (within 6 pix either side)
        if (this.posHit == 0)
        {
            index = 0;
            while (index < 8)
            {
                oBug = arrBugs[index];
                isHit = oBug.checkHit(this.posX, posEnd);
                if (isHit == true)
                {
                    this.posHitY = oBug.posY;
                    break; // in theory a single ray can only hit one bug so our work is done so bail out of loop
                }
                ++index;
            }
        }
        // if hit ray must end at bug PosY
        if (this.posHitY > 0)
        {
            posEnd = this.posHitY;
        }
        // draw ray
        if (posStart > pixGunY) posStart = pixGunY;
        if (posStart <= posEnd)
        {
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
