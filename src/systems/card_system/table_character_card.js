import { SPRITES_ASSET_KEYS } from "../../utils/asset_keys.js";
import { Card } from "./card.js";

export class TableCharacterCard extends Card
{
    /**
     * @type {Phaser.GameObjects.Image}
     */
    cardBaseImage;

    /**
     * @inherited
     * @type {{cardType: string, name: string, manaCost: string, imgScrKey: string, description: string, hp: number, attack: number}}
     */
    // cardInfo;

    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.cardBaseImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_CHARACTER_CARD);
        this.add(this.cardBaseImage);

        this.setScale(0.7, 0.7);

        // To use the width and height properties
        this.setSize(this.getBounds().width, this.getBounds().height);
    }
}