import * as Phaser from 'phaser';
import { createPlayer, createAnimations, loadPlayer } from './player';
import { loadProjectiles, createProjectileAnimation, loadProjectileSound, createProjectileSound } from './projectile';
import { loadEnemies, spawnEnemy, trackPlayerAndMove, createEnemiesAnimations } from './enemy';
import { loadHearts, createHeartAnimation, drawUiMaxHearts, drawUiHearts, removeUiHeart, addUiHeart, addShield, removeUiShield, spawnHearts } from './heart';
import { loadDebuffs, createDebuffsAnimation, spawnDebuffs } from './debuffs';
import { loadBuffs, createBuffsAnimation, spawnBuffs } from './buffs';
import eventsCenter from './Phaser/Classes/UI/EventsCenter'
import EndMenu from './Phaser/Scenes/EndMenu';
import StartMenu from './Phaser/Scenes/StartMenu';
import OptionsMenu from './Phaser/Scenes/OptionsMenu';
import PauseMenu from './Phaser/Scenes/PauseMenu';
import Interface from './Phaser/Scenes/UI/Interface';


export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super('Game')
    }

/*     init (data)
    {
        this.playerType = data.playerType;
        this.selectedTokenId = data.selectedTokenId;
    } */

    preload (){
        this.load.audio('backgroundSound', 'src/assets/audio/background.mp3')
        loadPlayer(this, this.playerType)
        loadProjectiles(this)
        loadProjectileSound(this)
        loadEnemies(this)
        loadDebuffs(this)
        loadBuffs(this)
    }

    create() {
        //Start the UI scene
        this.scene.run('Interface')

        //Sets custom cursor
        this.input.setDefaultCursor('url(src/assets/images/crosshair/green_crosshair.cur), pointer');
        
        //Initialize physics system
        this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);

        //Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        //Create and play the background sound
        const backgroundSound = this.sound.add('backgroundSound', { loop: true });
        backgroundSound.play();

        //Initialize player variables
        this.playerType = 0; // Initial player type - 0 for Kraken, 1 for Mortis (maybe add more later)
        this.selectedTokenId = 420420; // Change if the player selects a different Kraken; 420420 is the default Kraken/Morti
        this.maxUiHearts = 10; // Player max hitpoints with buffs
        this.lastTimeSurvivedUpdate = 0; // Initialize to 0 the last time the player's timeSurvived was updated

        //Initialize enemies variables
        this.maxEnemiesOnScreen = 5; // Initial maximum number of enemies on the screen
        this.maxEnemyIncreaseInterval = 30000; // 30s interval for increasing enemies
        this.lastEnemyIncreaseTime = 0; // Initialize to 0

        //Initialize projectile variables
        this.projectileType = 0; // Default projectile type - can change with in game projectile pickups

        //Initialize heart variables
        this.maxHeartsOnScreen = 1; // Initial maximum number of hearts on the screen
        this.heartSpawnInterval = 30000; // 30s Initial interval for spawning hearts
        this.lastHeartSpawnTime = 0; // Initialize to 0

        //Initialize buffs variables
        this.maxBuffsOnScreen = 2; // Initial maximum number of buffs on the screen
        this.buffSpawnInterval = 35000; // 35s Initial interval for spawning buffs
        this.lastBuffSpawnTime = 0; // Initialize to 0

        //Initialize debuffs variables
        this.maxDebuffsOnScreen = 2; // Initial maximum number of debuffs on the screen
        this.debuffSpawnInterval = 25000; // 25s Initial interval for spawning debuffs
        this.lastDebuffSpawnTime = 0; // Initialize to 0

        //Create player and animates it
        this.player = createPlayer(this, screenWidth / 2, screenHeight / 2, this.playerType, this.selectedTokenId) // Create player object
        this.player.timeSurvived = 0; // Initialize the player's timeSurvived to 0
        if (this.selectedTokenId === 420420) {
            createAnimations(this, this.playerType, this.selectedTokenId)}; // Create player animations only if the player is using the default Kraken/Morti
        this.player.anims.play(('player' + this.playerType + this.selectedTokenId), true) 

        //Create player inputs
        this.player.setupKeys(this); // Setup player inputs

        //Create animations
        createEnemiesAnimations(this);
        createProjectileAnimation(this);
        createHeartAnimation(this);
        createDebuffsAnimation(this);
        createBuffsAnimation(this);

        //Create sounds
        createProjectileSound(this);

        //Initialize groups for collision detection and other purposes
        this.heartGameGroup = this.physics.add.group(); // Group for the hearts at the game
        this.enemiesGroup = this.physics.add.group(); // Group for the enemies
        this.projectilesGroup = this.physics.add.group(); // Group for the projectiles
        this.buffsGroup = this.physics.add.group(); // Group for the buffs
        this.debuffsGroup = this.physics.add.group(); // Group for the debuffs

        //Set collisions 
        this.physics.add.collider(this.enemiesGroup, this.player, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.collider(this.enemiesGroup, this.projectilesGroup, this.handleProjectileEnemyCollision, null, this);
        this.physics.add.collider(this.player, this.heartGameGroup, this.handlePlayerHeartCollision, null, this);
        this.physics.add.collider(this.player, this.buffsGroup, this.handlePlayerBuffCollision, null, this);
        this.physics.add.collider(this.player, this.debuffsGroup, this.handlePlayerDebuffCollision, null, this);

    }
    
    handlePlayerEnemyCollision () {
        for (let i = this.enemiesGroup.getChildren().length - 1; i >= 0; i--) {
            const enemy = this.enemiesGroup.getChildren()[i];
            const enemyDamage = enemy.damage;
            if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), this.player.getBounds())) {
                //removeUiHeart(this, enemyDamage);
                eventsCenter.emit('removeHeart', enemyDamage)
                enemy.destroy();
                this.player.receiveDamage(enemyDamage);
            }
        }
    }

    handlePlayerEnemyProjectileCollision () {
        for (let i = this.enemiesProjectilesGroup.getChildren().length - 1; i >= 0; i--) {
            const projectile = this.enemiesProjectilesGroup.getChildren()[i];
            const projectileDamage = projectile.damage;
            if (Phaser.Geom.Intersects.RectangleToRectangle(projectile.getBounds(), this.player.getBounds())) {
                // If player has shield, starts removing the shield and after the hearts
                if (this.player.shield > 0) {
                    const shieldValue = this.player.shield;

                    if (projectileDamage > shieldValue) {
                        this.player.shield = 0;
                        const remainingDamage = projectileDamage - shieldValue;

                        // Remove shield from UI
                        //removeUiShield(this, shieldValue);
                        eventsCenter.emit('removeShield', shieldValue)

                        // Remove hearts from UI and player hitpoints if there is remaining damage
                        if (remainingDamage > 0) {
                            //removeUiHeart(this, remainingDamage);
                            eventsCenter.emit('removeHeart', remainingDamage)
                            this.player.receiveDamage(remainingDamage);
                        }
                    } else {
                        this.player.shield -= projectileDamage;
                        //removeUiShield(this, projectileDamage);
                        eventsCenter.emit('removeShield', projectileDamage)
                    }

                } else {
                    //removeUiHeart(this, projectileDamage);
                    eventsCenter.emit('removeHeart', projectileDamage)
                    this.player.receiveDamage(projectileDamage);
                }
                
            }
        }
    }

    handlePlayerHeartCollision() {
        for (let i = this.heartGameGroup.getChildren().length - 1; i >= 0; i--) {
            const heart = this.heartGameGroup.getChildren()[i];

            if (Phaser.Geom.Intersects.RectangleToRectangle(heart.getBounds(), this.player.getBounds())) {
                // If player is not at max hitpoints increases max hitpoints and adds the heart to UI
                if (this.player.maxHitpoints < this.maxUiHearts) {
                this.player.maxHitpoints += heart.maxHitpointsIncrease
            
                // Update max hitpoints at UI
                //drawUiMaxHearts(this);
                eventsCenter.emit('drawUiMaxHearts')
            }

                // If player is not at max hitpoints increases hitpoints adds the heart to UI and 
                if (this.player.hitpoints < this.player.maxHitpoints) { 
                    this.player.hitpoints += heart.health;
                    //addUiHeart(this, heart.health, heart.type);
                    eventsCenter.emit('addUiHeart', heart.health, heart.type)
                }
                // Increases shield if player is not at max shield
                if (this.player.shield < this.player.maxShield) {
                    this.player.shield += heart.shield;
                    //addShield(this, heart.shield);
                    eventsCenter.emit('addShield', heart.shield)
                }     
                
                // Destroy the heart
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
                    projectile.isHit = true;
                    enemy.hitpoints -= projectile.damage
                    projectile.destroy();

                    // Check if enemy is dead and add XP to player
                    if (enemy.hitpoints <= 0) {
                        this.player.xpTracker += enemy.xpReward;
                        eventsCenter.emit('updateXp', this.player.xpTracker)
                        this.player.enemyKills += 1;
                        eventsCenter.emit('updateEnemyKills', this.player.enemyKills)
                        enemy.destroy();
                    }
                }
            }
        }
    }

/*     handlePlayerDebuffCollision() { //need to properly implement this
        for (let i = this.debuffsGroup.getChildren().length - 1; i >= 0; i--) {
            const debuff = this.debuffsGroup.getChildren()[i];
            const debuffDamage = debuff.getData('damage');
            if (Phaser.Geom.Intersects.RectangleToRectangle(debuff.getBounds(), this.player.getBounds())) {
                debuff.destroy();
                this.player.receiveDamage(debuffDamage);
            }
        }
    } */

    handlePlayerBuffCollision (){
        for (let i = this.buffsGroup.getChildren().length - 1; i >= 0; i--) {
            const buff = this.buffsGroup.getChildren()[i];
    
            if (Phaser.Geom.Intersects.RectangleToRectangle(buff.getBounds(), this.player.getBounds())) {
                // Increase max hitpoints
                this.player.maxHitpoints += buff.maxHitpointsIncrease;

                // Update max hitpoints at UI
                //drawUiMaxHearts(this);
                eventsCenter.emit('drawUiMaxHearts')
    
                if (this.player.hitpoints < this.player.maxHitpoints) {
                    this.player.hitpoints += buff.health;
                    //addUiHeart(this, buff.health);
                    eventsCenter.emit('addUiHeart', buff.health)
                }
                // Increases shield
                this.player.shield += buff.shield;
                //addShield(this, buff.shield);
                eventsCenter.emit('addShield', buff.shield)
    
                // Increases speed and damage multiplier
                this.player.speedMultiplier = buff.speed;
                this.player.damageMultiplier = buff.damage;
    
                // Sets a timer for the damage and velocity increase
                setTimeout(() => {
                    // Reset player speed to default
                    this.player.speedMultiplier = 1;
    
                    // Reset player damage to default
                    this.player.damageMultiplier = 1;
                }, buff.duration);
    
                buff.destroy();
            }
        }
    };

    handlePlayerTimeSurvived(currentTime) {  //need to properly implement this to ignore the loading time
        if (this.player.isPlayerAlive && !this.scene.isPaused('Game')) {
            const elapsedTime = currentTime - this.lastTimeSurvivedUpdate;

            // Update the player's timeSurvived
            this.player.timeSurvived += elapsedTime;
            eventsCenter.emit('updateTime', this.player.timeSurvived)
    
            // Update the lastTimeSurvivedUpdate
            this.lastTimeSurvivedUpdate = currentTime;
    
            // Calculate additional XP based on the time survived


        } else {
            this.lastTimeSurvivedUpdate = currentTime;
        }
    }
  
    update() {
        // Call the handlePlayerTimeSurvived passing the current time
        this.handlePlayerTimeSurvived(this.time.now);

        
        //Update the XP tracker
        //this.xpTrackerText.setText('XP: ' + this.player.xpTracker);
        
        //Update the Time survived tracker text
        //const timeSurvivedInSeconds = Math.floor(this.player.timeSurvived / 1000); // Convert to seconds
        //const formattedTimeSurvived = (timeSurvivedInSeconds % 60).toFixed(0); // Format to specified decimal places
        //this.timeSurvivedTrackerText.setText('Time Survived: ' + formattedTimeSurvived);

        //Player movements
        this.player.movePlayer(); // updade to increase velocity for buffs/debuffs
    
        //Shoot projectile towards mouse pointer
        this.player.playerControls(this);
      
        //Update enemies
        trackPlayerAndMove(this, this.enemiesGroup, this.projectilesGroup);

        //Call the spawnEnemy function to potentially spawn new enemies
        spawnEnemy(this, this.time.now);

        //Call the spawnAndUpdateHearts function to potentially spawn new hearts
        spawnHearts(this, this.time.now);

        //Call the spawnDebuffs function to potentially spawn new debuffs
        spawnDebuffs(this, this.time.now);

        //Call the spawnBuffs function to potentially spawn new buffs
        spawnBuffs(this, this.time.now);

    }
}

const config = {
    type: Phaser.AUTO,
    scene: [StartMenu, Game, PauseMenu, EndMenu],
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
    },
    fx: {
        glow: {
            distance: 20,
            quality: 0.1
        }
    },
    callbacks: { postBoot: (game) => { game.scene.dump() } }
}

const game = new Phaser.Game(config)


