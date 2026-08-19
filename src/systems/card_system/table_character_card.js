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

     /**
     * Returns a Vector2 with the position of the center of the card, as its orogin is in the top 
     * left corner
     * @override
     * @returns {Phaser.Math.Vector2}
     */
    getCenterPosition()
    {
        return new Phaser.Math.Vector2(this.x, this.y);
    }

    /**
     *@override
     * @param {Phase.Math.Vector2} pos
     */
    setCenterPosition(pos)
    {
        console.assert(pos instanceof Phaser.Math.Vector2, "Error: pos must be an instance of Phaser.Math.Vector2");

        this.x = pos.x;
        this.y = pos.y;
    }

    widthInContainer()
    {
        //return this.width;
        return this.getBounds().width;
    }
}