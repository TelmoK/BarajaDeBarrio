export class AnimNode
{
    /**
     * @type {AnimNode}
     */
    nextNode;

    /**
     * The previous node in the animation chain
     * @type {AnimNode}
     */
    prevNode;
    
    /**
     * @type {number}
     */
    duration;

    /**
     * @type {number}
     */
    currentTime;

    /**
     * Whether it is necessary to end the animation to execute the next one or not
     * @type {boolean}
     */
    waitToEnd;
    
    /**
     * Whether the animation has being reproduced by the NodeAnimation or not in the current sense of the animation 
     * (foward or backwards)
     * @type {boolean}
     */
    _hasPlayedAnimation;

    constructor()
    {
        this.nextNode = null;
        this.prevNode = null;
        this.duration = 0;
        this.currentTime = 0;
        this.waitToEnd = true;

        this._hasPlayedAnimation = false;
    }

    /**
     * Prepare the node to perform a foward animation
     */
    initFowardPlay()
    {
        this._hasPlayedAnimation = false;
        this.currentTime = 0;
    }

    /**
     * Prepare the node to perform an animation in reverse, it is meant to recieve a negative dt in the `update()` 
     * method for this purpose
     */
    initReversePlay()
    {
        this._hasPlayedAnimation = false;
        this.currentTime = this.duration;

        if(this.prevNode)
            this.prevNode.initReversePlay();
    }

    update(dt)
    {
        if(this.duration === 0) {
            this._hasPlayedAnimation = true;
            return;
        }

        this.currentTime += dt;
        
        // Animations can end if the duration is passed (foward animation) or if the current time
        // is negative (reverse animation)
        if(this.currentTime <= 0 && dt < 0 || this.currentTime >= this.duration && dt >= 0) {
            this._hasPlayedAnimation = true;
        }
        
    }
}