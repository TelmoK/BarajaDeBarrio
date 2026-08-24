import { SPRITES_ASSET_KEYS } from "../utils/asset_keys.js";

import { PlayableCard } from "../systems/card_system/playable_card.js";
import { TableElementArea } from "../systems/card_system/table_element_area.js";
import { CardHandArea } from "../systems/card_system/card_hand_area.js";
import { CardManager } from "../systems/card_system/card_manager.js";
import { TableManaCard } from "../systems/card_system/table_mana_card.js";
import { ManaCoinWidget } from "../systems/card_system/mana_coin_widget.js";

import { ParallelAnimNode } from "../systems/animation_system/parallel_anim_node.js";
import { DelayAnimNode } from "../systems/animation_system/delay_anim_node.js";
import { ActionAnimNode } from "../systems/animation_system/action_anim_node.js";
import { TweenAnimNode } from "../systems/animation_system/tween_anim_node.js";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        //super({ key: KEYS_SCENES.PRELOAD });
        super();
    }

    init(data) {

    }

    preload() {
        this.load.image(SPRITES_ASSET_KEYS.TEST_CARD, "assets/test/test_card.png");
        this.load.image(SPRITES_ASSET_KEYS.TEST_MANA_CARD, "assets/test/test_mana_card.png");
        this.load.image(SPRITES_ASSET_KEYS.TEST_CHARACTER_CARD, "assets/test/test_character_card.png");
        this.load.image(SPRITES_ASSET_KEYS.TEST_CARD_COUNT_CIRCLE, "assets/test/card_count_circle.png");
        /*this.load.spritesheet(KEYS_ASSETS_SPRITES.CARD_ATLAS, "assets/card/card_atlas.png", {frameWidth: 318, frameHeight: 244});

        this.load.image(KEYS_ASSETS_SPRITES.TURN_EXECUTION_RING_BUTTON_RELEASE, "assets/turn_ring_button/finish_turn_button_released.png");

        this.load.plugin(KEYS_SHADER_PIPELINES.rexcrtpipelineplugin, 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcrtpipelineplugin.min.js', true);
        this.load.plugin(KEYS_SHADER_PIPELINES.rextoonifypipelineplugin, 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextoonifypipelineplugin.min.js', true);*/
    }

    create(data) {
       /* this.scene.start(KEYS_SCENES.MAIN_MENU);
        this.scene.stop();*/
        this.manaCoinWidget = new ManaCoinWidget(this, 50, 200);
        this.add.existing(this.manaCoinWidget);
        this.manaCoinWidget.addManaCoin();
        this.manaCoinWidget.addManaCoin();
        this.manaCoinWidget.addManaCoin();
        this.manaCoinWidget.addManaCoin();

        let actionCardInfo = {
            cardType: "Character Card",
            name: "Matón",
            manaCost: "t3",
            imgScrKey: "bully-character.png",
            description: "Bullies everyone ...",
            hp: 5,
            attack: 3
        };

        let manaCardInfo = {
            cardType: "Mana Card",
            name: "Industriales",
            manaTypeName: "Tabaco",
            imgScrKey: "cigarette-pack.png"
        };

        // ---

        this.actionCardArea = new TableElementArea(this, 640, 370);
        this.add.existing(this.actionCardArea);

        // ---

        this.manaCardArea = new TableElementArea(this, 10, 510);
        this.manaCardArea.originX = 0;
        this.add.existing(this.manaCardArea);

        let tableManaCard = new TableManaCard(this, 200, 400);
        tableManaCard.cardInfo = manaCardInfo;
        this.add.existing(tableManaCard);
        
        let tableManaCard2 = new TableManaCard(this, 200, 400);
        tableManaCard2.cardInfo = manaCardInfo;
        this.add.existing(tableManaCard2);
        
        let tableManaCard3 = new TableManaCard(this, 200, 400);
        tableManaCard3.cardInfo = manaCardInfo;
        this.add.existing(tableManaCard3);
        this.a = tableManaCard3;

        this.manaCardArea.includeElem(tableManaCard);
        this.manaCardArea.includeElem(tableManaCard2);
        this.manaCardArea.includeElem(tableManaCard3);

        // ---

        this.cardHand = new CardHandArea(this, 640, 670);
        this.cardHand.arcFactor = 5;
        this.add.existing(this.cardHand);

        this.cardManager = new CardManager(this, this.cardHand, this.manaCardArea, this.actionCardArea);
        this.add.existing(this.cardManager);

        let card = this.cardManager.instanceCard(0, 0);
        let card2 = this.cardManager.instanceCard(300, 0);
        let card3 = this.cardManager.instanceCard(600, 0);
        let card4 = this.cardManager.instanceCard(700, 0);

        card.cardInfo = manaCardInfo;
        card2.cardInfo = manaCardInfo;
        card3.cardInfo = actionCardInfo;
        card4.cardInfo = actionCardInfo;

        this.cardHand.includeCard(card);
        this.cardHand.includeCard(card2);
        this.cardHand.includeCard(card3);
        this.cardHand.includeCard(card4);

    }

    update(t, dt_ms) 
    {
        let dt = dt_ms / 1000; // Converting the delta time into seconds as many game engines do

        this.cardHand.update(dt);
        this.manaCardArea.update(dt);
        this.actionCardArea.update(dt);
        this.manaCoinWidget.update(dt);

        this.cardManager.update(dt);

        if(t > 8000)
            this.a.angle = 20;
    }
}