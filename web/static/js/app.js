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
class BootState extends Phaser.State {
	preload() {
		this.game.load.image('progressBar', 'images/progressBar.png')
	}
	create() {
		this.game.stage.backgroundColor = '#304040'
		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		this.game.state.start('load')
	}
}

class LoadState extends Phaser.State {
	preload() {
		// Add a loading label
		var loadingLabel = this.game.add.text(this.game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' })
		loadingLabel.anchor.setTo(0.5, 0.5)

		// Add a progress bar
		var progressBar = this.game.add.sprite(this.game.world.centerX, 200, 'progressBar')
		progressBar.anchor.setTo(0.5, 0.5)
		this.game.load.setPreloadSprite(progressBar)

		// Load all assets
		this.game.load.spritesheet('mute', 'images/muteButton.png', 28, 22)
		// ...
	}

	create() {
		this.game.state.start('menu')
	}
}

class PlayState extends Phaser.State {
	preload() {
		this.game.load.image('bat', 'images/bat.svg')
		this.game.load.image('ghost', 'images/ghost.svg')
		this.game.load.image('pumpkin', 'images/pumpkin.svg')
	}

	onDestroySprite(sprite, pointer) {
		console.log(this.game)
		this.game.score += 1
		this.scoreLabel.text = "Score: " + this.game.score
		sprite.destroy()
	}

	spriteFactory(sprite_name){
		let scaleFactor = 0.2
		let spriteWidth = this.game.cache.getImage(sprite_name).width * scaleFactor
		let spriteHeight = this.game.cache.getImage(sprite_name).height * scaleFactor
		let mx = this.game.width - spriteWidth
    let my = this.game.height - spriteHeight
		let randomX = this.game.rnd.integerInRange(0, mx)
		let randomY = this.game.rnd.integerInRange(0, my)
    let sprite = this.game.add.sprite(randomX, randomY, sprite_name)
		sprite.anchor.setTo(0.5, 0.5)
		this.game.physics.arcade.enable(sprite)
		sprite.body.gravity.y = 10
		sprite.scale.set(scaleFactor)
    sprite.inputEnabled = true
		sprite.checkWorldBounds = true;
		sprite.outOfBoundsKill = true;
		//sprite.input.pixelPerfectOver = true
    //sprite.input.useHandCursor = true
    sprite.events.onInputDown.add(this.onDestroySprite, this)
		return sprite
	}

	create() {
		// score
		this.scoreLabel = this.game.add.text(40, 20, 'Score: ' + this.game.score, { font: '25px Arial', fill: '#ffffff' })
		//this.scoreLabel.anchor.set(0.5)

		let sprites = ['bat', 'ghost', 'pumpkin']
		sprites.forEach( sprite => {
			for (var i = 0; i < 5; i++)
	    {
				this.spriteFactory(sprite)
			}
		})

		this.timer = this.time.create(false)
    this.timer.add(5000, this.timeUp, this)
    this.timer.start()
	}

	timeUp() {
		this.game.high_score = this.game.score
		this.game.score = 0
		this.game.state.start('menu')
	}

	update() {
		// this.bat.angle += 0.5
	}

	// render() {
	// 	game.debug.spriteInputInfo(this.bat, 32, 32)
  //   game.debug.geom(this.bat.input._tempPoint);
	// }


}

class MenuState extends Phaser.State {
	create() {
		// Name of the game
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		var nameLabel = this.game.add.text(center.x-40, 190, 'Halloween Pumpkin Smash', { font: '50px Arial', fill: '#ffffff' })
		this.game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start()
		nameLabel.anchor.set(0.5)

		// High Score
		var highScoreLabel = this.game.add.text(center.x-40, 390, 'High Score: ' + this.game.high_score, { font: '25px Arial', fill: '#ffffff' })
		this.game.add.tween(highScoreLabel).to({y: 180}, 200).easing(Phaser.Easing.Bounce.Out).start()
		highScoreLabel.anchor.set(0.5)

		// How to start the game
		var startLabel = this.game.add.text(center.x-30, this.game.world.height-80, 'press SPACEBAR to start', { font: '25px Arial', fill: '#ffffff' })
		startLabel.anchor.setTo(0.5, 0.5)
		this.game.add.tween(startLabel)
								 .to({angle: -2}, 500)
								 .to({angle: 2}, 500)
								 .loop()
								 .start()

		// Add a mute button
		this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound, this)
		this.muteButton.input.useHandCursor = true
		if (this.game.sound.mute) {
			this.muteButton.frame = 1
		}

		// Start the game when the up arrow key is pressed
		// this.input.onDown.addOnce(this.start, this)
		var key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		key.onDown.addOnce(this.start, this)
	}

	toggleSound() {
		this.game.sound.mute = ! this.game.sound.mute
		this.muteButton.frame = this.game.sound.mute ? 1 : 0
	}

	start() {
		this.game.state.start('play')
	}
}

class Game extends Phaser.Game {

	// Initialize Phaser
	constructor(width, height, container) {
		super(width, height, Phaser.AUTO, container, null)
		this.state.add('boot', new BootState(), false)
		this.state.add('load', new LoadState(), false)
		this.state.add('menu', new MenuState(), false)
		this.state.add('play', new PlayState(), false)

		// Our 'global' variable
		this.high_score = 0
		this.score = 0

		// Start the "boot" state
		this.state.start('boot')
	}

}

// Lets go!
new Game(730, 450, 'gameDiv')
