import { AnimNode } from "./anim_node.js";

/**
 * AnimNode that sets the next AnimNode depending on the evaluation of a chain of conditions, 
 * the conditions only influence the path of a foward animation. A `NodeAnimation` played in
 * **reverse might have unexpected behaviour if it contains this type of node**, in that case
 * make sure that the animation has being played fowards at least one time to reverse it.
 */
export class ConditionalAnimNode extends AnimNode
{
    /**
     * @type {Array<{animNode: AnimNode, conditionEvaluation: function}>}
     */
    conditinalBranches;

    constructor()
    {
        super();

        this.conditinalBranches = new Array();
    }

    pushConditonalBranch(animNode, conditionEvaluation)
    {
        console.assert(animNode instanceof AnimNode, "Error: animNode must be an instance of AnimNode");
        console.assert(typeof conditionEvaluation === "function", "Error: conditionEvaluation must be a function");
        let ev = conditionEvaluation();
        console.assert(typeof ev === "boolean", "Error: conditionEvaluation must be a boolean function");

        this.conditinalBranches.push({ animNode: animNode, conditionEvaluation: conditionEvaluation });
    }

    update(dt)
    {
        let i = 0;
        while(i < this.conditinalBranches.length && !this.conditinalBranches[i].conditionEvaluation()) {
            i++;
        }

        if(i < this.conditinalBranches.length)
            this.nextNode = this.conditinalBranches[i].animNode;
        else
            this.nextNode = null;

        this._hasPlayedAnimation = true;
    }
}