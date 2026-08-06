import { CardConatinerArea } from "./card_container_area.js";

export class CardHandArea extends CardConatinerArea
{
    constructor(scene, x, y)
    {
        super(scene, x, y);
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