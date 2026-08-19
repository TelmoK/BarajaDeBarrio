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

    /**
     * Returns a Vector2 with the position of the center of the card, as its orogin is in the top 
     * left corner
     * @returns {Phaser.Math.Vector2}
     */
    getCenterPosition()
    {
        console.assert(false, "abstract method 'getCenterPosition' must be implemented");
    }

    /**
     *
     * @param {Phase.Math.Vector2} pos
     */
    setCenterPosition(pos)
    {
        console.assert(false, "abstract method 'setCenterPosition' must be implemented");
    }

    widthInContainer()
    {
        console.assert(false, "abstract method 'widthInContainer' must be implemented");
        return 0;
    }
}