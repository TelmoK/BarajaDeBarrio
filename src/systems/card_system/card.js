export class Card extends Phaser.GameObjects.Container
{
    /**
     * @type {boolean}
     */
    interactive;

    /**
     * @type {{cardType: string, name: string, manaCost: string, imgScrKey: string, description: string, hp: number, attack: number} | {cardType: string, name: string, manaTypeName: string, imgScrKey: string}}
     */
    cardInfo;

    constructor(scene, x, y)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be a Phaser.Scene");
        console.assert(typeof x === "number", "Error: x must be a number");
        console.assert(typeof y === "number", "Error: y must be a number");
        
        super(scene, x, y);

        this.interactive = true;
    }
}