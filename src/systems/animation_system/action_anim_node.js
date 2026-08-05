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
        if(dt < 0 && this.reverseAction) {
            this.reverseAction();
        }
        else if(this.action) {
            this.action();
        }

        this._hasPlayedAnimation = true;
    }
}