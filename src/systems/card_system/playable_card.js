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

    constructor(x, y, scene)
    {
        super(scene, x, y);

        this.interactive = true;

        this.cardBaseImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_CARD);
        this.cardBaseImage.setOrigin(0, 0);
        this.add(this.cardBaseImage);

        this.setInteractive({ 
            hitArea: new Phaser.Geom.Rectangle(0, 0, this.cardBaseImage.width, this.cardBaseImage.height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            draggable: true 
        });


        this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if(!this.interactive) return;

            gameObject.x = dragX;
            gameObject.y = dragY;
            console.log(this.getCenter());
            console.log(Phaser.Math.Vector2(this.x, this.y));
        }, this);
    }

    /**
     * Returns a Vector2 with the position of the center of the card, as its orogin is in the top left corner
     * @returns Vector2
     */
    getCenter()
    {
        return new Phaser.Math.Vector2(this.x - this.cardBaseImage.width / 2, this.y - this.cardBaseImage.height / 2);
    }
}