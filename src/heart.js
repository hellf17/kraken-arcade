import * as Phaser from 'phaser';

const heartType = {
    Type1: 'Red',
    Type2: 'Blue',
    Type3: 'Green'
};

const heartChance = {
    Red: 0.2,
    Blue: 0.15,
    Green: 0.05
}

const loadHearts = (scene) => {
    scene.load.spritesheet(
        'heartRed',
        'src/assets/images/spritesheets/UI/heart_red_spritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 0 });
    
    scene.load.spritesheet(
       'heartBlue',
        'src/assets/images/spritesheets/UI/heart_blue_spritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 0 });
    
    scene.load.spritesheet(
        'heartGreen',
        'src/assets/images/spritesheets/UI/heart_green_spritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 0 });
        
    scene.load.spritesheet(
        'heartTransparent',
        'src/assets/images/spritesheets/UI/heart_transparent_spritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 0 });
    
    scene.load.spritesheet(
        'shield',
        'src/assets/images/spritesheets/UI/shieldSpritesheet.png',
        { frameWidth: 110, frameHeight: 100, spacing: 0 });
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

    scene.anims.create({
        key: 'shield',
        frames: scene.anims.generateFrameNames('shield', { start: 0, end: 4 }),
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
        this.setScale(0.3);
        

        switch (type) {
            case heartType.Type1:
                this.health = 1;
                this.shield = 0;
                this.maxHitpointsIncrease = 0;
                this.type = heartType.Type1;
                break;
            case heartType.Type2:
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 0;
                this.type = heartType.Type2;
                break;
            case heartType.Type3:
                this.health = 2;
                this.shield = 2;
                this.maxHitpointsIncrease = 1;
                this.type = heartType.Type3;
                break;
        }        
    }
}

const drawUiMaxHearts = (scene) => {
    const centerX = scene.cameras.main.width / 2;
    const heartSpacing = 32;

    //Draw transparent hearts for the player's max hitpoints
    for (let i = 0; i < scene.player.maxHitpoints; i++) {
        const transparentHeart = scene.add.sprite(centerX + (heartSpacing * i), 30, 'heartTransparent').setScrollFactor(0).setDepth(1).setScale(0.2);
        transparentHeart.setFrame(0); // Set the first frame
        transparentHeart.anims.play('heartTransparent', true);
    }
};

const drawUiHearts = (scene, type = 'Red') => {
    const centerX = scene.cameras.main.width / 2;
    const heartSpacing = 32;

    //Fill hearts for the player's hitpoints
    for (let i = 0; i < scene.player.hitpoints; i++) {
        const heart = scene.add.sprite(centerX + (heartSpacing * i), 30, 'heart' + type).setScrollFactor(0).setDepth(1).setScale(0.19);
        heart.setFrame(0); // Set the first frame
        heart.anims.play('heart' + type, true);
        scene.heartsUiGroup.add(heart);
    }

};

const addUiHeart = (scene, health, type = 'Red') => {
    const lastHeart = scene.heartsUiGroup.getChildren()[scene.heartsUiGroup.getChildren().length - 1];
    const heartSpacing = 32;

    // Draw hearts based on the heart health value
    for (let i = 0; i < health; i++) {
        const heartX = lastHeart.x + heartSpacing;
        const heart = scene.add.sprite(heartX, 30, ('heart' + type )).setScrollFactor(0).setDepth(1).setScale(0.19);
        heart.setFrame(0); // Set the first frame
        heart.anims.play('heart' + type, true);
        scene.heartsUiGroup.add(heart);
    }
}

const removeUiHeart = (scene, enemyDamage) => {
    for (let i = 0; i < enemyDamage; i++) {
        if (scene.heartsUiGroup.getChildren().length > 0) {
            const lastHeart = scene.heartsUiGroup.getChildren()[scene.heartsUiGroup.getChildren().length - 1];
            lastHeart.destroy();
        }
    }
}

const addShield = (scene, shield) => {
    const centerX = scene.cameras.main.width / 2;
    const shieldSpacing = 32;

    // Draw Shield based on the heart shield value if shield is not empty
    if (scene.shieldUiGroup.getChildren().length > 0) {
        const lastShield = scene.shieldUiGroup.getChildren()[scene.shieldUiGroup.getChildren().length - 1];
        
        for (let i = 0; i < shield; i++) {
            const shieldX = lastShield.x + shieldSpacing;
            const shield = scene.add.sprite(shieldX, 60, 'shield').setScrollFactor(0).setDepth(1).setScale(0.25);
            shield.setFrame(0); // Set the first frame
            shield.anims.play('shield', true);
            scene.shieldUiGroup.add(shield);
        }

    } else { //Draw only the first shield if shield is empty
        const shieldX = centerX;
        const shield = scene.add.sprite(shieldX, 60, 'shield').setScrollFactor(0).setDepth(1).setScale(0.25);
        shield.setFrame(0); // Set the first frame
        shield.anims.play('shield', true);
        scene.shieldUiGroup.add(shield);
        }
}

const removeUiShield = (scene, enemyDamage) => {
    for (let i = 0; i < enemyDamage; i++) {
        if (scene.shieldUiGroup.getChildren().length > 0) {
            const lastShield = scene.shieldUiGroup.getChildren()[scene.shieldUiGroup.getChildren().length - 1];
            lastShield.destroy();
        }
    }
}

const spawnHearts = (scene, currentTime) => {
    if (currentTime - scene.lastHeartSpawnTime > scene.heartSpawnInterval && scene.heartGameGroup.getChildren().length < scene.maxHeartsOnScreen) {
        scene.lastHeartSpawnTime = currentTime;
        const randomSpawnChance = Math.random();
        let accumulatedChance = 0;

        //Iterate through the heart types and calculate accumulated chances
        for (const heartColorType in heartType) {
            const actualHeart = heartType[heartColorType];
            const actualHeartChance = heartChance[actualHeart];

            accumulatedChance += actualHeartChance;

            if (randomSpawnChance <= accumulatedChance) {
                const heart = new Heart(scene, Phaser.Math.Between(0, window.innerWidth), Phaser.Math.Between(0, window.innerHeight), actualHeart);
                scene.heartGameGroup.add(heart);
                accumulatedChance = 0;
                break;
            }
        }
    }
};


export { Heart, loadHearts, createHeartAnimation, drawUiMaxHearts, drawUiHearts, removeUiHeart, addUiHeart, addShield, removeUiShield, spawnHearts };