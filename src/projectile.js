//Projectile types
const projectileType = {
    Type1: '0'
};

// Load projectile image for different types
const loadProjectiles = (scene) => {

    scene.load.spritesheet('projectile0', 'src/assets/images/spritesheets/projectiles/default_projectile.png', {
        frameWidth: 81,
        frameHeight: 125,
        spacing: 29
    });
};

// Create projectile - called from the player.js file
const createProjectile = (scene, playerX, playerY, type = 0) => {
    // Debug point: Check if this function is being called correctly
    console.log('Creating projectile with type:', type);

    const projectile = new Projectile(scene, playerX, playerY, ('projectile ' + type));

    projectile.setData('type', projectile.type)
    projectile.setData('damage', projectile.damage);
    projectile.setData('speed', projectile.speed);

    scene.projectilesGroup.add(projectile);

    return projectile;
};

// Create projectile animations for all types
const createAnimations = (scene) => {
    for (const type in projectileType) {
        const animationKey = 'projectile' + projectileType.Type1;
        console.log('animationkey:', animationKey);

        const hitAnimationKey = 'projectileHit' + projectileType.Type1;
        console.log('hit key', hitAnimationKey);


        scene.anims.create({
            key: animationKey,
            frames: scene.anims.generateFrameNames(animationKey, { start: 0, end: 10 }),
            frameRate: 11,
            repeat: -1
        });

        scene.anims.create({
            key: hitAnimationKey,
            frames: scene.anims.generateFrameNames(hitAnimationKey, { start: 11, end: 15 }),
            frameRate: 5,
            repeat: 0
        });
    }
};

// Play projectile animation
const playProjectileAnimation = (projectile, type) => {
    console.log('Playing animation for:', type);
    const animationKey = 'projectile' + type;
    const hitAnimationKey = 'projectileHit' + type;

    if (projectile.isHit) {
        projectile.anims.play(hitAnimationKey);
    } else {
        projectile.anims.play(animationKey, true);
    }
};

// Load and export projectile sound
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
    constructor(scene, x, y, type) {
        super(scene, x, y, 'projectile' + type);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        this.setCollideWorldBounds(false);
        this.setScale(0.15);

        this.isHit = false;

        switch (type) { // Set projectile stats based on type
            case projectileType.Type1:
                this.damage = 1;
                this.speed = 350
                this.setBounce(1);
                break;
            case projectileType.Type2:
                this.damage = 1;
                this.speed = 350;
                this.setBounce(1.5);
                break;
        }

        this.scene.physics.world.add(this);
    }

    update() {
        //Check if projectiles are out of screen bounds and remove them
        for (let i = scene.projectilesGroup.getChildren().length - 1; i >= 0; i--) {
            const projectile = scene.projectilesGroup.getChildren()[i];
            if (projectile.x < 0 || projectile.x > scene.game.config.width || projectile.y < 0 || projectile.y > scene.game.config.height) {t
                projectile.destroy();
            }
        }
    }
}

export { projectileType, createProjectile, loadProjectiles, createAnimations, playProjectileAnimation, loadProjectileSound, createProjectileSound, playProjectileSound, Projectile };
