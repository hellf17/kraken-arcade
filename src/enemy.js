import * as Phaser from 'phaser';
//import {  } from './projectile';

const EnemyType = {
    Type1: 0,
    Type2: 1,
    Type3: 2
};

const loadEnemies = (scene) => {
    scene.load.image('enemy0', 'src/assets/images/still-image/enemies/enemy0.png');
    scene.load.image('enemy2', 'src/assets/images/still-image/enemies/enemy2.png');

    scene.load.spritesheet(
        'enemy1',
        'src/assets/images/spritesheets/enemies/enemy1.png',
        { frameWidth: 64, frameHeight: 64});

    
};

const createEnemiesAnimations = (scene) => {
/*     scene.anims.create({
        key: 'enemy0',
        frames: scene.anims.generateFrameNames('enemy0', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1,
        yoyo: true,
        loop: true
        }); */

    scene.anims.create({
        key: 'enemy1',
        frames: scene.anims.generateFrameNames('enemy1', { start: 0, end: 2 }),
        frameRate: 3,
        repeat: -1,
        yoyo: true,
        loop: true
        });
        
/*     
    scene.anims.create({
        key: 'enemy2',
        frames: scene.anims.generateFrameNames('enemy2', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1,
        yoyo: true,
        loop: true
        });
 */
};

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'enemy' + type);
        scene.add.existing(this);
        scene.physics.add.existing(this)
        

        switch (type) {
            case EnemyType.Type1:
                this.hitpoints = 3;
                this.speed = 80;
                this.xpReward = 10
                this.damage = 1;
                this.dodgeModifier = 1;
                this.setScale(0.12);
                break;
            case EnemyType.Type2:
                this.hitpoints = 5;
                this.speed = 130;
                this.xpReward = 15;
                this.damage = 1;
                this.dodgeModifier = 1.2;
                this.setScale(2.8);
                break;
            case EnemyType.Type3:
                this.hitpoints = 7;
                this.speed = 180;
                this.xpReward = 25;
                this.damage = 2;
                this.dodgeModifier = 1.4;
                this.setScale(0.12);
                break;
        }
        
    }
}

const spawnEnemy = (scene, currentTime) => {
    const elapsedTimeSinceLastIncrease = currentTime - scene.lastEnemyIncreaseTime;

    // Increase maxEnemiesOnScreen every enemyIncreaseInterval
    if (elapsedTimeSinceLastIncrease >= scene.maxEnemyIncreaseInterval) {
        scene.maxEnemiesOnScreen += 2;
        scene.lastEnemyIncreaseTime = currentTime;
    }

    if (scene.enemiesGroup.getChildren().length < scene.maxEnemiesOnScreen) {
        // Spawn outside the screen
        const spawnSide = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
        let spawnX, spawnY;

        switch (spawnSide) {
            case 0:
                spawnX = Phaser.Math.Between(0, window.innerWidth);
                spawnY = -32; // Above the screen
                break;
            case 1:
                spawnX = window.innerWidth + 32; // Right of the screen
                spawnY = Phaser.Math.Between(0, window.innerHeight);
                break;
            case 2:
                spawnX = Phaser.Math.Between(0, window.innerWidth);
                spawnY = window.innerHeight + 32; // Below the screen
                break;
            case 3:
                spawnX = -32; // Left of the screen
                spawnY = Phaser.Math.Between(0, window.innerHeight);
                break;
        }

        const enemyType = Phaser.Math.Between(EnemyType.Type1, EnemyType.Type3);
        const enemy = new Enemy(scene, spawnX, spawnY, enemyType);
        enemy.anims.play('enemy' + enemyType, true);
        scene.enemiesGroup.add(enemy);
    }
};

const trackPlayerAndMove = (scene, enemiesGroup, projectilesGroup) => {
    enemiesGroup.getChildren().forEach((enemy) => {
        const player = scene.player;
        const speed = enemy.speed;
        const dodgeModifier = enemy.dodgeModifier || 1.0;

        const angleToPlayer = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        const dodgeAngleOffset = Math.PI / 2;
        const dodgeAngleLeft = angleToPlayer + dodgeAngleOffset;
        const dodgeAngleRight = angleToPlayer - dodgeAngleOffset;
        const dodgeDistance = speed * 2 * dodgeModifier;

        let canDodgeLeft = true;
        let canDodgeRight = true;

        //Check collision with projectiles for dodging left
        for (const projectile of projectilesGroup.getChildren()) {
            const angleToProjectile = Phaser.Math.Angle.Between(enemy.x, enemy.y, projectile.x, projectile.y);
            const distanceToProjectile = Phaser.Math.Distance.Between(enemy.x, enemy.y, projectile.x, projectile.y);
            
            if (Math.abs(angleToProjectile - dodgeAngleLeft) < Math.PI / 4 && distanceToProjectile < dodgeDistance) {
                canDodgeLeft = false;
                break;
            }
        }

        //Check collision with projectiles for dodging right
        for (const projectile of projectilesGroup.getChildren()) {
            const angleToProjectile = Phaser.Math.Angle.Between(enemy.x, enemy.y, projectile.x, projectile.y);
            const distanceToProjectile = Phaser.Math.Distance.Between(enemy.x, enemy.y, projectile.x, projectile.y);
            
            if (Math.abs(angleToProjectile - dodgeAngleRight) < Math.PI / 4 && distanceToProjectile < dodgeDistance) {
                canDodgeRight = false;
                break;
            }
        }

        let dodgeDirection = 0;

        if (canDodgeLeft && !canDodgeRight) {
            dodgeDirection = -1;
        } else if (!canDodgeLeft && canDodgeRight) {
            dodgeDirection = 1;
        }

        const dodgeAngle = dodgeDirection === -1 ? dodgeAngleLeft : (dodgeDirection === 1 ? dodgeAngleRight : angleToPlayer);
        const velocityX = Math.cos(dodgeAngle) * speed;
        const velocityY = Math.sin(dodgeAngle) * speed;
        enemy.setVelocity(velocityX, velocityY);
    });
};

// Boss type
const BossType = {
    Type1: 0
};


// Boss class
class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'boss' + type);
        scene.add.existing(this);
        scene.physics.add.existing(this)

        this.isBossInvencible = false; 
        
        // Set FX padding and add shadow
        this.preFX.setPadding(6);        

        switch (type) {
            case BossType.Type1:
                this.hitpoints = 100;

                if (this.hitpoints < 75) {
                    this.regerenation = true;
                }
                this.speed = 80;
                this.xpReward = 1000;
                this.damage = 3;
                this.dodgeModifier = 3;
                this.range = 200;
                this.attackSpeed = 1;
                break;
        }
    }

    // Add boss ranged attack - need to be properly implemented in the projectile class
    rangedAttack (scene, range, speed, damage) {
        scene.time.addEvent({
            delay: 1000, // Attack speed
            callback: () => {
                //Check if player is in range
                if (Phaser.Math.Distance.Between(scene.player.x, scene.player.y, this.x, this.y) > range) {
                    return;
                } 
                else {
                const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, scene.player.x, scene.player.y);
                const velocityX = Math.cos(angleToPlayer) * speed;
                const velocityY = Math.sin(angleToPlayer) * speed;
                const projectile = new Projectile(scene, this.x, this.y, velocityX, velocityY, damage);
                scene.enemyProjectilesGroup.add(projectile);
            }},
            loop: true
        });     
    }

    // Add boss movement
    bossMovement (scene, projectilesGroup) {
        const player = scene.player;
        const speed = this.speed;
        const dodgeModifier = this.dodgeModifier || 1.0;
    
        const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        const dodgeAngleOffset = Math.PI / 2;
        const dodgeAngleLeft = angleToPlayer + dodgeAngleOffset;
        const dodgeAngleRight = angleToPlayer - dodgeAngleOffset;
        const dodgeDistance = speed * 2 * dodgeModifier;
    
        let canDodgeLeft = true;
        let canDodgeRight = true;
    
        //Check collision with projectiles for dodging left
        for (const projectile of projectilesGroup.getChildren()) {
            const angleToProjectile = Phaser.Math.Angle.Between(this.x, this.y, projectile.x, projectile.y);
            const distanceToProjectile = Phaser.Math.Distance.Between(this.x, this.y, projectile.x, projectile.y);
                
            if (Math.abs(angleToProjectile - dodgeAngleLeft) < Math.PI / 4 && distanceToProjectile < dodgeDistance) {
                canDodgeLeft = false;
                break;
            }
        }
    
        //Check collision with projectiles for dodging right
        for (const projectile of projectilesGroup.getChildren()) {
            const angleToProjectile = Phaser.Math.Angle.Between(this.x, this.y, projectile.x, projectile.y);
            const distanceToProjectile = Phaser.Math.Distance.Between(this.x, this.y, projectile.x, projectile.y);
               
            if (Math.abs(angleToProjectile - dodgeAngleRight) < Math.PI / 4 && distanceToProjectile < dodgeDistance) {
                canDodgeRight = false;
                break;
            }
        }
    
        let dodgeDirection = 0;
    
        if (canDodgeLeft && !canDodgeRight) {
            dodgeDirection = -1;
        } else if (!canDodgeLeft && canDodgeRight) {
            dodgeDirection = 1;
        }
    
        const dodgeAngle = dodgeDirection === -1 ? dodgeAngleLeft : (dodgeDirection === 1 ? dodgeAngleRight : angleToPlayer);
        const velocityX = Math.cos(dodgeAngle) * speed;
        const velocityY = Math.sin(dodgeAngle) * speed;
        this.setVelocity(velocityX, velocityY);
    };

    // Add boss health regeneration
    healtRegen (scene, regenFactor) {
        scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.hitpoints < 100) {
                    this.hitpoints += regenFactor;
                }
            },
            loop: true
        });     
    }
    
    update() {
        if (this.regerenation) {
            if (this.hitpoints > 50) {
                healtRegen(this, 1);
            } else {
                healtRegen(this, 2);
            }
        }
    }
}

const spawnBoss = (scene, bossType) => {
    const spawnSide = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
    let spawnX, spawnY;

    switch (spawnSide) {
        case 0:
            spawnX = Phaser.Math.Between(0, window.innerWidth);
            spawnY = -32; // Above the screen
            break;
        case 1:
            spawnX = window.innerWidth + 32; // Right of the screen
            spawnY = Phaser.Math.Between(0, window.innerHeight);
            break;
        case 2:
            spawnX = Phaser.Math.Between(0, window.innerWidth);
            spawnY = window.innerHeight + 32; // Below the screen
            break;
        case 3:
            spawnX = -32; // Left of the screen
            spawnY = Phaser.Math.Between(0, window.innerHeight);
            break;
    }

    const boss = new Boss(scene, spawnX, spawnY, bossType);
    boss.anims.play('boss' + bossType, true);
    }


export { loadEnemies, spawnEnemy, spawnBoss, trackPlayerAndMove, createEnemiesAnimations };
