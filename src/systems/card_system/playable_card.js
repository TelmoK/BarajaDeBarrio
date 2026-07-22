import { SPRITES_ASSET_KEYS } from "../../utils/asset_keys.js";

export class PlayableCard extends Phaser.GameObjects.Container
{
    /**
     * @type {Phaser.GameObjects.Image}
     */
    cardBaseImage;

    /**
     * @type {boolean}
     */
    interactive;

    /**
     * @type {boolean}
     */
    isPointerDragging;

    constructor(x, y, scene)
    {
        super(scene, x, y);

        this.interactive = true;
        this.isPointerDragging = false;

        this.cardBaseImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_CARD);
        this.cardBaseImage.setOrigin(0, 0);
        this.add(this.cardBaseImage);

        this.setInteractive({ 
            hitArea: new Phaser.Geom.Rectangle(0, 0, this.cardBaseImage.width, this.cardBaseImage.height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            draggable: true 
        });


        this.scene.input.on(Phaser.Input.Events.DRAG, function (pointer, gameObject, dragX, dragY) {
            if(!this.interactive) return;

            gameObject.x = dragX;
            gameObject.y = dragY;
            //console.log(this.getCenter());
            //console.log(new Phaser.Math.Vector2(this.x, this.y));
        }, this);

        this.scene.input.on(Phaser.Input.Events.DRAG_START, function (pointer, gameObject, dragX, dragY) {
            if(!this.interactive) return;

            this.isPointerDragging = true;
        }, this);

        this.scene.input.on(Phaser.Input.Events.DRAG_END, function (pointer, gameObject, dragX, dragY) {
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
        return new Phaser.Math.Vector2(this.x + this.cardBaseImage.width / 2, this.y + this.cardBaseImage.height / 2);
    }

    setCenterPosition(pos)
    {
        console.assert(pos instanceof Phaser.Math.Vector2, "Error: pos must be an instance of Phaser.Math.Vector2");

        this.x = pos.x - this.cardBaseImage.width / 2;
        this.y = pos.y - this.cardBaseImage.height / 2;
    }
}