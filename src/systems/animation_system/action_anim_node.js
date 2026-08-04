import { AnimNode } from "./anim_node.js";

/**
 * AnimNode that performs an instant action in the animation
 */
export class ActionAnimNode extends AnimNode
{
    /**
     * @type {function}
     */
    action;

    /**
     * @type {function}
     */
    reverseAction;

    constructor()
    {
        super();
    }

    update(dt)
    {        
        /*if(dt < 0 && this.reverseAction) {
            this.reverseAction();
        }*/
        if(this.action) {
            this.action();
        }
console.log("Action");

        this._hasPlayedAnimation = true;
        this._isAnimationPlaying = false;
    }
}