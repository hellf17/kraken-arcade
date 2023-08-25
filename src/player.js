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
        this.isPlayerInvincible = false;
        this.isPlayerUltimateReady = false;
        this.fireRateType = 0; // 0 is the fire rate for the normal shot, 1 for automatic shot

        this.xpTracker = 0;
        this.timeSurvived = 0;
        
        this.setCollideWorldBounds(true);
        this.setDepth(2);
        this.body.setSize(50, 100);
        this.body.setOffset(50, 0);
        this.setScale(1.5);
        this.setMaxVelocity(300, 300);
        this.setDrag(1000);

        switch (type) {
            case playerType.Type1:
                this.hitpoints = 5;
                this.baseVelocity = 70;
                this.xpTracker = 0;
                break;
            case playerType.Type2:
                this.hitpoints = 4;
                this.baseVelocity = 80;
                this.xpTracker = 0;
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

    movePlayer (multiVeloc = 1) {    
        // Player movements
        const baseVeloc = 150;
        let velocityX = 0;
        let velocityY = 0;
    
        
        if (this.keys.left.isDown) {
            velocityX = -baseVeloc * multiVeloc;
        } 
        if (this.keys.right.isDown) {
            velocityX = baseVeloc * multiVeloc;
        }
        if (this.keys.down.isDown) {
            velocityY = baseVeloc * multiVeloc;
        } 
        if (this.keys.up.isDown) {
            velocityY = -baseVeloc * multiVeloc;
        }
          
        // Set player velocity based on input
        this.setVelocity(velocityX, velocityY);
    }     

    playerAttacks (scene) {
        if (this.keys.ulti.isDown) {
            if (!this.isPlayerAttacking && this.isPlayerUltimateReady) {
                this.isPlayerAttacking = true;
    
                // Create the ultimate attack
                const ultimateAttack = scene.physics.add.spritesheet(this.x, this.y, 'ultimateAttack');
                ultimateAttack.setScale(1.5);
                ultimateAttack.setDepth(2);
                ultimateAttack.body.setSize(50, 100);
                ultimateAttack.body.setOffset(50, 0);
                ultimateAttack.setVelocity(0, 0);
                ultimateAttack.setCollideWorldBounds(true);
                ultimateAttack.setBounce(1);
                ultimateAttack.setDrag(1000);
            }
        }
    
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
    
            // Set velocity for the projectile using the normalized direction
            const projectileSpeed = 500; // Adjust as needed
            const projectile = createProjectile(scene, scene.player.x, scene.player.y);
            projectile.setVelocity(projectileSpeed * normalizedDirectionX, projectileSpeed * normalizedDirectionY);
    
            // Play the projectile sound
            playProjectileSound();
            
            // Add the projectile to the array of active projectiles
            scene.projectiles.push(projectile);

            // Sets a timer for resetting the isPlayerAttacking variable  
            if (this.isPlayerAttacking) {
                if (this.fireRateType == 0) { // 0 is the fire rate for the normal shot
                    scene.time.delayedCall(200, () => {
                        if (this.pointer.getDuration() <= 50) {
                        this.isPlayerAttacking = false;}
                });
                }
            
                if (this.fireRateType == 1) { // 1 is the fire rate for the automatic shot
                    scene.time.delayedCall(125, () => {
                    this.isPlayerAttacking = false;
                    });
                }
            }
        }
    }

    receiveDamage(damage) {
        this.hitpoints -= damage;
    
        if (this.hitpoints <= 0) {
            this.kill()
        }
    }

    kill(){
        //this.moveState.die();
        //this.animState.die();
        this.isAlive = false;
        this.destroy();
        events.emit("player-died")
        events.emit('time-survived', this.timeSurvived);
        const styles = ["font size: 18px", "padding: 2px 4px", "background-color: #000000"].join(";");
        
    }

    update(){
        if (this.isAlive){
            this.timeSurvived += 1;
            //this.moveState.update();
            //this.animState.update();
        }

        if (this.isHit){
            this.isHit = false;
      
    }

}};

const createPlayer = (scene, screenX, screenY, type) => {
    const player = new Player(scene, screenX, screenY, type);
    createAnimations(scene);

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
