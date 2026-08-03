import { AnimNode } from "./anim_node.js";

/**
 * AnimNode that sets the next AnimNode depending on the evaluation of a chain of conditions, 
 * the conditions only influence the path of a foward animation 
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
        let switchCond = false;
        let i = 0;

        while(i < this.conditinalBranches.length && !switchCond) {
            switchCond = this.conditinalBranches[i].conditionEvaluation();
            i++;
        }

        if(switchCond)
            this.nextNode = this.conditinalBranches[i].animNode;
        else
            this.nextNode = null;
    }
}