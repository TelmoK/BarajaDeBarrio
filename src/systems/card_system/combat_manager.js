import { TableCharacterCard } from "./table_character_card.js";
import { TableElementArea } from "./table_element_area.js";

import { NodeAnimation } from "../animation_system/node_animation.js";
import { ParallelAnimNode } from "../animation_system/parallel_anim_node.js";
import { ActionAnimNode } from "../animation_system/action_anim_node.js";
import { TweenAnimNode } from "../animation_system/tween_anim_node.js";
import { DelayAnimNode } from "../animation_system/delay_anim_node.js";

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
    
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @param {TableElementArea} playerActionCardArea 
     * @param {TableElementArea} rivalActionCardArea 
     */
    constructor(scene, playerActionCardArea, rivalActionCardArea)
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

        this.scene.input.on(Phaser.Input.Events.DROP, function(pointer, gameObject, target) {
            if(!(gameObject instanceof TableCharacterCard))
                return;

            if(target instanceof TableCharacterCard && target !== gameObject && !playerActionCardArea.conatinsElem(target))
            {
                const originX = gameObject.x;
                const originY = gameObject.y;
                
                let delay = new DelayAnimNode(0.2);
                let cardGoToEnemy = new TweenAnimNode(this.scene);
                cardGoToEnemy.tween({
                    targets: gameObject,
                    x: { from: originX, to: target.x }, 
                    y: { from: originY, to: target.y }, 
                    duration: 100,
                    yoyo: true,
                    callbackScope: this
                });
                /*let cardComeBAck = new TweenAnimNode();
                cardComeBAck.tween({
                    target: gameObject,
                    x: originX,
                    y: originX,
                    duration: 1000,
                    callbackScope: this
                });*/

                this.cardAttackAnim = new NodeAnimation();
                this.cardAttackAnim.pushBackAnimNode(delay);
                this.cardAttackAnim.pushBackAnimNode(cardGoToEnemy);
                //this.cardAttackAnim.pushBackAnimNode(cardComeBAck);
                this.cardAttackAnim.play();

                console.log("ATTACK");
            }
        }, 
        this);
    }

    update(dt)
    {
        if(this.cardAttackAnim)
            this.cardAttackAnim.update(dt);
    }
}