import { AnimNode } from "./anim_node.js";
import { ParallelAnimNode } from "./parallel_anim_node.js";

export class NodeAnimation
{
    /**
     * The animation node with which the animation chain is handled
     * @type {ParallelAnimNode}
     */
    mainAnimNode;

    /**
     * @type {boolean}
     */
    paused;

    _lastAnimNode;

    constructor()
    {
        this.mainAnimNode = new ParallelAnimNode();
        this.mainAnimNode.addBranchNode(new AnimNode());

        this.paused = false;

        this._lastAnimNode = null;
    }

    play()
    {
        if(this.paused) {
            this.resume();
            return;
        }
        
        this.restart();
    }

    playReverse()
    {
        if(this.paused) {
            this.resume();
            return;
        }
        
        this.restartReverse();
    }

    pause()
    {
        this.paused = true;
    }

    resume()
    {
        this.paused = false;
    }

    restart()
    {
        this.paused = false;
        this.mainAnimNode.setNaturalDuration();
        this.mainAnimNode.initFowardPlay();
    }

    restartReverse()
    {
        this.paused = false;
        this.mainAnimNode.setNaturalDuration();
        this.mainAnimNode.initReversePlay();
    }

    /**
     * Inserts the `animNode` animation node before de `listedNode`
     * @param {AnimNode} animNode 
     * @param {AnimNode} listedNode 
     */
    insertAnimNode(animNode, listedNode)
    {
        console.assert(animNode instanceof AnimNode, "Error: animNode must be an instance of AnimNode");
        console.assert(listedNode instanceof AnimNode, "Error: listedNode must be an instance of AnimNode");

        animNode.nextNode = listedNode;
        animNode.prevNode = listedNode.prevNode;

        listedNode.prevNode = animNode;

        // If the node was inserted in the first position we must update the animation branch first node
        if(listedNode === this.mainAnimNode.nodeBranches[0].headNode)
            this.mainAnimNode.nodeBranches[0].headNode = animNode;
    }

    /**
     * Inserts the `animNode` animation node at the end of the animation chain
     * @param {AnimNode} animNode 
     */
    pushBackAnimNode(animNode)
    {
        console.assert(animNode instanceof AnimNode, "Error: animNode must be an instance of AnimNode");

        if(this._lastAnimNode) {
            this._lastAnimNode.nextNode = animNode;
        }
        else {
            this.mainAnimNode.nodeBranches[0].headNode = animNode;
        }

        animNode.nextNode = null;
        animNode.prevNode = this._lastAnimNode;
        
        this._lastAnimNode = animNode;
    }

    /**
     * Inserts the `animNode` animation node at the begining of the animation chain
     * @param {AnimNode} animNode 
     */
    pushFrontAnimNode(animNode)
    {
        console.assert(animNode instanceof AnimNode, "Error: animNode must be an instance of AnimNode");

        if(!this._lastAnimNode)
            this._lastAnimNode = animNode;

        let firstNode = this.mainAnimNode.nodeBranches[0].headNode;

        animNode.nextNode = firstNode;
        animNode.prevNode = null;

        firstNode.prevNode = animNode;

        this.mainAnimNode.nodeBranches[0].headNode = animNode;
    }

    update(dt)
    {
        if(!this.paused) {
            this.mainAnimNode.update(dt);
        }
    }
}