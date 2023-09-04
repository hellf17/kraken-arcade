import * as Phaser from 'phaser';

const debuffType = {
    Type1: 'fog',
    Type2: 'tsunami'
};

const loadDebuffs = (scene) => {
    scene.load.spritesheet(
        'fog',
        'src/assets/images/spritesheets/debuffs/fog_spritesheet.png',
        { frameWidth: 94, frameHeight: 73 });
    
/*     scene.load.spritesheet(
        'tsunami',
        'src/assets/images/spritesheets/debuffs/tsunami_spritesheet.png',
        { frameWidth: 91, frameHeight: 100, spacing: 19 }); */
    
};

const createDebuffsAnimation = (scene) => {
    scene.anims.create({
        key: 'fog',
        frames: scene.anims.generateFrameNames('fog', { start: 0, end: 15 }),
        frameRate: 16,
        repeat: -1,
        loop: true
        });
    
/*     scene.anims.create({
         key: 'tsunami',
        frames: scene.anims.generateFrameNames('tsunami', { start: 0, end: 4 }),
        frameRate: 5,
        repeat: -1,
        loop: true
        }); */
};

const playDebuffsAnimation = (scene, debuff) => {
    switch (debuff.type) {
        case debuffType.Type1:
            debuff.anims.play('fog', true);
            break;
        // case debuffType.Type2:
        //     debuff.anims.play('tsunami', true);
        //     break;
    }
};

class Debuffs extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setScale(6);       

        switch (type) {
            case debuffType.Type1:
                this.type = debuffType.Type1;
                this.setAlpha(0.65);
                this.setDepth(4); 
                break;
            case debuffType.Type2:
                this.type = debuffType.Type2;
                this.setAlpha(0.8);
                this.setDepth(4); 
                break;
        }        
    }
}

const debuffSpawnChances = [
    { type: debuffType.Type1, chance: 0.25 },  // 25% chance
//    { type: debuffType.Type2, chance: 0.15 },  // 25% chance
];

const spawnDebuffs = (scene, currentTime) => {
    if (currentTime - scene.lastDebuffSpawnTime > scene.debuffSpawnInterval && scene.debuffsGroup.getChildren().length < scene.maxDebuffsOnScreen) {
        scene.lastDebuffSpawnTime = currentTime;
        const randomSpawnChance = Math.random();

        let accumulatedChance = 0;
        for (const debuffSpawnChance of debuffSpawnChances) {
            accumulatedChance += debuffSpawnChance.chance;
            if (randomSpawnChance <= accumulatedChance) {
                const debuff_type = debuffSpawnChance.type;
                
                //Check the debuff type
                if (debuff_type == debuffType.Type1) {
                    //Spawn multiple sprites for 'fog' debuff
                    const numberOfFogSprites = 25; // Adjust the number of fog sprites as needed

                    for (let i = 0; i < numberOfFogSprites; i++) {
                        //Create a fog sprite with random positions
                        const fog = new Debuffs(scene, Phaser.Math.Between(0, window.innerWidth), Phaser.Math.Between(0, window.innerHeight), debuff_type);
                        playDebuffsAnimation(scene, fog);
                        scene.debuffsGroup.add(fog);
                    }

                    //Delayed removal for 'fog' sprites
                    setTimeout(() => {
                        console.log('Removing fog sprites');
                        scene.debuffsGroup.getChildren().forEach((debuff) => {
                            if (debuff.type == debuffType.Type1) {
                                debuff.destroy();
                            }
                        });
                    }, 5000);
                } else {
                    //Spawn a single sprite for other debuff types
                    const debuff = new Debuffs(scene, Phaser.Math.Between(0, window.innerWidth), Phaser.Math.Between(0, window.innerHeight), debuff_type);
                    debuff.setData('type', debuff.type);
                    playDebuffsAnimation(scene, debuff);
                    scene.debuffsGroup.add(debuff);
                }
                console.log('debuffsGroup: ', scene.debuffsGroup.getChildren().length);
                break;
            }
        }
    }
};


export { Debuffs, loadDebuffs, createDebuffsAnimation, spawnDebuffs };