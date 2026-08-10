import { PlayableCard } from "./playable_card.js";
import { Card } from "./card.js";
import { CardConatinerArea } from "./card_container_area.js";
import { CardHandArea } from "./card_hand_area.js";
import { TableManaCard } from "./table_mana_card.js";

import { ParallelAnimNode } from "../animation_system/parallel_anim_node.js";
import { ActionAnimNode } from "../animation_system/action_anim_node.js";
import { TweenAnimNode } from "../animation_system/tween_anim_node.js";

export class CardManager
{
    /**
     * Array that contains all the `PlayableCards`'s in the current scene
     * @type {Array<Card>}
     */
    cards;

    /**
     * @type {Phaser.Scene}
     */
    scene;

    /**
     * @type {CardHandArea}
     */
    cardHand;

    /**
     * @type {CardConatinerArea}
     */
    manaCardArea;

    dropAnim;

    constructor(scene, cardHand, manaCardArea)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be a Phaser.Scene");
        console.assert(cardHand instanceof CardHandArea, "Error: cardHand must be a CardHandArea");

        this.scene = scene;
        this.cardHand = cardHand;
        this.manaCardArea = manaCardArea;
        this.cards = new Array();
    }

    _dropCardIntoManaArea(card)
    {
        let cardX = card.x;
        let cardY = card.y;
        let manaCard = null;

        let newDropAnim = new ParallelAnimNode();

        let cardChange = new ActionAnimNode();
        cardChange.action = () => {
            this.destroyCard(card);
        };

        let createManaCard = new ActionAnimNode();
        createManaCard.action = () => {
            manaCard = new TableManaCard(this.scene, cardX, cardY);
            this.scene.add.existing(manaCard)
            this.addExisting(manaCard);
        }

        let addCard = new ActionAnimNode();
        addCard.action = () => {
            this.manaCardArea.includeCard(manaCard);
        };

        cardChange.nextNode = createManaCard;
        createManaCard.nextNode = addCard;

        createManaCard.prevNode = cardChange;
        addCard.prevNode = createManaCard;

        newDropAnim.addBranchNode(cardChange);
        newDropAnim.setNaturalDuration();
        newDropAnim.initFowardPlay();

        this.dropAnim = newDropAnim;
    }

    _handleCardDrag()
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
                this._dropCardIntoManaArea(card);
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
        console.assert(card instanceof Card, "Error: card must be an instance of PlayableCard");

        this.scene.add.existing(card);
    }

    destroyCard(card)
    {
        console.assert(card instanceof Card, "Error: card must be an instance of PlayableCard");

        this.cardHand.quitCard(card);

        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
        }

        card.destroy();
    }

    update(dt)
    {
        this._handleCardDrag();
        
        if(this.dropAnim)
            this.dropAnim.update(dt);
    }
}