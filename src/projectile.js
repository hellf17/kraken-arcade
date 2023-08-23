// Create projectile
const createProjectile = (scene, playerX, playerY) => {
    const projectile = scene.physics.add.image(playerX, playerY, 'projectile');
    projectile.setScale(0.25);
    projectile.setCollideWorldBounds(false);
    return projectile;
};

// Load projectile image
const loadProjectiles = (scene) => {
    scene.load.image('projectile', 'src/assets/images/still-image/projectiles/projectile.png');
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

export { createProjectile, loadProjectiles, loadProjectileSound, createProjectileSound, playProjectileSound };
