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

};

// Create projectile - called from the player.js file
const createProjectile = (scene, playerX, playerY, type = 0, damageMultiplier) => {
    const projectile = new Projectile(scene, playerX, playerY, type, damageMultiplier);

    // Add projectile to the projectiles group
    scene.projectilesGroup.add(projectile);

    // Set velocity based on projectile speed
    const projectileSpeed = projectile.getSpeed();
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

// Create projectile animations for all types
const createProjectileAnimation = (scene) => {
        const animationKey = 'projectile' + 0;
        const hitAnimationKey = 'projectileHit' + 0;

        scene.anims.create({
            key: animationKey,
            frames: scene.anims.generateFrameNames(animationKey, { start: 0, end: 8 }),
            frameRate: 11,
            repeat: -1
        });

        scene.anims.create({
            key: hitAnimationKey,
            frames: scene.anims.generateFrameNames(animationKey, { start: 9, end: 13 }),
            frameRate: 5,
            repeat: 0
        });
}

//Play projectile animation
const playProjectileAnimation = (projectile, type) => {
    const animationKey = 'projectile' + type;
    const hitAnimationKey = 'projectileHit' + type;

    if (projectile.isHit) {
        projectile.anims.play(hitAnimationKey);
    } else {
        projectile.anims.play(animationKey, true);
    }
};

//Load and export projectile sound
let projectileSound;

const loadProjectileSound = (scene) => {
    scene.load.audio('projectileSound', 'src/assets/audio/projectile.mp3');
};

const createProjectileSound = (scene) => {
    projectileSound = scene.sound.add('projectileSound');
    return projectileSound;
};

const playProjectileSound = () => {
    projectileSound.play();
};

class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, damageMultiplier) {
        super(scene, x, y, 'projectile' + type, damageMultiplier);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.setScale(0.2);
        this.setDepth(0);

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

    getSpeed() {
        return this.speed;
    }

    update() {    
        // Check if projectiles are out of screen bounds and remove them
        for (let i = this.scene.projectilesGroup.getChildren().length - 1; i >= 0; i--) {
            const projectile = this.scene.projectilesGroup.getChildren()[i];
            if (projectile.x < 0 || projectile.x > this.scene.game.config.width || projectile.y < 0 || projectile.y > this.scene.game.config.height) {
                projectile.destroy();
            }
        }
    }
}

export { createProjectile, loadProjectiles, createProjectileAnimation, playProjectileAnimation, loadProjectileSound, createProjectileSound, playProjectileSound, Projectile };
