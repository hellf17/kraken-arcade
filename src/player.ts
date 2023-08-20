//Create player
export const createPlayer = (scene: Phaser.Scene, screenX, screenY) => {
    const player = scene.physics.add.sprite(screenX, screenY, 'player')
    createAnimations(scene)
    return player;
}

//Load player spritesheet
export const loadSprites = (scene: Phaser.Scene): void => {
    scene.load.spritesheet('player', 'assets/images/spritesheets/kraken-player/kraken1-idle-sheet.png',
    { frameWidth: 150, frameHeight: 150, spacing: 33})    
}

//Animate the player
export const createAnimations = (scene: Phaser.Scene): void => {
    scene.anims.create({
        key: 'player',
        frames: scene.anims.generateFrameNames('player',{start:0, end:9}),
        frameRate: 10,
        repeat: -1,
        yoyo: true
    })    
}