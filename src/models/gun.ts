// this class holds the inner workings of the single gun object
// the gun object reads the mouse postion and mouse clicks and
// will fire 1 of the 8 rays available
// if no rays available then you are out of lick and player must wait for next avalable ray
// the gun keeps a modulo 8 counter of rays and fires next ray (by calling initialize) if mouse click detected
// if the next ray is not available then does nothing and user looses fire
class clsGun
{
    // public properties
    posX = 0; // center of gun
    posY = 0; // top of gun
    imgGun;
    msecTick = 0;
    isActive = false;
    indexRay = 0; // which ray is next

    // public functions
    constructor()
    {
        this.imgGun = document.getElementById("imgGun");
        this.posY = pixGunY;
    }

    // gun does not use this function at moment
    initialize()
    {
        this.msecTick = 0;
        this.isActive = true;
        this.indexRay = 0;
    }

    update()
    {
        //this.msecTick += 1;
        this.posX = mouseX;
        oContext.drawImage(imgGun, this.posX - 12, this.posY); // image drawn from top left corner so offset 12 form center
    }

    fire()
    {
        // get next available ray object
        var oRay = arrRays[this.indexRay];
        if (oRay.isActive == true)
        {
            return; // out of lick out of rays
        }
        // this index goes from 0...7 round & round (modulo counter)
        this.indexRay += 1;
        if (this.indexRay > 7)
        {
            this.indexRay = 0;
        }
        // start ray
        oRay.initialize(); // plays ray sound and starts ray
        oRay.posX = this.posX + 2; // ray appears from gun center
    }
}
