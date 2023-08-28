import * as Phaser from 'phaser';
import { createPlayer, loadPlayer, Player } from './player';
import { loadProjectiles, loadProjectileSound, createProjectileSound } from './projectile';
import { loadEnemies, spawnEnemy, trackPlayerAndMove } from './enemy';


export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super('game')

        // Initialize player variables
        this.playerType = 0; // Initial player type

        // Initialize enemies variables
        this.maxEnemiesOnScreen = 5; // Initial maximum number of enemies on the screen
        this.maxEnemyIncreaseInterval = 30000; // Initial interval for increasing enemies
        this.lastEnemyIncreaseTime = 0; // Initialize to 0
        this.enemies = []; // Array to store enemy instances

        // Initialize projectile variables
        this.projectiles = []; // Array to store active projectiles

        // Initialize heart variables
        this.hearts = []; // Array to store active hearts

        // Initialize buff and debuff variables
        this.buffs = []; // Array to store active buffs
        this.debuffs = []; // Array to store active debuffs
    }

    preload (){
        this.load.image('background', 'src/assets/images/backgrounds/background1.png')
        this.load.audio('backgroundSound', 'src/assets/audio/background.mp3')
        loadPlayer(this)
        loadProjectiles(this)
        loadProjectileSound(this)
        loadEnemies(this)
        //loadHearts(this)
        //loadBuffs(this)
        //loadDebuffs(this)
    }

    create() {      
    // Initialize physics system
    this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

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

    // Create and play the background sound
    const backgroundSound = this.sound.add('backgroundSound', { loop: true });
    backgroundSound.play();

    // Create and draw the XP tracker text
    this.xpTrackerText = this.add.text(screenHeight - 10, 5, 'XP: 0', {
        fontFamily: 'Arial',
        fontSize: '30px',
        color: '#000000',
        stroke: '#ffffff',
        strokeThickness: 2,
        fontStyle: 'bold'
    });
         
    // Create the projectile sound
    createProjectileSound(this);

    // Create player and animates it
    this.player = createPlayer(this, screenWidth / 2, screenHeight / 2, this.playerType)
    this.player.anims.play('player', true)
    this.player.setCollideWorldBounds(true);
     
    // Create enemies group and set collisions with the player and projectiles
    this.enemiesGroup = this.physics.add.group();
    this.physics.add.collider(this.enemiesGroup, this.player, this.handlePlayerEnemyCollision, null, this);
    this.physics.add.collider(this.enemiesGroup, this.projectiles, this.handleProjectileEnemyCollision, null, this);
      
    // Create player input
    this.player.setupKeys(this);
    this.player.movePlayer();
    }

    handlePlayerEnemyCollision (player, enemy){
        for (let i = this.enemiesGroup.getChildren().length - 1; i >= 0; i--) {
            const enemy = this.enemiesGroup.getChildren()[i];
            const enemyDamage = enemy.getData('damage');
            if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), player.getBounds())) {
                enemy.destroy();
                player.receiveDamage(enemyDamage);
            }
        }
    }

    handleProjectileEnemyCollision (enemy, projectile){
        for (let i = this.enemiesGroup.getChildren().length - 1; i >= 0; i--) {
            const enemy = this.enemiesGroup.getChildren()[i];
            for (let j = this.projectiles.length - 1; j >= 0; j--) {
                const projectile = this.projectiles[j];
                const enemyBounds = enemy.getBounds();
                const projectileBounds = projectile.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(enemyBounds, projectileBounds)) {
                    // Enemy is hit by projectile
                    enemy.receiveDamage(1); // need to implement the projectile class and damage property to it
                    this.projectiles.splice(j, 1);
                    projectile.destroy();

                    // Check if enemy is dead and add XP to player
                    if (enemy.hitpoints <= 0) {
                        this.player.xpTracker += enemy.xpReward;
                    }
                }
            }
        }
    }
  
    update() {
        //Update the XP tracker
        this.xpTrackerText.setText('XP: ' + this.player.xpTracker);
        
        //Player movements
        this.player.movePlayer();
    
        //Shoot projectile towards mouse pointer
        this.player.playerAttacks(this);
      
        //Check if projectiles are out of screen bounds and remove them
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            if (projectile.x < 0 || projectile.x > this.game.config.width || projectile.y < 0 || projectile.y > this.game.config.height) {
                // Remove the projectile from the array and destroy it
                this.projectiles.splice(i, 1);
                projectile.destroy();
            }
        }

        //Update enemies
        trackPlayerAndMove(this, this.enemiesGroup, this.projectiles);

        //Call the spawnEnemy function to potentially spawn new enemies
        spawnEnemy(this, this.time.now);

        //Handle player dying
        //if (this.player.isAlive === false) {
        //this.scene.start('game-over');}
    }
}

const config = {
    type: Phaser.AUTO,
    scene: Game,
    scale: {
      width: '100%',
      height: '100%',
      mode: Phaser.Scale.RESIZE,
    },
    physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: {y: 0}
        }
    }
}

const game = new Phaser.Game(config)
