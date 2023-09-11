import * as Phaser from 'phaser'
import { playProjectileAnimation, playProjectileSound, createProjectile, Projectile } from './projectile';

const playerType = {
    Type1: 0,
    Type2: 1
};

//Load player spritesheet
const loadPlayer = (scene, type) => {
    scene.load.spritesheet(
        'player' + type,
        'src/assets/images/spritesheets/kraken-player/kraken1-idle-sheet.png',
        { frameWidth: 150, frameHeight: 150, spacing: 33 }
    );
};

const createPlayer = (scene, screenX, screenY, type) => {
    const player = new Player(scene, screenX, screenY, type);
    createAnimations(scene, type);

    // Add a property to the player to store its original facing direction
    player.originalFacing = 1; // 1 for right, -1 for left

    return player;
};

const createAnimations = (scene, type) => {
    scene.anims.create({
        key: 'player' + type,
        frames: scene.anims.generateFrameNames('player' + type, { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1,
        yoyo: true
    });
};

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'player' + type);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
  
        this.isPlayerAttacking = false;
        this.isPlayerAlive = true;
        this.isPlayerHit = false;
        this.isPlayerInvencible = false;
        this.isPlayerUltimateReady = false;
        this.fireRateType = 1; // 0 is the fire rate for the normal shot, 1 for automatic shot

        this.xpTracker = 0;
        this.timeSurvived = 0;
        this.enemyKills = 0;
        
        this.setCollideWorldBounds(true);
        this.setDepth(3);
        this.body.setSize(50, 100);
        this.body.setOffset(50, 0);
        this.setScale(1.15);
        this.setMaxVelocity(300, 300);
        this.setDrag(1000);

        switch (type) { // Set player stats based on type (can be used for Mortis)
            case playerType.Type1:
                this.hitpoints = 5;
                this.maxHitpoints = 5;
                this.baseVelocity = 70;
                this.xpTracker = 0;
                this.shield = 0;
                break;
            case playerType.Type2:
                this.hitpoints = 4;
                this.maxHitpoints = 4;
                this.baseVelocity = 80;
                this.xpTracker = 0;
                this.shield = 0;
                break;
        }
    }

    setupKeys (scene){
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

    timeTracker() {
        if (this.isPlayerAlive) {
            const currentTime = this.scene.time.now;
            
            if (this.lastTimeSurvivedUpdate === undefined) {
                this.lastTimeSurvivedUpdate = currentTime;
            }
            
            const elapsedTime = currentTime - this.lastTimeSurvivedUpdate;
            this.timeSurvived += elapsedTime;
            this.lastTimeSurvivedUpdate = currentTime;
            
            // Calculate the number of additional XP the player should earn
            const additionalXP = Math.floor(this.timeSurvived / 10000);
    
            // Check if the player has earned more XP
            if (additionalXP > this.xpTracker) {
                this.xpTracker = additionalXP;
            }
        }
    }    

    movePlayer (multiveloc = 1) {    
        // Player movements
        const baseVeloc = 150;
        let velocityX = 0;
        let velocityY = 0;
    
        
        if (this.keys.left.isDown) {
            velocityX = -baseVeloc * multiveloc;
        } 
        if (this.keys.right.isDown) {
            velocityX = baseVeloc * multiveloc;
        }
        if (this.keys.down.isDown) {
            velocityY = baseVeloc * multiveloc;
        } 
        if (this.keys.up.isDown) {
            velocityY = -baseVeloc * multiveloc;
        }
          
        // Set player velocity based on input
        this.setVelocity(velocityX, velocityY);
    }

    playerControls (scene) {
        //Controls the player ultimate attack
        if (this.keys.ulti.isDown) {
            if (!this.isPlayerAttacking && this.isPlayerUltimateReady) {
                this.isPlayerAttacking = true;
    
                // Create the ultimate attack - laser beam that follow the mouse and has 5 seconds of duration
                const ultimateAttack = scene.physics.add.spritesheet(this.x, this.y, 'ultimateAttack');
                ultimateAttack.anims.play('ultimateAttack', true);
                ultimateAttack.setScale(1.5);
                ultimateAttack.setDepth(2);
                ultimateAttack.body.setSize(50, 100);
                ultimateAttack.body.setOffset(50, 0);
                ultimateAttack.setVelocity(0, 0);
                ultimateAttack.setCollideWorldBounds(true);
                ultimateAttack.setBounce(1);
                ultimateAttack.setDrag(1000);

/*                 // Add ultimate attack to the scene
                scene.ultimateAttacks.push(ultimateAttack);

                // Play ultimate sound
                playUltimateSound();

                // Set the ultimate attack duration
                scene.time.delayedCall(5000, () => { // 5000ms delay for the attack animation
                    ultimateAttack.destroy();
                    this.isPlayerUltimateReady = false;
                    this.isPlayerAttacking = false;
                }); */
            }
        }

        //Controls the player attack
        if (this.fireRateType == 0) {
            if (this.pointer.getDuration() <= 70 && this.pointer.getDuration() >= 50 && !this.isPlayerAttacking){
                this.isPlayerAttacking = true;
                           
                //Creates projectiles and adds them to the projectiles group
                const projectile = createProjectile(scene, scene.player.x, scene.player.y, scene.projectileType);

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
                const projectile = createProjectile(scene, scene.player.x, scene.player.y, scene.projectileType);

                //Animates the projectile
                playProjectileAnimation(projectile, projectile.type);

                //Play projectile sound
                playProjectileSound()

                //Sets a timer to reset the player to attack again
                scene.time.delayedCall(125, () => { // 125ms delay for the attack animation
                    this.isPlayerAttacking = false;});
            }
        }

        //Controls the pause menu
        if (this.keys.pause.isDown) {
            scene.callPauseMenu();
        }
    }

    receiveDamage(damage) {
        this.hitpoints -= damage;
        this.isHit = true;
    
        if (this.hitpoints <= 0) {
            this.kill()
        }
    }

    kill(){
        //this.moveState.die();
        //this.animState.die();       
     
        this.isPlayerAlive = false;
        this.scene.player = null;
        this.scene.backgroundSound.stop();

        //Capture player screenshot and makes it a texture acessible by the end scene
        const playerScreenshot = this.scene.renderer.snapshot(
            this.scene.textures.addBase64('playerScreenshot', playerScreenshot.src)
        );

        this.scene.stop('Game');
        this.scene.start('EndScene')

    }

    update() {   
        this.timeTracker();

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
        
    }
}



export { playerType, createPlayer, loadPlayer, Player };
