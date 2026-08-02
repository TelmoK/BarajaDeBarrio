import PreloadScene from './scenes/preload_scene.js';

let config = {
	type: Phaser.AUTO,
	parent: 'game-container',
	width: 1280,
	height: 640,
	pixelArt: false,
	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,

		mode: Phaser.Scale.FIT,
		min: {
			width: 640,
			height: 300
		},
		max: {
			width: 1280,
			height: 640
		},
		zoom: 1

	},
	scene: [PreloadScene/*,*/ ],

	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 10 },
			debug: true,
			fps: 120
		},

		checkCollision: {
			up: true,
			down: true,
			left: true,
			right: true
		}

	},
	input: {
        gamepad: true
    },

	title: "Paranoid Pedro",
	version: "1.0.0"

};

new Phaser.Game(config);