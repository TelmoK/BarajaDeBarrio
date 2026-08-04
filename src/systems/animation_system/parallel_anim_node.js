import { AnimNode } from "./anim_node.js";
import { DelayAnimNode } from "./delay_anim_node.js";

export class ParallelAnimNode extends AnimNode
{
    /**
     * @type {Array<{headNode: AnimNode, currentExecutedNodes: Array<AnimNode>, paddingDelayAnimNode: DelayAnimNode}>}
     */
    nodeBranches;

    /**
     * @type {Array<AnimNode>}
     */
    _currentExecutedNodes;

    constructor()
    {
        super();

        this.nodeBranches = new Array();
    }

    /**
     * 
     * @param {AnimNode} animNode 
     */
    addBranchNode(animNode)
    {
        this.nodeBranches.push({
            headNode: animNode,
            currentExecutedNodes: new Array(),
            paddingDelayAnimNode: new DelayAnimNode(-1),
            branchDuration: animNode.duration
        });
    }
 
    /**
     * As some branches may be shorter and end sooner, it is necessary to define a padding delay
     * at the end of the animation, which will be the begining of the reverse animation
     */
    adjustFinalDelayPadding()
    {
        let maxBranchDuration = 0;

        this.nodeBranches.forEach(function(animNodeBranch) {
            // Look for the end of the animation chain
            
            let lastBranchAnimNode = animNodeBranch.headNode;
            let totalBranchDuration = lastBranchAnimNode.duration;
            
            // If there are conditionals in the way, they must have been evaluated fowards at least one time
            // otherwise the conditional node will be setted as last one
            while(lastBranchAnimNode.nextNode) {
                lastBranchAnimNode = lastBranchAnimNode.nextNode;
                totalBranchDuration += lastBranchAnimNode.duration;
            }

            animNodeBranch.branchDuration = totalBranchDuration;

            if(totalBranchDuration > maxBranchDuration) // Keep track of the longest animation
                maxBranchDuration = totalBranchDuration;
            
            // Prepare the next node after the delay in this reverse animation
            animNodeBranch.paddingDelayAnimNode.prevNode = lastBranchAnimNode;
        }, this);

        this.nodeBranches.forEach(function(animNodeBranch) {
            // Set the padding delay time of the branch
            animNodeBranch.paddingDelayAnimNode.duration = maxBranchDuration - animNodeBranch.branchDuration;
        }, this);
    }

    initFowardPlay()
    {
        super.initFowardPlay();

        // Prepare the initial parallel nodes iterating the different branches
        this.nodeBranches.forEach(function(animNodeBranch) {

            animNodeBranch.headNode.initFowardPlay();
            animNodeBranch.currentExecutedNodes.push(animNodeBranch.headNode); // Push the initial parallel node
 
            // See if the following nodes must be in the update list too looking at the 
            // waitToEnd property

            let nextNode = animNodeBranch.headNode.nextNode;

            while(nextNode && !nextNode.waitToEnd) {
                nextNode.initFowardPlay(); // Prepare the timer and flags of the node
                animNodeBranch.currentExecutedNodes.push(nextNode); // Load the next node in the branch chain
                
                nextNode = nextNode.nextNode;
            }
        }, this);
    }

    initReversePlay()
    {
        super.initReversePlay();

        this.adjustFinalDelayPadding();
        
        this.nodeBranches.forEach(function(animNodeBranch) {
            animNodeBranch.paddingDelayAnimNode.initReversePlay(); // Prepare the reverse mode of the delay timer

            // Start the animation with the final delay if there is one
            animNodeBranch.currentExecutedNodes.push(animNodeBranch.paddingDelayAnimNode);
        }, this);
    }

    update(dt)
    {
        let speedRelativeDt = dt;

        if(this.duration >= 0) {
            super.update(dt);
            
            if(this.duration > 0)
                speedRelativeDt = dt * this.maxBranchDuration / this.duration;
        }

        if(this._isAnimationPlaying)
        {
            this.nodeBranches.forEach( function(nodeBranch) { // Iterating the parallel animation branches

                // Iterate the animation nodes that are currently executing
                for (let i = nodeBranch.currentExecutedNodes.length - 1; i >= 0; i--) 
                {
                    let animNode = nodeBranch.currentExecutedNodes[i];

                    if (animNode._hasPlayedAnimation) // Node has finished the animation
                    {
                        // If it was a foward animation the timer ended with the duration value or more
                        if(animNode.currentTime >= animNode.duration) 
                        {
                            let nextNode = animNode.nextNode;

                            while(nextNode && !nextNode.waitToEnd) {
                                nextNode.initFowardPlay(); // Prepare the timer and flags of the node
                                nodeBranch.currentExecutedNodes.push(nextNode); // Load the next node in the chain
                                
                                nextNode = nextNode.nextNode;
                            }
                            
                            // Last node has ended (next node doesn't exist)
                            if(!animNode.nextNode) {
                                // If there has been a new condition branching we recalculate the padding
                                if(nodeBranch.paddingDelayAnimNode.prevNode != animNode)
                                    this.adjustFinalDelayPadding();
                                
                                // We play the delay animation just in case the animation is reversed during the wait
                                nodeBranch.currentExecutedNodes.push(nodeBranch.paddingDelayAnimNode);

                            }
                        }
                        // If it was a reverse animation the timer ended with value 0 or less
                        else if(animNode.currentTime <= 0) 
                        {
                            let prevNode = animNode.prevNode;

                            while(prevNode && !prevNode.waitToEnd) {
                                prevNode.initReversePlay(); // Prepare the timer and flags of the node
                                nodeBranch.currentExecutedNodes.push(prevNode); // Load the previous node in the chain
                                
                                prevNode = prevNode.prevNode;
                            }
                        }

                        nodeBranch.currentExecutedNodes.splice(i, 1);   // Erase node from the update list
                    }
                    else // If the node is still executing 
                    {
                        animNode.update(speedRelativeDt);
                    }
                }
            }, this);
        }
    }
}