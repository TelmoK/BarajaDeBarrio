import { TableCharacterCard } from "./table_character_card.js";

export class CombatManager
{
    /**
     * @type {Phaser.Scene}
     */
    scene;

    /**
     * @type {Phaser.GameObjects.Shape.Line}
     */
    _currentCombatTargetLine;

    /**
     * List that contains the defensive relationship between two table character cards
     * @type {Array<{defender: TableCharacterCard, target: TableCharacterCard}>}
     */
    _defenseRelationPairs;
    
    constructor(scene)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be instance of Phaser.Scene");

        this.scene = scene;

        // Setting the line that selects the target in the combat system
        this._currentCombatTargetLine = this.scene.add.line(0, 0, 0, 0, 0, 0, 0xff0000, 1);
        this._currentCombatTargetLine.setOrigin(0,0);
        this._currentCombatTargetLine.setDepth(10);
        this._currentCombatTargetLine.setLineWidth(8, 8); 

        this.scene.input.on(Phaser.Input.Events.DRAG, function(pointer, gameObject, dragX, dragY) {
            if(!(gameObject instanceof TableCharacterCard))
                return;

            this._currentCombatTargetLine.setAlpha(1);
            this._currentCombatTargetLine.setTo(gameObject.x, gameObject.y, pointer.x, pointer.y);
        }, 
        this);

        this.scene.input.on(Phaser.Input.Events.DRAG_END, function(pointer, gameObject) {
            if(!(gameObject instanceof TableCharacterCard))
                return;

            this._currentCombatTargetLine.setAlpha(0);
        }, 
        this);
    }

    update(dt)
    {

    }
}