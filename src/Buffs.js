import * as Phaser from 'phaser';

const buffType = {
    Type1: 'greenBuff',
    Type2: 'blueBuff',
    Type3: 'blackBuff'
}

const buffChance = {
    greenBuff: 0.5,
    blueBuff: 0.5,
    blackBuff: 0.5
}

const loadBuffs = (scene) => {
    scene.load.spritesheet(
        'greenBuff',
        'src/assets/images/spritesheets/buffs/greenBuffSpritesheet.png',
        { frameWidth: 16, frameHeight: 16 });
    
    scene.load.spritesheet(
        'blueBuff',
        'src/assets/images/spritesheets/buffs/blueBuffSpritesheet.png',
        { frameWidth: 16, frameHeight: 16 });

    scene.load.spritesheet(
        'blackBuff',
        'src/assets/images/spritesheets/buffs/blackBuffSpritesheet.png',
        { frameWidth: 16, frameHeight: 16 });    
};

const createBuffsAnimation = (scene) => {
    scene.anims.create({
        key: 'greenBuff',
        frames: scene.anims.generateFrameNames('greenBuff', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        loop: true
        });
    
     scene.anims.create({
        key: 'blueBuff',
        frames: scene.anims.generateFrameNames('blueBuff', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        loop: true
        });
  
    scene.anims.create({
        key: 'blackBuff',
        frames: scene.anims.generateFrameNames('blackBuff', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        loop: true
        });
};

const playBuffsAnimation = (scene, buff) => {
    switch (buff.type) {
        case 'greenBuff':
            buff.anims.play('greenBuff', true);
            break;
        case 'blueBuff':
            buff.anims.play('blueBuff', true);
            break;
        case 'blackBuff':
            buff.anims.play('blackBuff', true);
            break;
    }
};

class Buffs extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setScale(2.5);       

        switch (type) {
            case buffType.Type1:
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 1;
                this.speed = 1.5;
                this.damage = 1.3;
                this.duration = 5000;
                this.fireRateType = 0;
                break;
            case buffType.Type2:
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 2;
                this.speed = 1.7;
                this.damage = 1.3;
                this.duration = 10000;
                this.fireRateType = 0;
                break;
            case buffType.Type3:
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 3;
                this.speed = 2;
                this.damage = 1.5;
                this.duration = 15000;
                this.fireRateType = 1;
                break;
        }        
    }
}

let lastSpawnedBuffType = null; // Initialize a variable to store the last spawned buff type

const spawnBuffs = (scene, currentTime) => {
    if (currentTime - scene.lastBuffSpawnTime > scene.buffSpawnInterval && scene.buffsGroup.getChildren().length < scene.maxBuffsOnScreen) {
        scene.lastBuffSpawnTime = currentTime;
        const randomSpawnChance = Math.random();
        let accumulatedChance = 0;

        // Iterate through each buff type and calculate accumulated chances
        for (const buffColorType in buffType) {
            const actualBuff = buffType[buffColorType];
            const actualBuffChance = buffChance[actualBuff];


            // Check if the current buff type is the same as the last spawned buff type
            if (lastSpawnedBuffType === actualBuff) {
                continue;
            }
            accumulatedChance += actualBuffChance;

            if (randomSpawnChance <= accumulatedChance) {
                const Buff = new Buffs(scene, Phaser.Math.Between(0, window.innerWidth), Phaser.Math.Between(0, window.innerHeight), actualBuff);
                playBuffsAnimation(scene, Buff);
                scene.buffsGroup.add(Buff);
                lastSpawnedBuffType = actualBuff;

                accumulatedChance = 0;

                break;
            }
        }
    }
}

export { Buffs, loadBuffs, createBuffsAnimation, spawnBuffs };
