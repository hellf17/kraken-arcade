import * as Phaser from 'phaser';

const buffType = [
    { type: 'greenBuff', chance: 0.20 },
    { type: 'blueBuff', chance: 0.15 },
    { type: 'blackBuff', chance: 0.10 },
];

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
        case buffType.Type1:
            buff.anims.play('greenBuff', true);
            break;
        case buffType.Type2:
            buff.anims.play('blueBuff', true);
             break;
        case buffType.Type3:
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
            case buffType.greenBuff:
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 3;
                this.speed = 2;
                this.damage = 2;
                this.duration = 5000;
                break;
            case buffType.blueBuff:
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 3;
                this.speed = 1;
                this.damage = 2;
                this.duration = 10000;
                break;
            case buffType.blackBuff:
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 3;
                this.speed = 2;
                this.damage = 2;
                this.duration = 15000;
                break;
        }        
    }
}

let lastSpawnedBuffType = null; // Initialize a variable to store the last spawned buff type

const spawnBuffs = (scene, currentTime) => {
    if (currentTime - scene.lastBuffSpawnTime > scene.buffSpawnInterval && scene.buffsGroup.getChildren().length < scene.maxBuffsOnScreen) {
        scene.lastBuffSpawnTime = currentTime;
        const randomSpawnChance = Math.random();
        console.log(randomSpawnChance);
        let accumulatedChance = 0;

        // Iterate through each buff type and calculate accumulated chances
        for (const buffColors in buffType) {
            const actualBuff = buffType[buffColors];

            // Check if the current buff type is the same as the last spawned buff type
            if (lastSpawnedBuffType === actualBuff.type) {
                continue;
            }
            accumulatedChance += actualBuff.chance;

            if (randomSpawnChance <= accumulatedChance) {
                const buff_type = actualBuff.type;
                const Buff = new Buffs(scene, Phaser.Math.Between(0, window.innerWidth), Phaser.Math.Between(0, window.innerHeight), buff_type);
                
                Buff.setData('type', buff_type);
                Buff.setData('duration', Buff.duration);
                Buff.setData('health', Buff.health);
                Buff.setData('shield', Buff.shield);
                Buff.setData('maxHitpointsIncrease', Buff.maxHitpointsIncrease);
                Buff.setData('speed', Buff.speed);
                Buff.setData('damage', Buff.damage);
                
                playBuffsAnimation(scene, Buff);
                scene.buffsGroup.add(Buff);
                lastSpawnedBuffType = buff_type; 

                accumulatedChance = 0;

                break;
            }
        }
    }
}

export { Buffs, loadBuffs, createBuffsAnimation, spawnBuffs };
