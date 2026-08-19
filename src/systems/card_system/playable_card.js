import { SPRITES_ASSET_KEYS } from "../../utils/asset_keys.js";
import { Card } from "./card.js";

export class PlayableCard extends Card
{
    /**
     * @type {Phaser.GameObjects.Image}
     */
    cardBaseImage;

    /**
     * @type {boolean}
     */
    isPointerDragging;

    constructor(scene, x, y)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be a Phaser.Scene");
        console.assert(typeof x === "number", "Error: x must be a number");
        console.assert(typeof y === "number", "Error: y must be a number");
        
        super(scene, x, y);

        this.isPointerDragging = false;

        this.cardBaseImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_CARD);
        this.add(this.cardBaseImage);

        this.setInteractive({ 
            hitArea: new Phaser.Geom.Rectangle(-this.cardBaseImage.width/2, -this.cardBaseImage.height/2, this.cardBaseImage.width, this.cardBaseImage.height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            draggable: true
        });

        this.setScale(0.7, 0.7);

        this.on(Phaser.Input.Events.DRAG, function (pointer, dragX, dragY) {
            if(!this.interactive) return;
            
            this.isPointerDragging = true;
            this.x = dragX;
            this.y = dragY;
        }, this);

        this.on(Phaser.Input.Events.DRAG_START, function () {
            if(!this.interactive) return;

            this.isPointerDragging = true;
        }, this);

        this.on(Phaser.Input.Events.DRAG_END, function () {
            if(!this.interactive) return;

            this.isPointerDragging = false;
        }, this);
    }

    /**
     * Returns a Vector2 with the position of the center of the card, as its orogin is in the top 
     * left corner
     * @returns {Phaser.Math.Vector2}
     */
    getCenterPosition()
    {
        return new Phaser.Math.Vector2(this.x, this.y);
    }

    /**
     *
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
        return this.cardBaseImage.width * this.scaleX;
    }
}