import * as Phaser from 'phaser';

const buffType = {
    Type1: 'green',
    Type2: 'blue',
    Type3: 'black'
};

const loadBuffs = (scene) => {
    scene.load.spritesheet(
        'greenBuff',
        'src/assets/images/spritesheets/buffs/greenBuff_spritesheet.png',
        { frameWidth: 94, frameHeight: 73 });
    
    scene.load.spritesheet(
        'blueBuff',
        'src/assets/images/spritesheets/buffs/blueBuff_spritesheet.png',
        { frameWidth: 94, frameHeight: 73 });

    scene.load.spritesheet(
        'blackBuff',
        'src/assets/images/spritesheets/buffs/blackBuff_spritesheet.png',
        { frameWidth: 94, frameHeight: 73 });
    
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
            debuff.anims.play('greenBuff', true);
            break;
        case buffType.Type2:
             debuff.anims.play('blueBuff', true);
             break;
        case buffType.Type3:
             debuff.anims.play('blackBuff', true);
             break;
    }
};

class Buffs extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setScale(1);       

        switch (type) {
            case buffType.Type1:
                this.type = buffType.Type1;
                this.health = 1;
                this.speed = 1.1;
                break;
            case buffType.Type2:
                this.type = buffType.Type2;
                this.health = 1;
                this.speed = 1;
                this.damage = 1.2;
                break;
            case buffType.Type3:
                this.type = buffType.Type3;
                this.health = 1;
                this.speed = 1.1;
                this.damage = 1.25;
                break;
        }        
    }
}

const buffSpawnChances = [
    { type: buffType.Type1, chance: 0.15 },  // 15% chance
    { type: buffType.Type2, chance: 0.10 },  // 10% chance
    { type: buffType.Type3, chance: 0.05 },  // 5% chance
];

const spawnBuffs = (scene, currentTime) => {
    if (currentTime - scene.lastBuffSpawnTime > scene.buffSpawnInterval && scene.buffsGroup.getChildren().length < scene.maxBuffsOnScreen) {
        scene.lastBuffSpawnTime = currentTime;
        const randomSpawnChance = Math.random();
        let accumulatedChance = 0;

        for (const BuffSpawnChance of buffSpawnChances) {
            accumulatedChance += buffSpawnChance.chance;
          
            if (randomSpawnChance <= accumulatedChance) {
                const buff_type = buffSpawnChance.type;
                const Buff = new Buffs(scene, Phaser.Math.Between(0, window.innerWidth), Phaser.Math.Between(0, window.innerHeight), debuff_type);
                playBuffsAnimation(scene, Buff);
                scene.buffsGroup.add(Buff);
            }
            break;
        }
    }
}


export { Buffs, loadBuffs, createBuffsAnimation, spawnBuffs };
