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
     * Whether the animation is being currently reproduced by the NodeAnimation or not
     * @type {boolean}
     */
    _isAnimationPlaying;
    
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

        this._isAnimationPlaying = false;
        this._hasPlayedAnimation = false;
    }

    /**
     * Prepare the node to perform a foward animation
     */
    startPlay()
    {
        this._isAnimationPlaying = true;
        this._hasPlayedAnimation = false;
        this.currentTime = 0;
    }

    /**
     * Prepare the node to perform an animation in reverse, it is meant to recieve a negative dt in the `update()` 
     * method for this purpose
     */
    startReversePlay()
    {
        this._isAnimationPlaying = true;
        this._hasPlayedAnimation = false;
        this.currentTime = this.duration;
    }

    update(dt)
    {
        if(this._isAnimationPlaying) 
        {
            this.currentTime += dt;
            
            if(this.currentTime < 0 || this.currentTime > this.duration) {
                this._hasPlayedAnimation = true;
                this._isAnimationPlaying = false;
            }
        }
    }
}