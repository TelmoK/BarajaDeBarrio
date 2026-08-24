import { TableElementArea } from "./table_element_area.js";
import { PlayableCard } from "./playable_card.js";

export class CardHandArea extends TableElementArea
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
        const [firstCard] = this.elemPositioning.keys();
        
        if(firstCard == null) {
            this.handDropArea.body.setSize(500, 160);
            return;
        }

        let cardWidth = firstCard.getBounds().width;

        let cardHandTotalWidth = this.elemPositioning.size * cardWidth * (1 + this.elemSpacingFactor) * 1.05;

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

        super.insertElem(card, posIndx);

        this._resizeDropArea();
    }

    /**
     * 
     * @param {PlayableCard} card 
     */
    includeCard(card)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");

        super.includeElem(card);

        this._resizeDropArea();
    }

    /**
     * 
     * @param {PlayableCard} card 
     */
    quitCard(card)
    {
        console.assert(card instanceof PlayableCard, "Error: card must be an instance of PlayableCard");

        super.quitElem(card);

        this._resizeDropArea();
    }

    update(dt)
    {
        this.elemPositioning.forEach(function(posIndx, card) {
            if(!card) return;

            // Handling the switch movement of the dragged card in the hand
            if(card.isPointerDragging) 
            {
                let cardNewPosIndx = this.getClosetsContainerPositionIndx(new Phaser.Math.Vector2(card.x, card.y));
                this.moveElemTo(card, cardNewPosIndx);
            }
            
            //let mouseX = this.scene.input.activePointer.x;
            //let mouseY = this.scene.input.activePointer.y;
            //console.log(this.getClosetsHandPositionIndx(new Phaser.Math.Vector2(mouseX, mouseY)));

            // Handling the card's positioning in the hand
            if(card == null || card.isPointerDragging) return;

            let x = Phaser.Math.Linear(card.x, this.getContainerIndxGlobalPosition(posIndx).x, 0.2);
            let y = Phaser.Math.Linear(card.y, this.getContainerIndxGlobalPosition(posIndx).y, 0.2);
            
            card.x = x;
            card.y = y;
        }, this);
    }
}