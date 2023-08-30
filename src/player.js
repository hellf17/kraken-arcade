import * as Phaser from 'phaser'
import { playProjectileSound, createProjectile } from './projectile';

const playerType = {
    Type1: 0,
    Type2: 1
};

// Load player spritesheet
const loadPlayer = (scene) => {
    scene.load.spritesheet(
        'player',
        'src/assets/images/spritesheets/kraken-player/kraken1-idle-sheet.png',
        { frameWidth: 150, frameHeight: 150, spacing: 33 }
    );
};

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
  
        this.isPlayerAttacking = false;
        this.isPlayerAlive = true;
        this.isPlayerHit = false;
        this.isPlayerInvencible = false;
        this.isPlayerUltimateReady = false;
        this.fireRateType = 0; // 0 is the fire rate for the normal shot, 1 for automatic shot

        this.xpTracker = 0; // need to implent the XP incrementation with the timeSurvived
        this.timeSurvived = 0;
        
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

        scene.physics.world.add(this);

    }

    setupKeys (scene){
        this.keys = scene.input.keyboard.addKeys({  
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            ulti: Phaser.Input.Keyboard.KeyCodes.SPACE
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
            
            if (this.timeSurvived >= 10000 && this.timeSurvived - elapsedTime < 10000) {
                this.xpTracker += 10;
            } else if (this.timeSurvived > 10000) {
                const remainingTime = this.timeSurvived - 10000;
                const additionalXP = Math.floor(remainingTime / 10000) * 10;
                this.xpTracker += additionalXP;
            }
        }
    }

    movePlayer (scene, multiveloc = 1) {    
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

    playerAttacks (scene) {
        // Set velocity for the projectile
        const projectileSpeed = 350; // Can be adjusted

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
        
        if (this.fireRateType == 0) {
            if (this.pointer.getDuration() <= 70 && this.pointer.getDuration() >= 50 && !this.isPlayerAttacking){
                this.isPlayerAttacking = true;
                const mouseX = scene.input.activePointer.x;
                const mouseY = scene.input.activePointer.y;
                
                // Calculate direction vector
                const directionX = mouseX - scene.player.x;
                const directionY = mouseY - scene.player.y;
                
                // Normalize the direction vector
                const length = Math.sqrt(directionX * directionX + directionY * directionY);
                const normalizedDirectionX = directionX / length;
                const normalizedDirectionY = directionY / length;
                           
                // Creates projectiles and set velocity for the projectile using the normalized direction
                const projectile = createProjectile(scene, scene.player.x, scene.player.y); // create projectile
                projectile.setVelocity(projectileSpeed * normalizedDirectionX, projectileSpeed * normalizedDirectionY);

                // Play projectile sound
                playProjectileSound()

                // Add projectile to the scene
                scene.projectiles.push(projectile)

                // Reset player to attack again
                this.isPlayerAttacking = false;
            }}
        
        else if (this.fireRateType == 1) {
           if (!this.isPlayerAttacking && scene.input.activePointer.leftButtonDown()) {
            this.isPlayerAttacking = true;
            const mouseX = scene.input.activePointer.x;
            const mouseY = scene.input.activePointer.y;
            
            // Calculate direction vector
            const directionX = mouseX - scene.player.x;
            const directionY = mouseY - scene.player.y;
            
            // Normalize the direction vector
            const length = Math.sqrt(directionX * directionX + directionY * directionY);
            const normalizedDirectionX = directionX / length;
            const normalizedDirectionY = directionY / length;
            
            // Creates projectiles and set velocity for the projectile using the normalized direction
            const projectile = createProjectile(scene, scene.player.x, scene.player.y); // create projectile
            projectile.setVelocity(projectileSpeed * normalizedDirectionX, projectileSpeed * normalizedDirectionY);

            // Play projectile sound
            playProjectileSound()

            // Add projectile to the scene
            scene.projectiles.push(projectile)

            //Sets a timer to reset the player to attack again
            scene.time.delayedCall(125, () => { // 125ms delay for the attack animation
                this.isPlayerAttacking = false;});
            }
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
        this.destroy(); 
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
    }
}

const createPlayer = (scene, screenX, screenY, type) => {
    const player = new Player(scene, screenX, screenY, type);
    createAnimations(scene);

    // Add a property to the player to store its original facing direction
    player.originalFacing = 1; // 1 for right, -1 for left

    return player;
};

const createAnimations = (scene) => {
    scene.anims.create({
        key: 'player',
        frames: scene.anims.generateFrameNames('player', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1,
        yoyo: true
    });
};



export { createPlayer, loadPlayer, Player };
