import { SPRITES_ASSET_KEYS } from "../../utils/asset_keys.js";
import { Card } from "./card.js";

export class TableManaCard extends Card
{
    /**
     * @type {Phaser.GameObjects.Image}
     */
    cardBaseImage;

    /**
     * @type {Phaser.GameObjects.Image}
     */
    cardCountImage;

    /**
     * @type {Phaser.GameObjects.Text}
     */
    cardCountText;

    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.cardBaseImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_MANA_CARD);
        this.cardBaseImage.setOrigin(0, 0);
        this.add(this.cardBaseImage);

        this.cardCountImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_CARD_COUNT_CIRCLE);
        this.cardCountImage.x = this.cardBaseImage.width;
        this.add(this.cardCountImage);

        this.cardCountText = scene.add.text(this.cardCountImage.x - 8, -15, "2", { 
            fontFamily: "Nokia", 
            color: '#000000',
            fontSize: 32 
        });
        this.add(this.cardCountText);

        this.setScale(0.6, 0.6);
    }
}