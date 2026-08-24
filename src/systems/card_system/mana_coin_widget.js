import { ManaCoin } from "./mana_coin.js";
import { TableElementArea } from "./table_element_area.js";

export class ManaCoinWidget extends Phaser.GameObjects.Container
{
    /**
     * The maximum number of maná coins that the player can have in a game
     * @type {number}
     */
    maxCoins;

    /**
     * The maximum number of coins at the current point of the game
     * @type {number}
     */
    currentMaxCoins;

    /**
     * The current number of coins that the player has
     * @type {number}
     */
    coinCount;

    /**
     * The text that shows the current number of coins that the player has and the maximum in the surrent time
     * @type {Phaser.GameObjects.Text}
     */
    coinCountLabel;

    /**
     * @type {TableElementArea}
     */
    coinArea;

    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.maxCoins = 10;
        this.currentMaxCoins = 10;
        this.coinCount = 0;

        this.coinCountLabel = scene.add.text(0, 0, "0/0", {
            fontFamily: "Nokia", 
            color: '#ffffff',
        });
        this.add(this.coinCountLabel);

        this.coinArea = new TableElementArea(scene, this.x, this.y + this.coinCountLabel.getBounds().height * 2 + 5);
        this.coinArea.originX = 0;
        this.add(this.coinArea);
    }

    addManaCoin()
    {
        if(this.coinCount >= this. currentMaxCoins)
            return;

        let manaCoin = new ManaCoin(this.scene, this.coinArea.x - 30, this.coinArea.y);
        this.scene.add.existing(manaCoin);
        this.coinArea.pushFrontElem(manaCoin);

        this.coinCount++;
        this.updateLabel();
    }

    removeManaCoin()
    {
        if(this.coinCount <= 0)
            return;

        this.coinArea.popBackElem().destroy();
        this.coinCount--;
        this.updateLabel();
    }

    updateLabel()
    {
        this.coinCountLabel.setText(`${this.coinCount}/${this.currentMaxCoins}`);
    }

    update(dt)
    {
        this.coinArea.update(dt);
    }
}