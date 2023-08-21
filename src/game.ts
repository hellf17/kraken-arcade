import * as Phaser from 'phaser';
import { createPlayer, loadPlayer } from './player';
import { createProjectile, loadProjectileSound, loadProjectiles } from './projectile';

export default class Game extends Phaser.Scene
{
  player
	enemies = []
  projectiles = []
  projectileSound
  hearts = []
  buffs = []
  debuffs = []


    constructor ()
    {
        super('game')
    }

    preload (){
        this.load.image('background', 'assets/images/backgrounds/background1.png')
        this.load.audio('backgroundSound', 'assets/audio/background.mp3')
        this.load.audio('projectileSound', 'assets/audio/projectile.mp3')
        loadPlayer(this)
        loadProjectiles(this)
        //loadProjectileSound(this)
        //loadEnemies(this)
        //loadHearts(this)
        //loadBuffs(this)
        //loadDebuffs(this)
    }

    create() {      
      // Get screen dimensions
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // Load the background image
      const background = this.add.image(0, 0, 'background')

      // Calculate a single scale factor to fit the image proportionally
      const scale = Math.max(screenWidth / background.width, screenHeight / background.height)

      // Apply the scale factor to resize the background image
      background.setScale(scale)

      // Position the image at the center
      background.setPosition(screenWidth / 2, screenHeight / 2)

      // Load and play the background sound
      const backgroundSound = this.sound.add('backgroundSound', { loop: true });
      backgroundSound.play();
      
      // Load and play the background sound
      this.projectileSound = this.sound.add('projectileSound', { loop: false });

            // Create player and animates it
      this.player = createPlayer(this, screenWidth / 2, screenHeight / 2)
      this.player.anims.play('player', true)
      this.player.setCollideWorldBounds(true);

      // Initialize player inputs
      this.keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        ulti: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
      this.pointer = this.input.activePointer
     
    // Create enemies and animates it; enemies must spawn from the borders of the screen
	  //this.enemies = createEnemy(this)
	  //this.enemies.setRandomPosition()

	  //Set player and enemies/projectiles colliders
    }

    update() {
      // Player movements
      const baseVeloc = 150;
      let velocityX = 0;
      let velocityY = 0;
  
      if (this.keys.left.isDown) {
          velocityX = -baseVeloc;
      } 
      if (this.keys.right.isDown) {
          velocityX = baseVeloc;
      }
      if (this.keys.down.isDown) {
          velocityY = baseVeloc;
      } 
      if (this.keys.up.isDown) {
          velocityY = -baseVeloc;
      }
    
      // Set player velocity based on input
      this.player.setVelocity(velocityX, velocityY);
    
      // Shoot projectile towards mouse pointer
      if (this.input.activePointer.leftButtonDown() && this.pointer.getDuration() >= 50 && this.pointer.getDuration() <= 70) {
      const mouseX = this.input.activePointer.x;
      const mouseY = this.input.activePointer.y;

      // Calculate direction vector
      const directionX = mouseX - this.player.x;
      const directionY = mouseY - this.player.y;

      // Normalize the direction vector
      const length = Math.sqrt(directionX * directionX + directionY * directionY);
      const normalizedDirectionX = directionX / length;
      const normalizedDirectionY = directionY / length;

      // Set velocity for the projectile using the normalized direction
      const projectileSpeed = 500; // Adjust as needed
      const projectile = createProjectile(this, this.player.x, this.player.y);
      projectile.setVelocity(projectileSpeed * normalizedDirectionX, projectileSpeed * normalizedDirectionY);

      // Play the projectile sound
      this.projectileSound.play();
      
      // Add the projectile to the array of active projectiles
      this.projectiles.push(projectile);
    }
      
      // Check if projectiles are out of screen bounds and remove them
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const projectile = this.projectiles[i];
        if (projectile.x < 0 || projectile.x > this.game.config.width || projectile.y < 0 || projectile.y > this.game.config.height) {
            // Remove the projectile from the array and destroy it
            this.projectiles.splice(i, 1);
            projectile.destroy();
        }
      }
	     //Check for collisions between player/enemies/projectiles; projectile and enemies must disappear from screen after collision
        
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
