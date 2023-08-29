import * as Phaser from 'phaser';

const heartType = {
    Type1: 'Red',
    Type2: 'Blue',
    Type3: 'Green'
};

const loadHearts = (scene) => {
    scene.load.spritesheet(
        'heartRed',
        'src/assets/images/spritesheets/UI/heart_red_spritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 2 });
    
    scene.load.spritesheet(
       'heartBlue',
        'src/assets/images/spritesheets/UI/heart_blue_spritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 2 });
    
    scene.load.spritesheet(
        'heartGreen',
        'src/assets/images/spritesheets/UI/heart_green_spritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 2 });
        
    scene.load.spritesheet(
        'heartTransparent',
        'src/assets/images/spritesheets/UI/heart_transparent_spritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 2 });
};

const createHeartAnimation = (scene) => {
    scene.anims.create({
        key: 'heartRed',
        frames: scene.anims.generateFrameNames('heartRed', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        yoyo: true,
        loop: true
        });
    
    scene.anims.create({
         key: 'heartBlue',
        frames: scene.anims.generateFrameNames('heartBlue', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        yoyo: true,
        loop: true
        });
        
    scene.anims.create({
        key: 'heartGreen',
        frames: scene.anims.generateFrameNames('heartGreen', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        loop: true
        });

    scene.anims.create({
        key: 'heartTransparent',
        frames: scene.anims.generateFrameNames('heartTransparent', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        loop: true
        });
};

class Heart extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'heart' + type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setScale(0.2);
        

        switch (type) {
            case heartType.Type1:
                this.health = 1;
                this.shield = 0;
                this.maxHitpointsIncrease = 0;
                break;
            case heartType.Type2:
                this.health = 2;
                this.shield = 1;
                this.maxHitpointsIncrease = 0;
                break;
            case heartType.Type3:
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 1;
                break;
        }

        // Register this enemy instance with the physics world
        this.scene.physics.world.add(this);
        
    }
}

const drawUiHearts = (scene, type = 'Red') => {
    createHeartAnimation(scene);

    const centerX = scene.cameras.main.width / 2;
    const heartSpacing = 32;

    //Draw transparent hearts for the player's max hitpoints
    for (let i = 0; i < scene.player.maxHitpoints; i++) {
        const transparentHeart = scene.add.sprite(centerX + (heartSpacing * i), 30, 'heartTransparent').setScrollFactor(0).setDepth(1).setScale(0.2);
        transparentHeart.setFrame(0); // Set the first frame
        transparentHeart.anims.play('heartTransparent', true);
    }

    //Fill hearts for the player's hitpoints
    for (let i = 0; i < scene.player.hitpoints; i++) {
        const heart = scene.add.sprite(centerX + (heartSpacing * i), 30, 'heart' + type).setScrollFactor(0).setDepth(1).setScale(0.19);
        scene.hearts.push(heart);
        heart.setFrame(0); // Set the first frame
        heart.anims.play('heart' + type, true);
    }

};

const removeHeart = (scene, enemyDamage) => {
    for (let i = scene.hearts.length - 1 ; i > enemyDamage ; i--) {
        scene.hearts[i].destroy();
        scene.hearts.splice(i, 1);
    }
}

/* const spawnHearts = (scene, currentTime) => {
    if (currentTime - scene.lastHeartSpawnTime < scene.heartSpawnInterval && scene.hearts.length < scene.maxHeartsOnScreen) {
        const heart_type = Phaser.Math.Between(heartType.Type1, heartType.Type3);
        const heart = new Heart(scene, Phaser.Math.Between(0, window.innerWidth), Phaser.Math.Between(0, window.innerHeight), heart_type);
        heart.setData('health', heart.health);
        heart.setData('shield', heart.shield);
        heart.setData('maxHitpointsIncrease', heart.maxHitpointsIncrease);
        heart.setData('type', heart_type);
        scene.hearts.push(heart);
    };
}; */



export { Heart, loadHearts, drawUiHearts, removeHeart };