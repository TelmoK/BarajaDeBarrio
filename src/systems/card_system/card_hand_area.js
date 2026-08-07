import { CardConatinerArea } from "./card_container_area.js";

export class CardHandArea extends CardConatinerArea
{
    /**
     * @type {Phaser.GameObjects.Zone}
     */
    handDropArea;

    constructor(scene, x, y)
    {
        super(scene, x, y);

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

        let cardWidth = firstCard.widthInContainer();

        let cardHandTotalWidth = this.cardPositioning.size * cardWidth * (1 + this.cardSpacingFactor) * 1.05;

        this.handDropArea.body.setSize(cardHandTotalWidth, this.handDropArea.body.height);
    }

    /**
     * 
     * @param {PlayableCard} card 
     * @param {number} posIndx 
     */
    insertCard(card, posIndx)
    {
        super.insertCard(card, posIndx);

        this._resizeDropArea();
    }

    /**
     * 
     * @param {PlayableCard} card 
     */
    includeCard(card)
    {
        super.includeCard(card);

        this._resizeDropArea();
    }

    /**
     * 
     * @param {PlayableCard} card 
     */
    quitCard(card)
    {
        super.quitCard(card);

        this._resizeDropArea();
    }

    update(dt)
    {
        this.cardPositioning.forEach(function(posIndx, card) {
            if(!card) return;

            // Handling the switch movement of the dragged card in the hand
            if(card.isPointerDragging) 
            {
                let cardNewPosIndx = this.getClosetsHandPositionIndx(card.getCenterPosition());
                this.moveCardTo(card, cardNewPosIndx);
            }
            
            //let mouseX = this.scene.input.activePointer.x;
            //let mouseY = this.scene.input.activePointer.y;
            //console.log(this.getClosetsHandPositionIndx(new Phaser.Math.Vector2(mouseX, mouseY)));

            // Handling the card's positioning in the hand
            if(card == null || card.isPointerDragging) return;

            let x = Phaser.Math.Linear(card.getCenterPosition().x, this.getHandIndxGlobalPosition(posIndx).x, 0.2);
            let y = Phaser.Math.Linear(card.getCenterPosition().y, this.getHandIndxGlobalPosition(posIndx).y, 0.2);
            
            card.setCenterPosition(new Phaser.Math.Vector2(x, y));
        }, this);
    }
}