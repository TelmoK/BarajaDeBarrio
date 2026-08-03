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

    constructor()
    {
        super();
    }

    /**
     * 
     * @param {function} action 
     */
    setAction(action)
    {
        this.action = action;
    }

    update(dt)
    {
        if(this.action) {
            this.action();
            this._hasPlayedAnimation = true;
            this._isAnimationPlaying = false;
        }
    }
}