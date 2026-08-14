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
        this.add(this.cardBaseImage);

        this.cardCountImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_CARD_COUNT_CIRCLE);
        this.cardCountImage.x = this.cardBaseImage.width/2;
        this.cardCountImage.y = -this.cardBaseImage.height/2;
        this.add(this.cardCountImage);

        this.cardCountText = scene.add.text(this.cardCountImage.x - 8, -15, "2", { 
            fontFamily: "Nokia", 
            color: '#000000',
            fontSize: 32 
        });
        this.add(this.cardCountText);

        this.setScale(0.5, 0.5);

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