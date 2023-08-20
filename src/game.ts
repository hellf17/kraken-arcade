import * as Phaser from 'phaser';
import { createPlayer, loadSprites } from './player';

export default class Game extends Phaser.Scene
{
    player;
    constructor ()
    {
        super('game');
    }

    preload (){
        this.load.image('background', 'assets/images/backgrounds/background1.png')
        loadSprites(this)
    }

    create() {      
      // Get screen dimensions
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Load the background image
      const background = this.add.image(0, 0, 'background');

      // Calculate a single scale factor to fit the image proportionally
      const scale = Math.max(screenWidth / background.width, screenHeight / background.height);

      // Apply the scale factor to resize the background image
      background.setScale(scale);

      // Position the image at the center
      background.setPosition(screenWidth / 2, screenHeight / 2);

      // Create player and animates it
      this.player = createPlayer(this, screenWidth / 2, screenHeight / 2)
      this.player.anims.play('player', true)

      // Initialize input
      cursors = this.input.keyboard.createCursorKeys();

      //Set player and enemies/projectiles colliders
    }

    update() {
      if (cursors.left.isDown){
        this.player.setVelocityX(-160)
      }
      else (cursors.right.isDown){
        this.player.setVelocityX(160)
      }
      if (cursors.up.isDown){
        this.player.setVelocityY(-160)
      }
      else (cursors.down.isDown){
        this.player.setVelocityY(160)
      }
    }
}

const config = {
    type: Phaser.AUTO,
    scene: Game,
    scale: {
      width: '100%',
      height: '100%',
      mode: Phaser.Scale.RESIZE,
    }
    physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: {y: 0}
        }
    }
}

const game = new Phaser.Game(config)
