import { AnimNode } from "./anim_node.js";

/**
 * AnimNode that just occupies an especified time acting as a delay in the animation chain
 */
export class DelayAnimNode extends AnimNode
{
    constructor(delay)
    {
        super();

        this.duration = delay;
    }
}