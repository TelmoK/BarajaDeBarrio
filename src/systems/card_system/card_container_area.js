//import { PlayableCard } from './playable_card.js';
import { Card } from './card.js';

export class CardConatinerArea extends Phaser.GameObjects.Container
{
    /**
     * @type {Map<Card, number>}
     */
    cardPositioning;

    /**
     * @type {number}
     */
    cardSpacingFactor;

    /**
     * @type {number}
     */
    arcFactor;

    /**
     * @type {number}
     */
    originX;

    constructor(scene, x, y)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be a Phaser.Scene");
        console.assert(typeof x === "number", "Error: x must be a number");
        console.assert(typeof y === "number", "Error: y must be a number");

        super(scene, x, y);

        this.cardPositioning = new Map();
        this.cardSpacingFactor = 0.05;
        this.arcFactor = 1;
        this.originX = 0.5;
    }

    /**
     * 
     * @param {Card} card 
     * @param {number} posIndx 
     */
    insertCard(card, posIndx)
    {
        console.assert(card instanceof Card, "Error: card must be an instance of Card");
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");

        if(this.cardPositioning.has(card)) 
            return;

        this.cardPositioning.forEach(function(value, cardInHand) {
            if(value >= posIndx)
                this.cardPositioning.set(cardInHand, value + 1);
        }, this);

        this.cardPositioning.set(card, posIndx);
    }

    /**
     * 
     * @param {Card} card 
     */
    includeCard(card)
    {
        console.assert(card instanceof Card, "Error: card must be an instance of Card");

        if(this.cardPositioning.has(card)) 
            return;

        let newCardIndex = this.getClosetsContainerPositionIndx(card.getCenterPosition());

        // If the card is added to the last position by the right the insertion that pushes the past
        // last element to the right creates a flick when the hand tries to reposition the cards

        // Solve last position flicking
        if(newCardIndex === this.cardPositioning.size - 1)
        {
            let lastCard = null;

            // Look for the card with the last position
            this.cardPositioning.forEach(function(value, cardInHand) {
                if(value === this.cardPositioning.size - 1) {
                    lastCard = cardInHand;
                    return;
                }
            }, this);

            // Just add the card at the end by directly assigning the new last index to the card
            if(lastCard && lastCard.x < card.x) {
                this.cardPositioning.set(card, this.cardPositioning.size);
                return;
            }
        }
        
        // Otherwise do normal insertion        
        this.insertCard(card, newCardIndex);
    }

    /**
     * 
     * @param {Card} card 
     * @param {number} posIndx 
     */
    moveCardTo(card, posIndx)
    {
        console.assert(card instanceof Card, "Error: card must be an instance of Card");
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");
        console.assert(posIndx < this.cardPositioning.size && posIndx >= 0, `Error: posIndx is out of the bounds of the card hand ${posIndx}`);

        for(let [cardInHand, value] of this.cardPositioning) {
            if(value === posIndx) {
                let switchedCardPos = this.cardPositioning.get(card);
                this.cardPositioning.set(cardInHand, switchedCardPos);
                break;
            }
        }

        this.cardPositioning.set(card, posIndx);
    }

    /**
     * 
     * @param {Card} card 
     */
    quitCard(card)
    {
        console.assert(card instanceof Card, "Error: card must be an instance of Card");
        
        let freedIndxPos = this.cardPositioning.get(card);

        this.cardPositioning.forEach(function(value, cardInHand) {
            if(value > freedIndxPos)
                this.cardPositioning.set(cardInHand, value - 1);
        }, this);

        this.cardPositioning.delete(card);
    }

    /**
     * Returns the index of the closest Card contained in the card hand
     * @param {Phaser.Math.Vector2} pos 
     * @returns {number}
     */
    getClosetsContainerPositionIndx(pos)
    {
        console.assert(pos instanceof Phaser.Math.Vector2, "Error: pos must be an instance of Phaser.Math.Vector2");

        //let firstCard = this.cardPositioning.entries().next().key;
        const [firstCard] = this.cardPositioning.keys();
        let cardWidth = 0;
        
        if(firstCard == null) 
            return 0;

        cardWidth = firstCard.widthInContainer();

        let cardHandTotalWidth = this.cardPositioning.size * cardWidth * (1 + this.cardSpacingFactor);
        
        let cardChunkWidth = cardHandTotalWidth / this.cardPositioning.size;
        let cardHandLeftBorderX = this.x - cardHandTotalWidth * this.originX;

        let indxInHand = Math.floor((pos.x - cardHandLeftBorderX) / cardChunkWidth);

        return Phaser.Math.Clamp(indxInHand, 0, this.cardPositioning.size - 1);
    }

    /**
     * Returns the position in the world of the center of a card of the hand in that position 
     * @param {number} indx 
     * @returns {Phaser.Math.Vector2}
     */
    getContainerIndxGlobalPosition(indx)
    {
        console.assert(typeof indx === "number", "Error: indx must be a number");

        const [firstCard] = this.cardPositioning.keys();
        let cardWidth = 0;
        
        if(firstCard != null)
            cardWidth = firstCard.widthInContainer();

        let cardHandTotalWidth = this.cardPositioning.size * cardWidth * (1 + this.cardSpacingFactor);
        
        let cardChunkWidth = cardHandTotalWidth / this.cardPositioning.size;
        let cardHandLeftBorderX = this.x - cardHandTotalWidth * this.originX;

        return new Phaser.Math.Vector2(cardHandLeftBorderX + cardChunkWidth / 2 + cardChunkWidth * indx, this.y);
    }

    /**
     * 
     * @param {Card} card 
     * @returns {number}
     */
    getCardIndx(card)
    {
        if(!this.cardPositioning.has(card))
            return -1;

        return this.cardPositioning.get(card);
    }

    /**
     * 
     * @param {number} posIndx 
     * @returns {Array<Card>}
     */
    getCardsAt(posIndx)
    {
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");

        let cards = new Array();

        this.cardPositioning.forEach(function(value, cardInCont) {
            if(value === posIndx)
                cards.push(cardInCont);
        }, this);

        return cards;
    }

    /**
     * 
     * @param {Card} card 
     * @returns {boolean}
     */
    conatinsCard(card)
    {
        console.assert(card instanceof Card, "Error: card must be an instance of Card");

        return this.cardPositioning.has(card);
    }

    // TODO
    // conatinsCardWithAttributes(attr)

    update(dt)
    {
        this.cardPositioning.forEach(function(posIndx, card) {
            if(!card) return;

            // Handling the card's positioning in the hand
            if(card == null || card.isPointerDragging) return;

            let x = Phaser.Math.Linear(card.getCenterPosition().x, this.getContainerIndxGlobalPosition(posIndx).x, 0.2);
            let y = Phaser.Math.Linear(card.getCenterPosition().y, this.getContainerIndxGlobalPosition(posIndx).y, 0.2);
            
            card.setCenterPosition(new Phaser.Math.Vector2(x, y));
        }, this);
    }
}