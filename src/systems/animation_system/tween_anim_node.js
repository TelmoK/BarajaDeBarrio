import { AnimNode } from "./anim_node.js";

/**
 * AnimNode that executes a Phaser tween or tweenchain
 */
export class TweenAnimNode extends AnimNode
{
    /**
     * @type {Phaser.Tweens.Tween | Phaser.Tweens.TweenChain}
     */
    tweenRef;

    /**
     * @type {Phaser.Scene}
     */
    scene;

    constructor(scene)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be an instance of Phaser.Scene");

        super();

        this.scene = scene;
    }

    initReversePlay()
    {
        super.initReversePlay();

        // Set the tween at the end
        if(this.tweenRef)
            this.tweenRef.seek(this.duration * 1000); // Phaser works with milliseconds
    }

    /**
     * Initialize the tween that the animation node handles
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} tweenConf 
     */
    tween(tweenConf)
    {
        tweenConf.paused = true;
        this.duration = tweenConf.duration / 1000; // Phaser works with milliseconds

        this.tweenRef = this.scene.tweens.add(tweenConf);
    }

    /**
     * Initialize the tween that the animation node handles
     * @param {Phaser.Types.Tweens.TweenChainBuilderConfig} tweenChainConf 
     */
    chain(tweenChainConf)
    {
        tweenChainConf.paused = true;        
        this.duration = tweenChainConf.duration / 1000; // Phaser works with milliseconds

        this.tweenRef = this.scene.tweens.chain(tweenChainConf);
    }

    update(dt)
    {
        super.update(dt);

        if(this.tweenRef) 
        {
            // Applying the timepoint of the tween (in milliseconds)
            this.tweenRef.seek(this.currentTime * 1000);
        }
    }
}