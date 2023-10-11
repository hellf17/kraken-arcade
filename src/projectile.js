const projectileType = {
    Type1: 0,
    Type2: 1,
    Type3: 2
};


// Load projectile image for different types
const loadProjectiles = (scene) => {
    scene.load.spritesheet('projectile0', 'src/assets/images/spritesheets/projectiles/default_projectile.png', {
        frameWidth: 64,
        frameHeight: 64,
    });

    scene.load.spritesheet('playerUltimate', 'src/assets/images/spritesheets/projectiles/ultimate.png',{ 
        frameWidth: 100, 
        frameHeight: 100 
    });
};

// Create projectile
const createProjectile = (scene, playerX, playerY, type = 0, damageMultiplier) => {
    const projectile = new Projectile(scene, playerX, playerY, type, damageMultiplier);

    // Add projectile to the projectiles group
    scene.projectilesGroup.add(projectile);

    // Set velocity based on projectile speed
    const projectileSpeed = projectile.speed;
    const mouseX = scene.input.activePointer.x;
    const mouseY = scene.input.activePointer.y;
    const directionX = mouseX - playerX;
    const directionY = mouseY - playerY;
    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    const normalizedDirectionX = directionX / length;
    const normalizedDirectionY = directionY / length;

    projectile.setVelocity(projectileSpeed * normalizedDirectionX, projectileSpeed * normalizedDirectionY);

    return projectile;
};

// Create ultimate
const createUltimate = (scene, playerX, playerY, damageMultiplier) => {
    const ultimateAttack = new Ultimate (scene, playerX + 6, playerY - 17, damageMultiplier);
    scene.ultimateGroup.add(ultimateAttack);

    // The ultimate is a laser beam consistening of 3 parts
    // The first part is the laser beam forming at the Eth rock
    // The second part is the laser beam itself
    // The third part is the laser beam disappearing after hitting an enemy/screen bounds

    const mouseX = scene.input.activePointer.x;
    const mouseY = scene.input.activePointer.y;
    const directionX = mouseX - playerX;
    const directionY = mouseY - playerY;
    const length = Math.sqrt(directionX * directionX + directionY * directionY);
    const normalizedDirectionX = directionX / length;
    const normalizedDirectionY = directionY / length;
    ultimateAttack.setVelocity(ultimateAttack.speed * normalizedDirectionX, ultimateAttack.speed * normalizedDirectionY);

    // The first part of the ultimate 
    ultimateAttack.anims.play('ultimatePart1');
    
    // The second part of the ultimate
    ultimateAttack.anims.play('ultimatePart2');

    return ultimateAttack;
};


// Create projectile animations for all types
const createProjectileAnimation = (scene) => {
        scene.anims.create({
            key: 'projectile' + 0,
            frames: scene.anims.generateFrameNames('projectile' + 0, { start: 0, end: 8 }),
            frameRate: 11,
            repeat: -1
        });

        scene.anims.create({
            key: 'projectileHit' + 0,
            frames: scene.anims.generateFrameNames('projectileHit' + 0, { start: 9, end: 13 }),
            frameRate: 5,
            repeat: 0
        });

        scene.anims.create({
            key: 'ultimatePart1', // Create animatition for the first part of the ultimate - before forming the laser
            frames: scene.anims.generateFrameNumbers('playerUltimate', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: -1,
            yoyo: false
        });
        
        scene.anims.create({
            key: 'ultimatePart2', // Create animatition for the second part of the ultimate - the laser
            frames: scene.anims.generateFrameNumbers('playerUltimate', { start: 12, end: 13 }),
            frameRate: 2,
            repeat: -1,
            yoyo: true
        });
    -
        scene.anims.create({
            key: 'ultimatePart3', // Create animatition for the third part of the ultimate - after hitting an enemy
            frames: scene.anims.generateFrameNumbers('playerUltimate', { start: 14, end: 17 }),
            frameRate: 4,
            repeat: -1,
            yoyo: false
        });
}

//Play projectile animation based on type
const playProjectileAnimation = (projectile, type) => {
    const animationKey = 'projectile' + type;
    const hitAnimationKey = 'projectileHit' + type;

    if (projectile.isHit) {
        projectile.anims.play(hitAnimationKey, true);
    } else {
        projectile.anims.play(animationKey, true);
    }
};

//Load and export projectile sound
let projectileSound;
let ultimateSound;

const loadProjectileSound = (scene) => {
    scene.load.audio('projectileSound', 'src/assets/audio/projectile.mp3');
    scene.load.audio('ultimateSound', 'src/assets/audio/ultimate.mp3');
};

const createProjectileSound = (scene) => {
    projectileSound = scene.sound.add('projectileSound');
    ultimateSound = scene.sound.add('ultimateSound');

    return projectileSound, ultimateSound;
};

const playProjectileSound = () => {
    projectileSound.play();
};

const playUltimateSound = () => {
    ultimateSound.play();
};

class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, damageMultiplier = 1) {
        super(scene, x, y, 'projectile' + type);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.setScale(0.3);
        this.setDepth(1);

        this.type = type;
        this.isHit = false;

        switch (type) { // Set projectile stats based on type
            case projectileType.Type1:
                this.damage = 1 * damageMultiplier;
                this.speed = 350;
                this.setBounce(0);
                break;
            case projectileType.Type2:
                this.damage = 2 * damageMultiplier;
                this.speed = 350;
                this.setBounce(0.8);
                break;
        }
    }

    update() {    
        if (this.x < 0 || this.x > this.scene.game.config.width || this.y < 0 || this.y > this.scene.game.config.height) {
                this.destroy();
        }
    }
}


class Ultimate extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, damageMultiplier = 1) {
        super(scene, x, y, 'playerUltimate');
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setScale(2);
        this.setDepth(1);

        this.scene = scene;
        this.speed = 600;

        this.isHit = false;
        this.damage = 1.5 * damageMultiplier;
        this.duration = 6000;
    }
    
    autoDestroy() {
        this.scene.time.delayedCall(this.duration, () => {
            this.scene.                    

            this.destroy();
        });
    }

    animateUltimate() {
        this.anims.play('ultimatePart1', true);
        this.anims.play('ultimatePart2', true);

        if (this.isHit) {
            this.anims.play('ultimatePart3', true);
        }
    }   

    update() {
        this.animateUltimate();
    }
}

export { createProjectile, createUltimate, loadProjectiles, createProjectileAnimation, playProjectileAnimation, loadProjectileSound, createProjectileSound, playProjectileSound, playUltimateSound };
