import * as Phaser from 'phaser';

import kraken1IdleSheet from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/spritesheets/kraken-player/kraken1-idle-sheet.png';

import backgroundSpaceDesert from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/background2.png';
import backgroundSpacePurple from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/background1.png';

import enemy1 from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/enemies/enemy_1.png';
import enemy2 from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/enemies/enemy_2.png';
import enemy3 from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/enemies/enemy_3.png';

import item1 from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/items/buff1.png';
import item2 from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/items/buff2.png';
import item3 from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/items/buff3.png';

import projectile1 from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/assets/images/still-image/projectiles/projectile.png';

import Player from '/Users/umbra/Desktop/TridentCommunityDev/TridentCommunityCode/kraken-arcade/src/Phaser/Classes/Entities/Player/Player.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // load images
    this.loadImages();
    // load spritesheets
    this.loadSpriteSheets();
    // load audio
    this.loadAudio();
    // load tilemap
    //this.loadTileMap();
  }

  loadImages() {
    /*
    this.load.image('button1', 'assets/images/button1.png');
    this.load.image('button2', 'assets/images/button2.png');
    */
    
    //Load all the assets/images/still-image in the images folder
     //Backgrounds
    this.load.image('background-space-desert', backgroundSpaceDesert);
    this.load.image('background-space-purple', backgroundSpacePurple);

    //Enemies
    this.load.image('enemy1', enemy1);
    this.load.image('enemy2', enemy2);
    this.load.image('enemy3', enemy3);

    //Items (Called "buffs")
    this.load.image('item1', item1);
    this.load.image('item2', item2);
    this.load.image('item3', item3);

    //Projectile(s)
    this.load.image('projectile1', projectile1);
  }

  loadSpriteSheets() {

    this.load.spritesheet('player-idle', kraken1IdleSheet,
        {
            frameWidth: 183,
            frameHeight: 183
        });

  }

  createAnims(){

    //The below code is from the Phaser 3 documentation, and is an example of how to create an animation from a spritesheet.
    this.anims.create({
        key: "player-idle",
        frames: this.anims.generateFrameNumbers('player-idle'),
        frameRate: 12,
        repeat: -1
    });

    //Tweens add smoothness to animations
    this.tweens.add({
        targets: this.player,
        y: 450,
        duration: 2000,
        ease: "Power2",
        yoyo: true,
        loop: -1
    });
    //We will need to make animations for enemies, buffs, and everything else.
    //We can do this later. It is not vital for functionality.
    }

    addBackground(){

        const background = this.add.image(400, 300, 'background-space-desert');
        background.setScale(1.5);

    }

  loadAudio() {

  }

  //We are not loading a tile map in the Kraken Arcade Shooter, but we might at some point
  /*
  loadTileMap() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/level/large_level.json');
  }
  */

  create() {
    this.scene.start('Title');
  }
}