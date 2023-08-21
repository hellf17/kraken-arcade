//Create projectile
export const createProjectile = (scene: Phaser.Scene, playerX, playerY) => {
    const projectile = scene.physics.add.image(playerX, playerY, 'projectile')
    projectile.setScale(0.25)
    projectile.setCollideWorldBounds(false)
    return projectile;
}

//Load projectile image
export const loadProjectiles = (scene: Phaser.Scene): void => {
    scene.load.image('projectile', 'assets/images/still-image/projectiles/projectile.png')   
}

// Declare a variable to hold the projectile sound
let projectileSound;

// Load projectile sound
export const loadProjectileSound = (scene: Phaser.Scene): Phaser.Sound.BaseSound => {
    scene.load.audio('projectileSound', 'assets/audio/projectile.mp3');
    projectileSound = scene.sound.add('projectileSound');
}

// Export the projectileSound for use in the game.ts file
export { projectileSound };
