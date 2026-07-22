import { PlayableCard } from './playable_card.js';

export class CardConatinerArea extends Phaser.GameObjects.Container
{
    /**
     * @type {Map(PlayableCard, number)}
     */
    cardPositioning;

    cardSpacingFactor;

    arcFactor;

    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.cardPositioning = new Map();
        this.cardSpacingFactor = 0.05;
        this.arcFactor = 1;
    }

    /**
     * 
     * @param {PlayableCard} card 
     * @param {number} posIndx 
     */
    insertCardAt(card, posIndx)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");

        this.cardPositioning.forEach(function(value, key) {
            if(value >= posIndx)
                this.cardPositioning.set(key, value + 1);
        }, this);

        this.cardPositioning.set(card, posIndx);
    }

    /**
     * 
     * @param {PlayableCard} card 
     */
    includeCard(card)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");

        let newCardIndex = this.getClosetsHandPositionIndx(card.getCenterPosition());
        this.insertCardAt(card, newCardIndex);
    }

    moveCardTo(card, posIndx)
    {

    }

    /**
     * 
     * @param {PlayableCard} card 
     */
    quitCard(card)
    {
        this.cardPositioning.delete(card);
    }

    /**
     * Returns the index of the closest PlayableCard contained in the card hand
     * @param {Phaser.Math.Vector2} pos 
     * @returns {number}
     */
    getClosetsHandPositionIndx(pos)
    {
        console.assert(pos instanceof Phaser.Math.Vector2, "Error: pos must be an instance of Phaser.Math.Vector2");

        let firstCard = this.cardPositioning.entries().next().key;
        let cardWidth = 0;
        
        if(firstCard == null) 
            return 0;

        cardWidth = firstCard.cardBaseImage.width;

        let cardHandTotalWidth = this.cardPositioning.size * cardWidth * (1 + this.cardSpacingFactor);
        
        let cardChunkWidth = cardHandTotalWidth / this.cardPositioning.size;
        let cardHandLeftBorderX = this.x - cardHandTotalWidth / 2;

        return Math.floor((pos.x - cardHandLeftBorderX) / cardChunkWidth);
    }

    getHandIndxGlobalPosition(indx)
    {
        const [firstCard] = this.cardPositioning.keys();
        //let firstCard = this.cardPositioning.entries().next().key;
        let cardWidth = 0;
        
        if(firstCard != null)
            cardWidth = firstCard.cardBaseImage.width;

        let cardHandTotalWidth = this.cardPositioning.size * cardWidth * (1 + this.cardSpacingFactor);
        
        let cardChunkWidth = cardHandTotalWidth / this.cardPositioning.size;
        let cardHandLeftBorderX = this.x - cardHandTotalWidth / 2;

        return new Phaser.Math.Vector2(cardHandLeftBorderX + cardChunkWidth / 2 + cardChunkWidth * indx, this.y);
    }

    /**
     * 
     * @param {PlayableCard} card 
     * @returns {boolean}
     */
    conatinsCard(card)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");

        return this.cardPositioning.has(card);
    }

    update(dt)
    {
        this.cardPositioning.forEach(function(value, key) {
            if(key == null || key.isPointerDragging) return;

            let x = Phaser.Math.Linear(key.getCenterPosition().x, this.getHandIndxGlobalPosition(value).x, 0.2);
            let y = Phaser.Math.Linear(key.getCenterPosition().y, this.getHandIndxGlobalPosition(value).y, 0.2);
            
            key.setCenterPosition(new Phaser.Math.Vector2(x, y));
        }, this);
    }
}