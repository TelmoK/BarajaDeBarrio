import { SPRITES_ASSET_KEYS } from "../utils/asset_keys.js";
import { PlayableCard } from "../systems/card_system/playable_card.js";
import { CardConatinerArea } from "../systems/card_system/card_container_area.js";
import { CardManager } from "../systems/card_system/card_manager.js";

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

        this.load.image(KEYS_ASSETS_SPRITES.BATTLE_SCENE_BACKGROUND, "assets/battle-scene-background.png");

        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D4, "assets/dice/dice_d4.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D6, "assets/dice/dice_d6.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D8, "assets/dice/dice_d8.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D10, "assets/dice/dice_d10.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D12, "assets/dice/dice_d12.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_TYPE_D20, "assets/dice/dice_d20.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_BOX, "assets/dice/dice_box.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_BOX_SELECTION_FRAME, "assets/dice/dice_box_selection.png");
        this.load.image(KEYS_ASSETS_SPRITES.DICE_BOX_CONTAINER, "assets/dice/dice_box_container.png");

        this.load.image(KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_PRESSED, "assets/turn_ring_button/finish_turn_button_pressed.png");
        this.load.image(KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_RELEASE, "assets/turn_ring_button/finish_turn_button_released.png");

        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ANGER_ICON, "assets/emotion_stack/anger_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_HAPPINESS_ICON, "assets/emotion_stack/happiness_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CALM_ICON, "assets/emotion_stack/calm_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CONCERN_ICON, "assets/emotion_stack/concern_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_CONFIDENCE_ICON, "assets/emotion_stack/confidence_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_ECSTASY_ICON, "assets/emotion_stack/ecstasy_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_FEAR_ICON, "assets/emotion_stack/fear_icon.png");
        this.load.image(KEYS_ASSETS_SPRITES.EMOTION_SADNESS_ICON, "assets/emotion_stack/sadness_icon.png");

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
    }

    update(t, dt_ms) 
    {
        let dt = dt_ms / 1000; // Converting the delta time into seconds as many game engines do

        this.cardHand.update(dt);
        this.cardManager.update(dt);
    }
}