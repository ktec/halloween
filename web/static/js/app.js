// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "deps/phoenix_html/web/static/js/phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
class BootState {
	preload() {
		game.load.image('progressBar', 'images/progressBar.png')
	}
	create() {
		game.stage.backgroundColor = '#304040'
		game.physics.startSystem(Phaser.Physics.ARCADE)

		game.state.start('load')
	}
}

class LoadState {
	preload() {
		// Add a loading label
		var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' })
		loadingLabel.anchor.setTo(0.5, 0.5)

		// Add a progress bar
		var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar')
		progressBar.anchor.setTo(0.5, 0.5)
		game.load.setPreloadSprite(progressBar)

		// Load all assets
		game.load.spritesheet('mute', 'images/muteButton.png', 28, 22)
		// ...
	}

	create() {
		game.state.start('menu')
	}
}

class PlayState {
	preload() {
		game.load.image('bat', 'images/bat.svg')
		game.load.image('ghost', 'images/ghost.svg')
		game.load.image('pumpkin', 'images/pumpkin.svg')
	}

	onDown(sprite, pointer) {
	 // do something wonderful here
	 alert('got here')
	}

	create() {
		let bat = game.add.sprite(game.world.centerX, game.world.centerY, 'bat')
		bat.anchor.setTo(0.5, 0.5)
		bat.scale.set(0.2)
    bat.smoothed = false
		bat.inputEnabled = true
		bat.input.pixelPerfectOver = true
    bat.input.useHandCursor = true
		bat.events.onInputDown.add(this.onDown,this)
		this.bat = bat
	}

	update() {
//		this.bat.angle += 5
		// this.bat.scale += 1
	}

	// render() {
	// 	game.debug.spriteInputInfo(this.bat, 32, 32)
  //   game.debug.geom(this.bat.input._tempPoint);
	// }


}

class MenuState {
	create() {
		// Name of the game
		var nameLabel = game.add.text(game.world.centerX, 80, 'Halloween Punkin Smash', { font: '50px Arial', fill: '#ffffff' })
		nameLabel.anchor.setTo(0.5, 0.5)

		// How to start the game
		var startLabel = game.add.text(game.world.centerX, game.world.height-80, 'press the SPACEBAR to start', { font: '25px Arial', fill: '#ffffff' })
		startLabel.anchor.setTo(0.5, 0.5)
		game.add.tween(startLabel).to({angle: -2}, 500).to({angle:2}, 500).loop().start()

		// Add a mute button
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this)
		this.muteButton.input.useHandCursor = true
		if (game.sound.mute) {
			this.muteButton.frame = 1
		}

		// Start the game when the up arrow key is pressed
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		upKey.onDown.addOnce(this.start, this)
	}

	toggleSound() {
		game.sound.mute = ! game.sound.mute
		this.muteButton.frame = game.sound.mute ? 1 : 0
	}

	start() {
		game.state.start('play')
	}
}

// Initialize Phaser
var game = new Phaser.Game(730, 450, Phaser.AUTO, 'gameDiv')

// Our 'global' variable
game.global = {
	score: 0,
	// Add other global variables
}

// Define states
game.state.add( 'boot', new BootState() );
game.state.add( 'load', new LoadState() );
game.state.add( 'menu', new MenuState() );
game.state.add( 'play', new PlayState() );

// Start the "boot" state
game.state.start('boot')
