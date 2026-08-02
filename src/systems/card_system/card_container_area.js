import { PlayableCard } from './playable_card.js';

export class CardConatinerArea extends Phaser.GameObjects.Container
{
    /**
     * @type {Map<PlayableCard, number>}
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
     * @type {Phaser.GameObjects.Zone}
     */
    handDropArea;

    constructor(scene, x, y)
    {
        super(scene, x, y);

        this.cardPositioning = new Map();
        this.cardSpacingFactor = 0.05;
        this.arcFactor = 1;

        this.handDropArea = scene.add.zone(0, 0, 500, 200);
        
        this.scene.physics.add.existing(this.handDropArea);
        this.handDropArea.body.setAllowGravity(false);
        
        this.add(this.handDropArea);
        this._resizeDropArea();
    }

    /**
     * Resizes the area where cards can be droped and added to the card hand
     */
    _resizeDropArea()
    {
        const [firstCard] = this.cardPositioning.keys();
        
        if(firstCard == null) {
            this.handDropArea.body.setSize(500, 160);
            return;
        }

        let cardWidth = firstCard.cardBaseImage.width;

        let cardHandTotalWidth = this.cardPositioning.size * cardWidth * (1 + this.cardSpacingFactor);

        this.handDropArea.body.setSize(cardHandTotalWidth, this.handDropArea.body.height);
    }

    /**
     * 
     * @param {PlayableCard} card 
     * @param {number} posIndx 
     */
    insertCard(card, posIndx)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");

        this.cardPositioning.forEach(function(value, key) {
            if(value >= posIndx)
                this.cardPositioning.set(key, value + 1);
        }, this);

        this.cardPositioning.set(card, posIndx);

        this._resizeDropArea();
    }

    /**
     * 
     * @param {PlayableCard} card 
     */
    includeCard(card)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");

        let newCardIndex = this.getClosetsHandPositionIndx(card.getCenterPosition());
        this.insertCard(card, newCardIndex);
    }

    /**
     * 
     * @param {PlayableCard} card 
     * @param {number} posIndx 
     */
    moveCardTo(card, posIndx)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");
        console.assert(posIndx < this.cardPositioning.size && posIndx >= 0, `Error: posIndx is out of the bounds of the card hand ${posIndx}`);

        for(let [key, value] of this.cardPositioning) {
            if(value === posIndx) {
                let switchedCardPos = this.cardPositioning.get(card);
                this.cardPositioning.set(key, switchedCardPos);
                break;
            }
        }

        this.cardPositioning.set(card, posIndx);
    }

    /**
     * 
     * @param {PlayableCard} card 
     */
    quitCard(card)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");

        this.cardPositioning.delete(card);

        this._resizeDropArea();
    }

    /**
     * Returns the index of the closest PlayableCard contained in the card hand
     * @param {Phaser.Math.Vector2} pos 
     * @returns {number}
     */
    getClosetsHandPositionIndx(pos)
    {
        console.assert(pos instanceof Phaser.Math.Vector2, "Error: pos must be an instance of Phaser.Math.Vector2");

        //let firstCard = this.cardPositioning.entries().next().key;
        const [firstCard] = this.cardPositioning.keys();
        let cardWidth = 0;
        
        if(firstCard == null) 
            return 0;

        cardWidth = firstCard.cardBaseImage.width;

        let cardHandTotalWidth = this.cardPositioning.size * cardWidth * (1 + this.cardSpacingFactor);
        
        let cardChunkWidth = cardHandTotalWidth / this.cardPositioning.size;
        let cardHandLeftBorderX = this.x - cardHandTotalWidth / 2;

        let indxInHand = Math.floor((pos.x - cardHandLeftBorderX) / cardChunkWidth);

        return Phaser.Math.Clamp(indxInHand, 0, this.cardPositioning.size - 1);
    }

    /**
     * Returns the position in the world of the center of a card of the hand in that position 
     * @param {number} indx 
     * @returns {Phaser.Math.Vector2}
     */
    getHandIndxGlobalPosition(indx)
    {
        const [firstCard] = this.cardPositioning.keys();
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

    // TODO
    // conatinsCardWithAttributes(attr)

    update(dt)
    {
        this.cardPositioning.forEach(function(posIndx, card) {
            // Handling the switch movement of the dragged card in the hand
            if(card.isPointerDragging) 
            {
                let cardNewPosIndx = this.getClosetsHandPositionIndx(card.getCenterPosition());
                this.moveCardTo(card, cardNewPosIndx);
            }
            
            let mouseX = this.scene.input.activePointer.x;
            let mouseY = this.scene.input.activePointer.y;
            //console.log(this.getClosetsHandPositionIndx(new Phaser.Math.Vector2(mouseX, mouseY)));

            // Handling the card's positioning in the hand
            if(card == null || card.isPointerDragging) return;

            let x = Phaser.Math.Linear(card.getCenterPosition().x, this.getHandIndxGlobalPosition(posIndx).x, 0.2);
            let y = Phaser.Math.Linear(card.getCenterPosition().y, this.getHandIndxGlobalPosition(posIndx).y, 0.2);
            
            card.setCenterPosition(new Phaser.Math.Vector2(x, y));
        }, this);
    }
}