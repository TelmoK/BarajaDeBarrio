import { PlayableCard } from "./playable_card.js";
import { CardConatinerArea } from "./card_container_area.js";

export class CardManager
{
    /**
     * Array that contains all the `PlayableCards`'s in the current scene
     * @type {Array<PlayableCard>}
     */
    cards;

    /**
     * @type {Phaser.Scene}
     */
    scene;

    /**
     * @type {CardConatinerArea}
     */
    cardHand;

    constructor(scene, cardHand)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be a Phaser.Scene");
        console.assert(cardHand instanceof CardConatinerArea, "Error: cardHand must be a CardConatinerArea");

        this.scene = scene;
        this.cardHand = cardHand;
        this.cards = new Array();
    }

    handleCardDrag()
    {
        this.cards.forEach(function(card) {
            if(!card.isPointerDragging) return;

            // Check overlap od the card with the card hand influence area
            const cardBounds = card.getBounds();
            const cardHandBounds = this.cardHand.handDropArea.getBounds();

            if(Phaser.Geom.Intersects.RectangleToRectangle(cardBounds, cardHandBounds)) {
                this.cardHand.includeCard(card);
            }
            else {
                this.cardHand.quitCard(card);
            }
        }, this);
    }

    /**
     * Instaces a card in the scene at the given position including it in the internal list of cards in the scene
     * @param {number} x
     * @param {number} y
     */
    instanceCard(x, y)
    {
        console.assert(typeof x === "number", "Error: x must be a number");
        console.assert(typeof y === "number", "Error: y must be a number");

        let card = new PlayableCard(this.scene, x, y);
        this.scene.add.existing(card);
        this.cards.push(card);
        
        return card;
    }

    addExisting(card)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");

        this.scene.add.existing(card);
    }

    destroyCard(card)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");

        this.cardHand.quitCard(card);

        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
        }

        card.destroy();
    }

    update(dt)
    {
        this.handleCardDrag();
    }
}