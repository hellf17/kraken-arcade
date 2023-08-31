import * as Phaser from 'phaser';
import { playerType ,createPlayer, loadPlayer, Player } from './player';
import { projectileType,loadProjectiles, loadProjectileSound, createProjectileSound, Projectile} from './projectile';
import { loadEnemies, spawnEnemy, trackPlayerAndMove } from './enemy';
import { Heart, loadHearts, drawUiHeart, removeUiHeart, addUiHeart, spawnHearts } from './heart';
improt



export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super('game')

        //Initialize player variables
        this.playerType = this.playerType(Type1); // Initial player type - 1 for Kraken, 2 for Mortis (maybe add more later)

        //Initialize enemies variables
        this.maxEnemiesOnScreen = 5; // Initial maximum number of enemies on the screen
        this.maxEnemyIncreaseInterval = 30000; // Initial interval for increasing enemies
        this.lastEnemyIncreaseTime = 0; // Initialize to 0

        //Initialize projectile variables
        this.projectileType = projectileType(Type1); // Default projectile type - can change with buffs/debuffs

        //Initialize heart variables
        this.heartSpawnInterval = 30000; // Initial interval for spawning hearts
        this.maxHeartsOnScreen = 1; // Initial maximum number of hearts on the screen
        this.lastHeartSpawnTime = 0; // Initialize to 0

        //Initialize buffs variables
        this.buffs = []; // Array to store active buffs

        //Initialize debuffs variables
        this.debuffs = []; // Array to store active debuffs
    }

    preload (){
        this.load.image('background', 'src/assets/images/backgrounds/background1.png')
        this.load.audio('backgroundSound', 'src/assets/audio/background.mp3')
        loadPlayer(this)
        loadProjectiles(this)
        loadProjectileSound(this)
        loadEnemies(this)
        loadHearts(this)
        //loadBuffs(this)
        //loadDebuffs(this)
    }

    create() {
        //Sets custom cursor
        this.input.setDefaultCursor('url(src/assets/images/crosshair/green_crosshair.cur), pointer');
        
        //Initialize physics system
        this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

        //Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        //Load the background image
        const background = this.add.image(0, 0, 'background');

        //Calculate a single scale factor to fit the image proportionally
        const scale = Math.max(screenWidth / background.width, screenHeight / background.height);

        //Apply the scale factor to resize the background image
        background.setScale(scale);

        //Position the image at the center
        background.setPosition(screenWidth / 2, screenHeight / 2);

        //Create and play the background sound
        const backgroundSound = this.sound.add('backgroundSound', { loop: true });
        backgroundSound.play();

        //Create player and animates it
        this.player = createPlayer(this, screenWidth / 2, screenHeight / 2, this.playerType)
        this.player.anims.play(('player' + this.playerType), true)
        this.player.setCollideWorldBounds(true);
                        
        //Create the projectile groups and sound
        this.projectilesGroup = this.physics.add.group();
        createProjectileSound(this);

        //Create enemies group and set collisions with the player and projectiles
        this.enemiesGroup = this.physics.add.group();
        this.physics.add.collider(this.enemiesGroup, this.player, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.enemiesGroup, this.projectiles, this.handleProjectileEnemyCollision, null, this);

        //Create player input
        this.player.setupKeys(this);
        this.player.movePlayer();

        //Create inital UI hearts group
        this.heartsUiGroup = this.physics.add.group();
        drawUiHeart(this);

        //Create hearts group and set collisions with the player
        this.heartGameGroup = this.physics.add.group();
        this.physics.add.collider(this.player, this.heartGameGroup, this.handlePlayerHeartCollision, null, this);
                

        //Create and draw the XP tracker text
        this.xpTrackerText = this.add.text(screenWidth - 150, 20, 'XP: 0', {
            fontFamily: 'Arial',
            fontSize: '25px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
            }
        );
        
        //Create and draw the time survived tracker text
        this.timeSurvivedTrackerText = this.add.text(20, 20, 'Time Survived: 0', {
            fontFamily: 'Arial',
            fontSize: '25px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
            }
        );
    }

    handlePlayerEnemyCollision (){
        for (let i = this.enemiesGroup.getChildren().length - 1; i >= 0; i--) {
            const enemy = this.enemiesGroup.getChildren()[i];
            const enemyDamage = enemy.getData('damage');
            if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), this.player.getBounds())) {
                removeUiHeart(this, enemyDamage);
                enemy.destroy();
                this.player.receiveDamage(enemyDamage);
            }
        }
    }

    handlePlayerHeartCollision() {
        for (let i = this.heartGameGroup.getChildren().length - 1; i >= 0; i--) {
            const heart = this.heartGameGroup.getChildren()[i];
            const heartHealth = heart.getData('health');
            const heartShield = heart.getData('shield');
            const heartMaxHitpointsIncrease = heart.getData('maxHitpointsIncrease');

            if (Phaser.Geom.Intersects.RectangleToRectangle(heart.getBounds(), this.player.getBounds())) {
                if (this.player.hitpoints < this.player.maxHitpoints) { // If player is not at max hitpoints adds the heart to UI and increases hitpoints
                    this.player.hitpoints += heartHealth;
                    addUiHeart(this, heart);
                }
                this.player.shield += heartShield;
                this.player.maxHitpoints += heartMaxHitpointsIncrease;             
                heart.destroy();           
            }
        }
    }

    handleProjectileEnemyCollision (){
        for (let i = this.enemiesGroup.getChildren().length - 1; i >= 0; i--) {
            const enemy = this.enemiesGroup.getChildren()[i];
            for (let j = this.projectilesGroup.getChildren().length - 1; j >= 0; j--) {
                const projectile = this.projectilesGroup.getChildren()[j];
                const enemyBounds = enemy.getBounds();
                const projectileBounds = projectile.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(enemyBounds, projectileBounds)) {
                    // Enemy is hit by projectile
                    enemy.receiveDamage(projectile.damage); 
                    projectile.destroy();

                    // Check if enemy is dead and add XP to player
                    if (enemy.hitpoints <= 0) {
                        this.player.xpTracker += enemy.xpReward;
                    }
                }
            }
        }
    }
  
    update(time) {
        // Call timeTracker function at 1-second intervals
        if (time - (this.lastTimeTrackerCall || 0) >= 500) {
            this.player.timeTracker();
            this.lastTimeTrackerCall = time;
        }

        //Update the XP tracker
        this.xpTrackerText.setText('XP: ' + this.player.xpTracker);
        
        //Update the Time survived tracker text
        const timeSurvivedInSeconds = Math.floor(this.player.timeSurvived / 1000); // Convert to seconds
        const formattedTimeSurvived = (timeSurvivedInSeconds % 60).toFixed(0); // Format to specified decimal places
        this.timeSurvivedTrackerText.setText('Time Survived: ' + formattedTimeSurvived);

        //Player movements
        this.player.movePlayer(this); // Move player; can pass multiveloc to increase velocity for buffs/debuffs
    
        //Shoot projectile towards mouse pointer
        this.player.playerAttacks(this);

        // Update player instance
        this.player.update();
      
        //Check if projectile is out of bounds and destroy it


        //Update enemies
        trackPlayerAndMove(this, this.enemiesGroup, this.projectiles);

        //Call the spawnEnemy function to potentially spawn new enemies
        spawnEnemy(this, this.time.now);

        //Call the spawnAndUpdateHearts function to potentially spawn new hearts
        spawnHearts(this, this.time.now);

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
