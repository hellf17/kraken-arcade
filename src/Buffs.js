import * as Phaser from 'phaser';

const buffType = {
    Type1: 'green',
    Type2: 'blue',
    Type3: 'black'
};

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
            case buffType.Type1:
                this.type = buffType.Type1;
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 1;
                this.speed = 1.1;
                this.damage = 1;
                this.durarion = 5000;
                break;
            case buffType.Type2:
                this.type = buffType.Type2;
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 1;
                this.speed = 1;
                this.damage = 1.2;
                this.durarion = 10000;
                break;
            case buffType.Type3:
                this.type = buffType.Type3;
                this.health = 1;
                this.shield = 1;
                this.maxHitpointsIncrease = 1;
                this.speed = 1.2;
                this.damage = 1.25;
                this.durarion = 15000;
                break;
        }        
    }
}

const buffSpawnChances = [
    { type: buffType.Type1, chance: 0.55 },  // 15% chance
    { type: buffType.Type2, chance: 0.50 },  // 10% chance
    { type: buffType.Type3, chance: 0.35 },  // 5% chance
];

const spawnBuffs = (scene, currentTime) => {
    if (currentTime - scene.lastBuffSpawnTime > scene.buffSpawnInterval && scene.buffsGroup.getChildren().length < scene.maxBuffsOnScreen) {
        scene.lastBuffSpawnTime = currentTime;
        const randomSpawnChance = Math.random();
        let accumulatedChance = 0;

        for (const BuffSpawnChance of buffSpawnChances) {
            accumulatedChance += BuffSpawnChance.chance;
          
            if (randomSpawnChance <= accumulatedChance) {
                const buff_type = BuffSpawnChance.type;
                const Buff = new Buffs(scene, Phaser.Math.Between(0, window.innerWidth), Phaser.Math.Between(0, window.innerHeight), buff_type);
                playBuffsAnimation(scene, Buff);
                scene.buffsGroup.add(Buff);
            }
            break;
        }
    }
}


export { Buffs, loadBuffs, createBuffsAnimation, spawnBuffs };
