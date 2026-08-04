import { SPRITES_ASSET_KEYS } from "../utils/asset_keys.js";

import { PlayableCard } from "../systems/card_system/playable_card.js";
import { CardConatinerArea } from "../systems/card_system/card_container_area.js";
import { CardManager } from "../systems/card_system/card_manager.js";

import { ParallelAnimNode } from "../systems/animation_system/parallel_anim_node.js";
import { DelayAnimNode } from "../systems/animation_system/delay_anim_node.js";
import { ActionAnimNode } from "../systems/animation_system/action_anim_node.js";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        //super({ key: KEYS_SCENES.PRELOAD });
        super();
    }

    init(data) {

    }

    preload() {
        this.load.image(SPRITES_ASSET_KEYS.TEST_CARD, "assets/test/test_card.png");
       /* this.load.image(KEYS_ASSETS_SPRITES.MISC_DICE_SLOT, "assets/misc-dice-slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.MISC_CARD, "assets/misc-card.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_SLOT, "assets/dice/dice_slot.png");
        this.load.image(KEYS_ASSETS_SPRITES.PAST_CARD, "assets/card/past_card_template.png");
        this.load.image(KEYS_ASSETS_SPRITES.FUTURE_CARD, "assets/card/future_card_template.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_HAND_PANEL, "assets/card/card_hand_panel.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_SELECTION_FRAME, "assets/card/card_selection_frame.png");

        this.load.image(KEYS_ASSETS_SPRITES.CARD_ATTACK_ACTION, "assets/card/card_attack_action_type_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_DEFENCE_ACTION, "assets/card/card_defence_action_type_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_HEAL_ACTION, "assets/card/card_heal_action_type_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.CARD_ACTION_SELECTION_FRAME, "assets/card/card_action_type_selection_frame.png");
        this.load.spritesheet(KEYS_ASSETS_SPRITES.CARD_ATLAS, "assets/card/card_atlas.png", {frameWidth: 318, frameHeight: 244});

        this.load.image(KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_RELEASE, "assets/turn_ring_button/finish_turn_button_released.png");

        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, "assets/emotion_stack/anger_icon.png");

        this.load.plugin(KEYS_SHADER_PIPELINES.rexcrtpipelineplugin, 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcrtpipelineplugin.min.js', true);
        this.load.plugin(KEYS_SHADER_PIPELINES.rextoonifypipelineplugin, 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextoonifypipelineplugin.min.js', true);*/
    }

    create(data) {
       /* this.scene.start(KEYS_SCENES.MAIN_MENU);
        this.scene.stop();*/
        this.cardHand = new CardConatinerArea(this, 640, 600);
        this.add.existing(this.cardHand);

        this.cardManager = new CardManager(this, this.cardHand);
        this.add.existing(this.cardManager);

        /*let card = new PlayableCard(0, 0, this);
        this.add.existing(card);
        
        let card2 = new PlayableCard(300, 0, this);
        this.add.existing(card2);
        
        let card3 = new PlayableCard(600, 0, this);
        this.add.existing(card3);
*/
        let card = this.cardManager.instanceCard(0, 0);
        let card2 = this.cardManager.instanceCard(300, 0);
        let card3 = this.cardManager.instanceCard(600, 0);

        this.cardHand.includeCard(card);
        this.cardHand.includeCard(card2);
        this.cardHand.includeCard(card3);

        // ----

        this.nodeAnimation = new ParallelAnimNode();

        let act1 =  new ActionAnimNode();
        act1.action = function() {console.log("A")};

        let act2 =  new ActionAnimNode();
        act2.action = function() {console.log("B")};
        
        let act3 =  new ActionAnimNode();
        act3.action = function() {console.log("C")};

        let act4 =  new ActionAnimNode();
        act4.action = function() {console.log("D")};

        let del1 = new DelayAnimNode(0);
        let del2 = new DelayAnimNode(0);
        let del3 = new DelayAnimNode(0);

        act1.nextNode = del1;
        del1.nextNode = act2;  del1.prevNode = act1;
        act2.nextNode = del2;  act2.prevNode = del1;
        del2.nextNode = act3;  del2.prevNode = act2;
        act3.nextNode = del3;  act3.prevNode = del2;
        del3.nextNode = act4;  del3.prevNode = act3;
                               act4.prevNode = del3;

        this.nodeAnimation.addBranchNode(act1);
        this.nodeAnimation.setNaturalDuration(); console.log(this.nodeAnimation.duration);
        this.nodeAnimation.initFowardPlay();
    }

    update(t, dt_ms) 
    {
        let dt = dt_ms / 1000; // Converting the delta time into seconds as many game engines do

        this.cardHand.update(dt);
        this.cardManager.update(dt);

        this.nodeAnimation.update(dt);
    }
}