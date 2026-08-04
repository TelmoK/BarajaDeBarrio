import { AnimNode } from "./anim_node.js";

/**
 * AnimNode that executes a Phaser tween or tweenchain
 */
export class TweenAnimNode extends AnimNode
{
    /**
     * @type {Phaser.Tweens.Tween | Phaser.Tweens.TweenChain}
     */
    tween;

    /**
     * @type {Phaser.Scene}
     */
    scene;

    constructor(scene)
    {
        super();

        this.scene = scene;
    }

    /**
     * Initialize the tween that the animation node handles
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} tweenConf 
     */
    tween(tweenConf)
    {
        tweenConf.paused = true;
        this.duration = tweenConf.duration;

        this.tween = this.scene.tweens.add(tweenConf);
    }

    /**
     * Initialize the tween that the animation node handles
     * @param {Phaser.Types.Tweens.TweenChainBuilderConfig} tweenChainConf 
     */
    chain(tweenChainConf)
    {
        tweenChainConf.paused = true;        
        this.duration = tweenChainConf.duration;

        this.tween = this.scene.tweens.chain(tweenChainConf);
    }

    update(dt)
    {
        super.update(dt);

        if(this.tween) 
        {
            let tweenProgress = this.currentTime / this.duration;
            tweenProgress = Phaser.Math.Clamp(porcentaje, 0, 1); // Ensuring the value is between 0 and 1

            // Applying the percentaje manually tween
            this.tween.setProgress(tweenProgress);
        }
    }
}