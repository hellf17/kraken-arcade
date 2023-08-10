import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import Player from './Phaser/Classes/Entities/Player/Player.js';


import kraken1IdleSheet from './assets/images/spritesheets/kraken-player/kraken1-idle-sheet.png';
import kraken2IdleSheet from './assets/images/spritesheets/kraken-player/kraken2-idle-sheet.png';

import backgroundSpaceDesert from './assets/images/still-image/background1.png';
import backgroundSpacePurple from './assets/images/still-image/background2.png';

import enemy1 from './assets/images/still-image/enemies/enemy_1.png';
import enemy2 from './assets/images/still-image/enemies/enemy_2.png';
import enemy3 from './assets/images/still-image/enemies/enemy_3.png';

import item1 from './assets/images/still-image/items/buff1.png';
import item2 from './assets/images/still-image/items/buff2.png';
import item3 from './assets/images/still-image/items/buff3.png';

import projectile1 from './assets/images/still-image/projectiles/projectile.png';

/*
import backgroundMusic1 from './assets/audio/background1.mp3';
import backgroundMusic2 from './assets/audio/background2.mp3';
import backgroundMusic3 from './assets/audio/background3.wav';

import projectileSound1 from './assets/audio/projectile.mp3';
*/


//Create a new Phaser game with Arcade physics
class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super("MyGame");
    }

    preload ()
    {

        //Load all audio, images, spritesheets, etc
        //Separate them into different functions, which we will make below the preload function
        //this.loadImages()
        //this.loadAudio()
        //this.loadSpritesheets()
        //this.loadTilemaps()

        this.loadImages();
        this.loadSpritesheets();
        this.loadAudio();

    }

    loadImages(){

        //test logo that is in the Phaser template repository
        this.load.image('logo', logoImg);
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
        /*
        this.load.image('background-space-desert', 'assets/images/still-image/background1.png');
        this.load.image('background-space-purple', 'assets/images/still-image/background2.png');
        //Enemies
        this.load.image('enemy1', 'assets/images/still-image/enemies/enemy_1.png');
        this.load.image('enemy2', 'assets/images/still-image/enemies/enemy_2.png');
        this.load.image('enemy3', 'assets/images/still-image/enemies/enemy_3.png');
        //Items (Called "buffs")
        this.load.image('item1', 'assets/images/still-image/items/buff1.png');
        this.load.image('item2', 'assets/images/still-image/items/buff2.png');
        this.load.image('item3', 'assets/images/still-image/items/buff3.png');
        //Projectile(s)
        this.load.image('projectile1', 'assets/images/still-image/projectiles/projectile.png');
        */

    }

    loadAudio(){

        /*
        //All audio should be in .WAV format, but this should be fine for now.
        //Background Music
        this.load.audio('background-music-1', 'assets/audio/background1.mp3');
        this.load.audio('background-music-2', 'assets/audio/background2.mp3');
        this.load.audio('background-music-3', 'assets/audio/background3.wav');
        //Projectile Sound(s)
        this.load.audio('projectile-sound-1', 'assets/audio/projectile.mp3');
        */

        //Background Music
        /*
        this.load.audio('background-music-1', backgroundMusic1);
        this.load.audio('background-music-2', backgroundMusic2);
        this.load.audio('background-music-3', backgroundMusic3);

        //Projectile Sound(s)
        this.load.audio('projectile-sound-1', projectileSound1);
        */
    }

    //A spritesheet is a .png file that contains all the frames of an animation.
    //We will need to create spritesheets for the player, enemies, projectiles, and everything else that has an animation.
    //There are other ways to have animations, but spritesheets are generally what we use.
    //There is code that we have in the pseudo-kraken game that loads spritesheets, from metadata that is pulled from the NFT smart contracts for pseudo-krakens.
    //I will have to review how we did that, and then implement it here, if we want the player to use their own kraken(s) as their in-game character for the arcade-kraken shooter.
    loadSpritesheets(){

        //Load all the spritesheets in the spritesheets folder

        //Player spritesheet
        this.load.spritesheet('player-idle', kraken1IdleSheet,
        {
            frameWidth: 183,
            frameHeight: 183
        });

        /*
        this.load.spritesheet('player2-idle', kraken2IdleSheet,
        {
            frameWidth: 183,
            frameHeight: 183
        });
        */
        
        /*
        //Player spritesheet
        this.load.spritesheet('player1-idle', 'assets/images/spritesheets/kraken-player/kraken1-idle-sheet.png', 
        { 
            frameWidth: 183, 
            frameHeight: 183
        });

        /*
        this.load.spritesheet('player2-idle', 'assets/images/spritesheets/kraken-player/kraken2-idle-sheet.png', { 
            frameWidth: 183, 
            frameHeight: 183
        });
        */
       
    }

    //Here we create the animations from spritesheets that we loaded in the loadSpritesheets() function.
    createAnims(){

        //The below code is from the Phaser 3 documentation, and is an example of how to create an animation from a spritesheet.
        this.anims.create({
            key: "player-idle",
            frames: this.anims.generateFrameNumbers('player-idle'),
            frameRate: 12,
            repeat: -1
        });

        this.tweens.add({
            targets: this.player,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });

        /*
        this.anims.create({
            key: "player2-idle",
            frames: this.anims.generateFrameNumbers('player2-idle'),
            frameRate: 5,
            repeat: -1
        })
        */

        //We will need to make animations for enemies, buffs, and everything else.
        //We can do this later. It is not vital for functionality.



    }

    addBackground(){

        const background = this.add.image(400, 300, 'background-space-desert');
        background.setScale(1.5);

    }
      
    create ()
    {
        //const logo = this.add.image(400, 150, 'logo');
      
        /*
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });
        */
        this.addBackground();

        this.createAnims();

        //Add the player to the game
        this.player = new Player(this, 400, 300, 'player-idle');
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame,
    crossOrigin: "anonymous",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }

    //set the CORS header for the images to anonymous


};

const game = new Phaser.Game(config);
