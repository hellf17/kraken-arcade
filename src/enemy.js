import * as Phaser from 'phaser';

const EnemyType = {
    Type1: 0,
    Type2: 1,
    Type3: 2
};

const loadEnemies = (scene) => {
    scene.load.image('enemy1', 'src/assets/images/still-image/enemies/enemy1.png');
    scene.load.image('enemy2', 'src/assets/images/still-image/enemies/enemy2.png');
    scene.load.image('enemy3', 'src/assets/images/still-image/enemies/enemy3.png');
};

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'enemy' + type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.setScale(0.17);
        

        switch (type) {
            case EnemyType.Type1:
                this.hitpoints = 3;
                this.speed = 70;
                this.xpReward = 10;
                break;
            case EnemyType.Type2:
                this.hitpoints = 5;
                this.speed = 90;
                this.xpReward = 15;
                break;
            case EnemyType.Type3:
                this.hitpoints = 7;
                this.speed = 110;
                this.xpReward = 20;
                break;
        }
        // Register this enemy instance with the physics world
        this.scene.physics.world.add(this);
        
    }

    receiveDamage(damage) {
        this.hitpoints -= damage;

        if (this.hitpoints <= 0) {
            this.destroy();
        }
    }
}

const spawnEnemy = (scene, currentTime) => {
    const elapsedTimeSinceLastIncrease = currentTime - scene.lastEnemyIncreaseTime;

    // Increase maxEnemiesOnScreen every enemyIncreaseInterval
    if (elapsedTimeSinceLastIncrease >= scene.maxEnemyIncreaseInterval) {
        scene.maxEnemiesOnScreen += 2;
        scene.lastEnemyIncreaseTime = currentTime;
    }

    if (scene.enemiesGroup.getChildren().length < scene.maxEnemiesOnScreen) {
        // Spawn outside the screen
        const spawnSide = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left
        let spawnX, spawnY;

        switch (spawnSide) {
            case 0:
                spawnX = Phaser.Math.Between(0, window.innerWidth);
                spawnY = -32; // Above the screen
                break;
            case 1:
                spawnX = window.innerWidth + 32; // Right of the screen
                spawnY = Phaser.Math.Between(0, window.innerHeight);
                break;
            case 2:
                spawnX = Phaser.Math.Between(0, window.innerWidth);
                spawnY = window.innerHeight + 32; // Below the screen
                break;
            case 3:
                spawnX = -32; // Left of the screen
                spawnY = Phaser.Math.Between(0, window.innerHeight);
                break;
        }

        const enemyType = Phaser.Math.Between(EnemyType.Type1, EnemyType.Type3);
        const enemy = new Enemy(scene, spawnX, spawnY, enemyType);
        enemy.setData('speed', enemy.speed);
        scene.enemiesGroup.add(enemy);
    }
};

const trackPlayerAndMove = (scene, enemiesGroup) => {
    enemiesGroup.getChildren().forEach((enemy) => {
        const player = scene.player;
        const speed = enemy.getData('speed');
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        enemy.setVelocity(velocityX, velocityY);
    });
};

export { loadEnemies, spawnEnemy, trackPlayerAndMove };


//export const loadEnemies = (scene: Phaser.Scene): void => {
//Load enemy images and animations
//    scene.load.spritesheet('enemy-' + EnemyType.Type1, 'assets/enemies/enemy-type1.png', { frameWidth: 32, frameHeight: 32 });
//    scene.load.spritesheet('enemy-' + EnemyType.Type2, 'assets/enemies/enemy-type2.png', { frameWidth: 32, frameHeight: 32 });
//    scene.load.spritesheet('enemy-' + EnemyType.Type3, 'assets/enemies/enemy-type3.png', { frameWidth: 32, frameHeight: 32 });};