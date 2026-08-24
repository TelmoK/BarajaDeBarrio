import { PlayableCard } from "./playable_card.js";
import { Card } from "./card.js";
import { TableElementArea } from "./table_element_area.js";
import { CardHandArea } from "./card_hand_area.js";
import { TableManaCard } from "./table_mana_card.js";
import { TableCharacterCard } from "./table_character_card.js";
import { ManaCoin } from "./mana_coin.js";
import { ManaCoinWidget } from "./mana_coin_widget.js";

import { NodeAnimation } from "../animation_system/node_animation.js";
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
     * @type {ManaCoinWidget}
     */
    manaCoinWidget;

    /**
     * @type {TableElementArea}
     */
    actionCardArea;

    /**
     * @type {NodeAnimation}
     */
    cardDropAnim;

    constructor(scene, cardHand, manaCoinWidget, actionCardArea)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be a Phaser.Scene");
        console.assert(cardHand instanceof CardHandArea, "Error: cardHand must be a CardHandArea");
        console.assert(manaCoinWidget instanceof ManaCoinWidget, "Error: manaCoinWidget must be a ManaCoinWidget");
        console.assert(actionCardArea instanceof TableElementArea, "Error: actionCardArea must be a TableElementArea");

        this.scene = scene;
        this.cardHand = cardHand;
        this.actionCardArea = actionCardArea;
        this.manaCoinWidget = manaCoinWidget;
        this.cards = new Array();
    }

    /**
     * 
     * @param {Card} card 
     */
    _dropCardIntoManaArea(card)
    {
        let cardX = card.x;
        let cardY = card.y;
        let tableCard = null;

        let destroyPlayableCard = new ActionAnimNode();
        destroyPlayableCard.action = () => {
            this.destroyCard(card);
        };

        let createTableCard = new ActionAnimNode();
        let addTableCard = new ActionAnimNode();

        if(card.cardInfo.cardType === "Mana Card") {
            createTableCard.action = () => {
                
            }
            addTableCard.action = () => {
                this.manaCoinWidget.addManaCoin();
            };
        }
        else {
            createTableCard.action = () => {
                tableCard = new TableCharacterCard(this.scene, cardX, cardY);
                this.scene.add.existing(tableCard)
                this.addExisting(tableCard);
            }
            addTableCard.action = () => {
                this.actionCardArea.includeElem(tableCard);
                this.manaCoinWidget.removeManaCoin();
            };
        }

        

        this.cardDropAnim = new NodeAnimation();
        this.cardDropAnim.pushBackAnimNode(destroyPlayableCard);
        this.cardDropAnim.pushBackAnimNode(createTableCard);
        this.cardDropAnim.pushBackAnimNode(addTableCard);
        this.cardDropAnim.play();
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
        
        if(this.cardDropAnim)
            this.cardDropAnim.update(dt);
    }
}