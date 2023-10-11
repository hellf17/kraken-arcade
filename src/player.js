import * as Phaser from 'phaser'
import eventsCenter from './Phaser/Classes/UI/EventsCenter'
import { playProjectileAnimation, playProjectileSound, playUltimateSound, createProjectile, createUltimate } from './projectile';
import { getTopStats } from './localDataStorage';

const playerType = {
    Type1: 0,
    Type2: 1
};

//Load player spritesheet
const loadPlayer = (scene, type, tokenId) => {
    scene.load.spritesheet(
        'player' + type + tokenId,
        'src/assets/images/spritesheets/player/kraken/sheet' + tokenId + '.png', // Kraken spritesheet
        { frameWidth: 64, frameHeight: 64 }
    );
};

//Create player animations
const createAnimations = (scene, type, tokenId) => {
    scene.anims.create({
        key: 'player' + type + tokenId,
        frames: scene.anims.generateFrameNames('player' + type + tokenId, { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1,
        yoyo: true
    });
};

//Create player
const createPlayer = (scene, screenX, screenY, type, tokenId) => {
    const player = new Player(scene, screenX, screenY, type, tokenId);

    return player;
};

//Player class
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, tokenId) {
        super(scene, x, y, 'player' + type + tokenId);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
  
        this.tokenId = tokenId;
        this.isPlayerAttacking = false;
        this.isPlayerAlive = true;
        this.isPlayerHit = false;
        this.isPlayerInvencible = false;
        this.isPlayerUltimateReady = false;
        this.fireRateType = 1; // 0 is the fire rate for the normal shot, 1 for automatic shot
        this.damageMultiplier = 1; // 1 is the normal damage, buffs/debuffs can change this value
        this.speedMultiplier = 1; // 1 is the normal speed, buffs/debuffs can change this value
        this.ultimatesUsed = 0; // Number of ultimates used by the player

        this.xpTracker = 0;
        this.timeSurvived = 0;
        this.enemyKills = 0;
        
        // Gets the kraken total deaths from the local storage if it exists, otherwise it will be 0
        if (localStorage.getItem('deaths') === null) {
            localStorage.setItem('deaths', 0);
        }
        
        const deaths = getTopStats('deaths', 1);
        this.deaths = deaths[0].deaths
        
        this.setCollideWorldBounds(true);
        this.setDepth(1);
        this.body.setSize();
        this.setScale(2);
        this.setMaxVelocity(300, 300);
        this.setDrag(1000);

         // Set FX padding and add shadow to player
        this.preFX.setPadding(6)

        switch (type) { // Set player stats based on type (can be used for Mortis)
            case playerType.Type1:
                this.hitpoints = 5;
                this.maxHitpoints = 5;
                this.baseVelocity = 150;
                this.xpTracker = 0;
                this.shield = 0;
                this.maxShield = 2;
                break;
            case playerType.Type2:
                this.hitpoints = 4;
                this.maxHitpoints = 4;
                this.baseVelocity = 160;
                this.xpTracker = 0;
                this.shield = 0;
                this.maxShield = 3;
                break;
        }
    } 

    setupKeys (scene) {
        this.keys = scene.input.keyboard.addKeys({  
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            ulti: Phaser.Input.Keyboard.KeyCodes.SPACE,
            pause: Phaser.Input.Keyboard.KeyCodes.ESC
            });
        this.pointer = scene.input.activePointer
    }  

    movePlayer () {    
        // Player movements
        const baseVeloc = this.baseVelocity;
        let velocityX = 0;
        let velocityY = 0;
    
        
        if (this.keys.left.isDown) {
            velocityX = -baseVeloc * this.speedMultiplier;
        } 
        if (this.keys.right.isDown) {
            velocityX = baseVeloc * this.speedMultiplier;
        }
        if (this.keys.down.isDown) {
            velocityY = baseVeloc * this.speedMultiplier;
        } 
        if (this.keys.up.isDown) {
            velocityY = -baseVeloc * this.speedMultiplier;
        }
          
        // Set player velocity based on input
        this.setVelocity(velocityX, velocityY);
    }

    playerControls (scene) {
        //Controls the player ultimate attack
        if (this.keys.ulti.isDown) {
            if (!this.isPlayerAttacking && this.isPlayerUltimateReady) {
                this.isPlayerUltimateReady = false;
                this.ultimatesUsed += 1;

                // Create the ultimate attack - laser beam that follow the mouse and has 5 seconds of duration
                const ultimate = createUltimate(scene, this.x, this.y, this.damageMultiplier);

                // Play ultimate sound
                playUltimateSound();

                // Set the timer to auto destroy of the ultimate attack
                ultimate.autoDestroy();

                // Set the ultimate attack animation
                ultimate.animateUltimate();
            }
        }

        //Controls the player attack
        if (this.fireRateType == 0) {
            if (this.pointer.getDuration() <= 70 && this.pointer.getDuration() >= 50 && !this.isPlayerAttacking){
                this.isPlayerAttacking = true;
                           
                //Creates projectiles and adds them to the projectiles group
                const projectile = createProjectile(scene, this.x, this.y, scene.projectileType, this.damageMultiplier);

                //Animates the projectile
                playProjectileAnimation(projectile, scene.projectileType);

                //Play projectile sound
                playProjectileSound()

                //Reset player to attack again
                this.isPlayerAttacking = false;
            }}
        
        else if (this.fireRateType == 1) {
            if (!this.isPlayerAttacking && scene.input.activePointer.leftButtonDown()) {
                this.isPlayerAttacking = true;
            
                // Creates projectiles and adds them to the projectiles group
                const projectile = createProjectile(scene, scene.player.x, scene.player.y, scene.projectileType, this.damageMultiplier);

                //Animates the projectile
                playProjectileAnimation(projectile, projectile.type);

                //Play projectile sound
                playProjectileSound()

                //Sets a timer to reset the player to attack again
                scene.time.delayedCall(125, () => { // 125ms delay for the attack animation
                    this.isPlayerAttacking = false;});
            }
        }

        //Calls the pause menu
        if (this.keys.pause.isDown) {
            this.scene.scene.pause('Game');
            this.scene.scene.launch('PauseMenu');
        }
    }

    receiveDamage(damage) {
        this.hitpoints -= damage;
        this.isHit = true;
    
        if (this.hitpoints <= 0) {
            this.kill()
        }
    }

    kill() {
        this.isPlayerAlive = false;
        this.deaths += 1;
    
        // Stops the background music
        this.scene.sound.stopAll();
    
        // Take a screenshot of the game;    
        this.scene.renderer.snapshot(image => {
            // Store the screenshot in a variable after transforming it into a texture
            this.scene.textures.addBase64('gameOverBackground' + this.deaths, image.src);
        });

        // Start the EndMenu and passes Xp, time survived, enemy kills, and the screenshot with a fade effect
        this.scene.scene.transition({
            target: 'EndMenu',
            duration: 200,
            moveBelow: true,
            onUpdate: this.transitionOut,
            data: {
                tokenId: this.tokenId,
                xp: this.xpTracker,
                timer: this.timeSurvived,
                kills: this.enemyKills,
                deaths: this.deaths
            }
        });

        this.scene.scene.stop('Game');
    }

    ultimateAttackTracker() {
        // Sets the ultimate attack to ready if the player has enough kills and time survived
        if (this.ultimatesUsed == 0) {
            if (this.enemyKills >= 5 && this.timeSurvived >= 20) {
            this.isPlayerUltimateReady = true;
        }} 
        else if (this.ultimatesUsed == 1) {
            if (this.enemyKills >= 60 && this.timeSurvived >= 120) {
                this.isPlayerUltimateReady = true;
        }}
        else if (this.ultimatesUsed == 2) {
            if (this.enemyKills >= 90 && this.timeSurvived >= 180) {
                    this.isPlayerUltimateReady = true;
                    this.xpTrackerActive = this.xpTracker;
        }}
        else {
            // If the player has used 3 ultimates, the next one will be ready if the player has enough kills and time survived 
            // Will also check if the player has INCREASED the XP in at least 1000 since the last ultimate was used
            if (this.enemyKills >= 120 && this.timeSurvived >= 240) {
                // If the player has increased the XP in at least 1000, the ultimate will be ready
                if ((this.xpTracker - this.xpTrackerActive) >= 1000) {
                    this.isPlayerUltimateReady = true;
                    this.xpTrackerActive = this.xpTracker;
                }
        }}
    }

    update() {
        // Calculate angle to cursor
        const angleToCursor = Phaser.Math.Angle.Between(this.x, this.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y);
    
        // Update sprite rotation based on angle
        this.setRotation(angleToCursor);
    
        // Update sprite scale to flip horizontally if needed
        if ((angleToCursor > Math.PI / 4 && angleToCursor < (3 * Math.PI) / 4) || (angleToCursor < -Math.PI / 4 && angleToCursor > -(3 * Math.PI) / 4)) {
            if (this.originalFacingX === 1) {
                this.setFlipX(true); // Flip sprite horizontally
                this.originalFacingX = -1;
            }
        } else {
            if (this.originalFacingX === -1) {
                this.setFlipX(false); // Reset sprite flip
                this.originalFacingX = 1;
            }
        }

        //Update ultimate attack to ready if the player has enough kills and time survived
        ultimateAttackTracker();        

        // Add green aura to player if it has a shield
        if (this.shield > 0) {
            this.preFX.addGlow(328464).setActive(true); // Set active to true to make the glow visible
            this.tweens.add({
                targets: fx,
                outerStrength: 10,
                yoyo: true,
                loop: -1,
                ease: 'sine.inout'
            });
    
        } else {
            this.preFX.addGlow().setActive(false);
        }

        // Add shine to player if it has an ultimate ready
        if (this.isPlayerUltimateReady) {
            this.preFX.addShine(0.5, 1, 3, true).setActive(true);
            
        } else {
            this.preFX.addShine().setActive(false);
        }
        
    }
}


export { playerType, createPlayer, createAnimations, loadPlayer, Player };
