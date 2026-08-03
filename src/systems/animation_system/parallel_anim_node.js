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
            paddingDelayAnimNode: new DelayAnimNode(0)
        });
    }

    initFowardPlay()
    {
        super.initFowardPlay();

        // Prepare the initial parallel nodes
        this.nodeBranches.forEach(function(animNodeBranch) {

            animNodeBranch.headNode.initFowardPlay();
            this._currentExecutedNodes.push(animNodeBranch.headNode); // Push the initial parallel node
 
            // See if the following nodes must be in the update list too looking at the 
            // waitToEnd property

            let nextNode = animNodeBranch.headNode.nextNode;

            while(nextNode && !nextNode.waitToEnd) {
                nextNode.initFowardPlay(); // Prepare the timer and flags of the node
                this._currentExecutedNodes.push(nextNode); // Load the next node in the chain
                
                nextNode = nextNode.nextNode;
            }
        }, this);
    }

    initReversePlay()
    {
        super.initReversePlay();

        // TODO
        // ...
    }

    update(dt)
    {
        // super.update(dt); ???
        // TODO: How does the duration of this node affect to de dt passed to the executing nodes ???

        if(this._isAnimationPlaying)
        {
            for (let i = this._currentExecutedNodes.length - 1; i >= 0; i--) 
            {
                let animNode = this._currentExecutedNodes[i];

                if (animNode._hasPlayedAnimation) // Node has finished the animation
                {
                    // If it was a foward animation the timer ended with the duration value or more
                    if(animNode.currentTime >= animNode.duration) 
                    {
                        let nextNode = animNode.nextNode;

                        while(nextNode && !nextNode.waitToEnd) {
                            nextNode.initFowardPlay(); // Prepare the timer and flags of the node
                            this._currentExecutedNodes.push(nextNode); // Load the next node in the chain
                            
                            nextNode = nextNode.nextNode;
                        }
                        // TODO: 
                        /*
                        // Last node has ended (next node doesn't exist)
                        if(!animNode.nextNode) {
                            this._paddingDelayAnimNode[j].prevNode = animNode;
                            this._currentExecutedNodes.push(this._paddingDelayAnimNode[j]);
                        }*/
                    }
                    // If it was a reverse animation the timer ended with value 0 or less
                    else if(animNode.currentTime <= 0) 
                    {
                        let prevNode = animNode.prevNode;

                        while(prevNode && !prevNode.waitToEnd) {
                            prevNode.initReversePlay(); // Prepare the timer and flags of the node
                            this._currentExecutedNodes.push(prevNode); // Load the previous node in the chain
                            
                            prevNode = prevNode.prevNode;
                        }
                    }

                    this._currentExecutedNodes.splice(i, 1);   // Erase node from the update list
                }
                else // If the node is still executing 
                {
                    animNode.update(dt);
                }
            }
        }
    }
}