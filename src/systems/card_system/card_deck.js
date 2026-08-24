import { SPRITES_ASSET_KEYS } from "../../utils/asset_keys.js";

export class CardDeck extends Phaser.GameObjects.Container
{
    /**
     * Array of `CardInfo` objects sorted by maná cost, that contains all the cards that the player can
     * use in the game
     * @type {Array<CardInfo>}
     */
    cardInfoList;

    /**
     * @type {Phaser.GameObjects.Image}
     */
    cardDeckImage;

    constructor(scene, x, y, cardInfoList)
    {
        super(scene, x, y);

        this.cardInfoList = cardInfoList;
        
        this.cardDeckImage = scene.add.image(0, 0, SPRITES_ASSET_KEYS.TEST_CARD_DECK);
        this.cardDeckImage.setScale(0.5, 0.5);
        this.add(this.cardDeckImage);

        this._shuffleCardInfoList();
    }

    _shuffleCardInfoList()
    {
        for (let i = this.cardInfoList.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cardInfoList[i], this.cardInfoList[j]] = [this.cardInfoList[j], this.cardInfoList[i]];
        }
    }

    popCardInfo()
    {
        return this.cardInfoList.pop();
    }
}