import { Card } from './card.js';

export class TableElementArea extends Phaser.GameObjects.Container
{
    /**
     * @type {Map<Phaser.GameObjects.GameObject, number>}
     */
    elemPositioning;

    /**
     * @type {number}
     */
    elemSpacingFactor;

    /**
     * @type {number}
     */
    arcFactor;

    /**
     * @type {number}
     */
    originX;

    /**
     * The container adapts to each contained element width at each moment when it is `true`, otherwise 
     * the elems are distributed in a fixed grid position
     * @type {boolean}
     */
    flexible;

    constructor(scene, x, y)
    {
        console.assert(scene instanceof Phaser.Scene, "Error: scene must be a Phaser.Scene");
        console.assert(typeof x === "number", "Error: x must be a number");
        console.assert(typeof y === "number", "Error: y must be a number");

        super(scene, x, y);

        this.elemPositioning = new Map();
        this.elemSpacingFactor = 0.05;
        this.arcFactor = 0;
        this.originX = 0.5;
        this.flexible = true;
    }

    /**
     * 
     * @param {Phaser.GameObjects.GameObject} elem 
     * @param {number} posIndx 
     */
    insertElem(elem, posIndx)
    {
        console.assert(elem instanceof Phaser.GameObjects.GameObject, "Error: elem must be a Container, Image or Container");
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");

        if(this.elemPositioning.has(elem)) 
            return;

        this.elemPositioning.forEach(function(value, elemInHand) {
            if(value >= posIndx)
                this.elemPositioning.set(elemInHand, value + 1);
        }, this);

        this.elemPositioning.set(elem, posIndx);
    }

    /**
     * @param {Phaser.GameObjects.GameObject} elem 
     */
    pushFrontElem(elem)
    {
        console.assert(elem instanceof Phaser.GameObjects.GameObject, "Error: elem must be a Container, Image or Container");

        this.insertElem(elem, 0);
    }

    /**
     * @param {Phaser.GameObjects.GameObject} elem 
     */
    pushBackElem(elem)
    {
        console.assert(elem instanceof Phaser.GameObjects.GameObject, "Error: elem must be a Container, Image or Container");

        this.elemPositioning.set(elem, this.elemPositioning.size);
    }

    /**
     * 
     * @param {Phaser.GameObjects.GameObject} elem 
     */
    includeElem(elem)
    {
        console.assert(elem instanceof Phaser.GameObjects.GameObject, "Error: elem must be a Container, Image or Container");

        if(this.elemPositioning.has(elem)) 
            return;

        let newelemIndex = this.getClosetsContainerPositionIndx(new Phaser.Math.Vector2(elem.x, elem.y));

        // If the elem is added to the last position by the right the insertion that pushes the past
        // last element to the right creates a flick when the hand tries to reposition the elems

        // Solve last position flicking
        if(newelemIndex === this.elemPositioning.size - 1)
        {
            let lastelem = null;

            // Look for the elem with the last position
            this.elemPositioning.forEach(function(value, elemInHand) {
                if(value === this.elemPositioning.size - 1) {
                    lastelem = elemInHand;
                    return;
                }
            }, this);

            // Just add the elem at the end by directly assigning the new last index to the elem
            if(lastelem && lastelem.x < elem.x) {
                this.pushBackElem(elem);
                return;
            }
        }
        
        // Otherwise do normal insertion        
        this.insertElem(elem, newelemIndex);
    }

    /**
     * 
     * @param {Phaser.GameObjects.GameObject} elem 
     * @param {number} posIndx 
     */
    moveElemTo(elem, posIndx)
    {
        console.assert(elem instanceof Phaser.GameObjects.GameObject, "Error: elem must be a Container, Image or Container");
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");
        console.assert(posIndx < this.elemPositioning.size && posIndx >= 0, `Error: posIndx is out of the bounds of the elem hand ${posIndx}`);

        for(let [elemInHand, value] of this.elemPositioning) {
            if(value === posIndx) {
                let switchedelemPos = this.elemPositioning.get(elem);
                this.elemPositioning.set(elemInHand, switchedelemPos);
                break;
            }
        }

        this.elemPositioning.set(elem, posIndx);
    }

    getElemAt(posIndx)
    {
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");
        
        let elem = null;
        
        for(let [elemInHand, value] of this.elemPositioning) {
            if(value === posIndx) {
                elem = elemInHand;
                break;
            }
        }

        return elem;
    }

    /**
     * 
     * @param {Phaser.GameObjects.GameObject} elem 
     */
    quitElem(elem)
    {
        console.assert(elem instanceof Phaser.GameObjects.GameObject, "Error: elem must be a Container, Image or Container");
        
        let freedIndxPos = this.elemPositioning.get(elem);

        this.elemPositioning.forEach(function(value, elemInHand) {
            if(value > freedIndxPos)
                this.elemPositioning.set(elemInHand, value - 1);
        }, this);

        this.elemPositioning.delete(elem);
    }

    /**
     * @returns {Phaser.GameObjects.GameObject}
     */
    popBackElem()
    {
        let lastElem = this.getElemAt(this.elemPositioning.size - 1);
        this.quitElem(lastElem);

        return lastElem;
    }
    
    /** 
     * @returns {Phaser.GameObjects.GameObject}
     */
    popFrontElem()
    {
        let firstElem = this.getElemAt(0);
        this.quitElem(firstElem);

        return firstElem;
    }

    /**
     * Returns the index of the closest elem contained in the elem hand
     * @param {Phaser.Math.Vector2} pos 
     * @returns {number}
     */
    getClosetsContainerPositionIndx(pos)
    {
        console.assert(pos instanceof Phaser.Math.Vector2, "Error: pos must be an instance of Phaser.Math.Vector2");

        const [firstElem] = this.elemPositioning.keys();
        let elemWidth = 0;
        
        if(firstElem == null) 
            return 0;

        if(!this.flexible)
        {   
            elemWidth = firstElem.getBounds().width;;

            let elemHandTotalWidth = this.elemPositioning.size * elemWidth * (1 + this.elemSpacingFactor);
            
            let elemChunkWidth = elemHandTotalWidth / this.elemPositioning.size;
            let elemHandLeftBorderX = this.x - elemHandTotalWidth * this.originX;

            let indxInHand = Math.floor((pos.x - elemHandLeftBorderX) / elemChunkWidth);

            return Phaser.Math.Clamp(indxInHand, 0, this.elemPositioning.size - 1);
        }
        
        // Obtain the width of all the elems and the total width of the container
        let elemWidths = new Array(this.elemPositioning.size);
        let containerWidth = 0;

        this.elemPositioning.forEach(function(posIndx, elemInCont) {
            elemWidths[posIndx] = elemInCont.getBounds().width * (1 + this.elemSpacingFactor);
            containerWidth += elemWidths[posIndx];
        }, this);

        
        // If the mouse is directly at the right from the container we return the last position index
        let containerLeftLimitX = this.x - containerWidth * this.originX;

        if(pos.x >= containerLeftLimitX + containerWidth)
            return this.elemPositioning.size - 1;

        // Checking the space where the position is by adding the different widths of the elems
        let indx = 0;
        for (let i = 0; i < elemWidths.length; i++) {
            if(pos.x >= containerLeftLimitX && pos.x < containerLeftLimitX + elemWidths[i])
            {
                indx = i;
                break;
            }

            containerLeftLimitX += elemWidths[i];
        }

        return indx;
    }

    /**
     * Returns the position in the world of the center of a elem of the hand in that position 
     * @param {number} indx 
     * @returns {Phaser.Math.Vector2}
     */
    getContainerIndxGlobalPosition(indx)
    {
        console.assert(typeof indx === "number", "Error: indx must be a number");

        const [firstElem] = this.elemPositioning.keys();
        let elemWidth = 0;
        
        if(firstElem != null)
            elemWidth = firstElem.getBounds().width;

        if(!this.flexible)
        {  
            let elemHandTotalWidth = this.elemPositioning.size * elemWidth * (1 + this.elemSpacingFactor);
            
            let elemChunkWidth = elemHandTotalWidth / this.elemPositioning.size;
            let elemHandLeftBorderX = this.x - elemHandTotalWidth * this.originX;

            return this._getArchedPos(new Phaser.Math.Vector2(elemHandLeftBorderX + elemChunkWidth / 2 + elemChunkWidth * indx, this.y));
        }

        // Get total width of the hand
        let elemHandTotalWidth = 0;
        let widthShift = 0;

        this.elemPositioning.forEach(function(posIndx, elem) 
        {
            elemHandTotalWidth += elem.getBounds().width * (1 + this.elemSpacingFactor);

            if(posIndx === indx) {
                widthShift += elem.getBounds().width * (1 + this.elemSpacingFactor) / 2;
            }
            else if(posIndx < indx) {
                widthShift += elem.getBounds().width * (1 + this.elemSpacingFactor);
            }
        }, this);
        
        let elemHandLeftBorderX = this.x - elemHandTotalWidth * this.originX;
        
        return this._getArchedPos(new Phaser.Math.Vector2(elemHandLeftBorderX + widthShift, this.y));
    }

    /**
     * Returns an arched position of a elem given a flat position in the container, used by 
     * `getContainerIndxGlobalPosition(indx)` to apply the `arcFactor` property.
     * @param {Phaser.Math.Vector2} pos 
     * @returns {Phaser.Math.Vector2}
     */
    _getArchedPos(pos)
    {
        console.assert(pos instanceof Phaser.Math.Vector2, "Error: pos must be an instance of Phaser.Math.Vector2");

        const [firstElem] = this.elemPositioning.keys();
        let elemWidth = 0;
        
        if(firstElem == null || this.arcFactor === 0) 
            return pos;

        let centerDist = pos.x - this.x;

        let angle = Phaser.Math.DegToRad(this.arcFactor);
        let x = Math.cos(angle) * centerDist + this.x;
        let y = Math.sin(angle * Math.sign(centerDist)) * centerDist + this.y;

        return new Phaser.Math.Vector2(x, y);
    }

    _getArchedRot(pos)
    {

    }

    /**
     * 
     * @param {Phaser.GameObjects.GameObject} elem 
     * @returns {number}
     */
    getelemIndx(elem)
    {
        console.assert(elem instanceof Phaser.GameObjects.GameObject, "Error: elem must be a Container, Image or Container");

        if(!this.elemPositioning.has(elem))
            return -1;

        return this.elemPositioning.get(elem);
    }

    /**
     * 
     * @param {number} posIndx 
     * @returns {Array<elem>}
     */
    getElemsAt(posIndx)
    {
        console.assert(typeof posIndx === "number", "Error: posIndx must be a number");

        let elems = new Array();

        this.elemPositioning.forEach(function(value, elemInCont) {
            if(value === posIndx)
                elems.push(elemInCont);
        }, this);

        return elems;
    }

    /**
     * 
     * @param {Phaser.GameObjects.GameObject} elem 
     * @returns {boolean}
     */
    conatinsElem(elem)
    {
        console.assert(elem instanceof Phaser.GameObjects.GameObject, "Error: elem must be a Container, Image or Container");

        return this.elemPositioning.has(elem);
    }

    // TODO
    // conatinsElemWithAttributes(attr)

    update(dt)
    {
        this.elemPositioning.forEach(function(posIndx, elem) {
            if(!elem) return;
            
           /* let mouseX = this.scene.input.activePointer.x;
            let mouseY = this.scene.input.activePointer.y;
            console.log(this.getClosetsContainerPositionIndx(new Phaser.Math.Vector2(mouseX, mouseY)));*/

            // Handling the elem's positioning in the hand
            if(elem == null || elem.isPointerDragging) return;

            let x = Phaser.Math.Linear(elem.x, this.getContainerIndxGlobalPosition(posIndx).x, 0.2);
            let y = Phaser.Math.Linear(elem.y, this.getContainerIndxGlobalPosition(posIndx).y, 0.2);
            
            elem.x = x;
            elem.y = y;

            //let rot = this.arcFactor * 
        }, this);
    }
}