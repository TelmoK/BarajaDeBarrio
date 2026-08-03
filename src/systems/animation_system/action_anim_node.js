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
        // As this animation node has instantaneous effect there is no need to check this._isAnimationPlaying
        
        if(this.action) {
            this.action();
        }

        this._hasPlayedAnimation = true;
        this._isAnimationPlaying = false;
    }
}