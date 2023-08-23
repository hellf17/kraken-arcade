// Create player
const createPlayer = (scene, screenX, screenY) => {
    const player = scene.physics.add.sprite(screenX, screenY, 'player');
    player.setScale(1.5);
    createAnimations(scene);
    return player;
};

// Load player spritesheet
const loadPlayer = (scene) => {
    scene.load.spritesheet(
        'player',
        'src/assets/images/spritesheets/kraken-player/kraken1-idle-sheet.png',
        { frameWidth: 150, frameHeight: 150, spacing: 33 }
    );
};

// Animate the player
const createAnimations = (scene) => {
    scene.anims.create({
        key: 'player',
        frames: scene.anims.generateFrameNames('player', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1,
        yoyo: true
    });
};

export { createPlayer, loadPlayer, createAnimations };
