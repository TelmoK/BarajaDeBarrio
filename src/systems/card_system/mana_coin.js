import { SPRITES_ASSET_KEYS } from "../../utils/asset_keys.js";
import { Card } from "./card.js";

export class ManaCoin extends Phaser.GameObjects.Container
{
    /**
     * @type {Phaser.GameObjects.Image}
     */
    coinImage;

    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.coinImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_CARD_COUNT_CIRCLE);
        this.add(this.coinImage);

        //this.setScale(1, 1);

        // To use the width and height properties
        this.setSize(this.getBounds().width, this.getBounds().height);
    }
}