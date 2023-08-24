import * from Phaser as 'phaser'

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
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setScale(1.5);

        //Different types for holding Kraken or Mortis
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

        scene.physics.world.add(this);
        }                

    receiveDamage(damage) {
        this.hitpoints -= damage;
    
        if (this.hitpoints <= 0) {
            this.destroy();
            }
        }
}

// Create player
const createPlayer = (scene, screenX, screenY, 'playerType') => {
    const playerType = Type1; //need to implement the rest of the method for this to work
    const player = Player(scene, screenX, screenY, playerType);
    createAnimations(scene);
    return player;
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

const movePlayer (scene, player) => {    
    // Player movements
    const baseVeloc = 150;
    var multiVeloc = 1; //
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
    this.player.setVelocity(velocityX, velocityY);
}

export { createPlayer, loadPlayer, createAnimations };
