//Projectile types
const projectileType = {
    Type1: 'Type1',
    Type2: 'Type2',
    Type3: 'Type3',
}

// Create projectile
const createProjectile = (scene, playerX, playerY, type = projectileType.Type1) => {
    const projectile = new Projectile (scene, playerX, playerY, ('projectile ' + type));
    projectile.setScale(0.25);
    projectile.setCollideWorldBounds(false);

    projectile.setData('type', projectile.type)
    projectile.setData('damage', projectile.damage);
    projectile.setData('speed', projectile.speed);

    scene.projectilesGroup.add(projectile);
    createAnimations(scene, type);

    return projectile;
};

// Load projectile image
const loadProjectiles = (scene) => {
    scene.load.spritesheet('projectile', 'src/assets/images/spritesheets/projectiles/default_projectile.png', {
        frameWidth: 110,
        frameHeight: 125,
        spacing: 29
    })
    ;
};

const createAnimations = (scene, type) => {
    scene.anims.create({
        key: ('projectile' + type),
        frames: scene.anims.generateFrameNames(('projectile' + type), { start: 0, end: 15 }),
        frameRate: 16,
        repeat: -1
    });
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
        this.setScale(0.25);

        switch (type) { // Set projectile stats based on type
            case playerType.Type1:
                this.damage = 1;
                this.speed = 350
                this.setBounce(1);
                break;
            case playerType.Type2:
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

export { projectileType, createProjectile, loadProjectiles, loadProjectileSound, createProjectileSound, playProjectileSound, Projectile };
