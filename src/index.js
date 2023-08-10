import Phaser from 'phaser';
import logoImg from './assets/logo.png';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
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
        this.createAnims();
        this.loadAudio();

    }

    loadImages(){

        //test logo that is in the Phaser template repository
        this.load.image('logo', logoImg);
        //Load all the assets/images/still-image in the images folder
        //Backgrounds
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

    }

    loadAudio(){

        //All audio should be in .WAV format, but this should be fine for now.
        //Background Music
        this.load.audio('background-music-1', 'assets/audio/background1.mp3');
        this.load.audio('background-music-2', 'assets/audio/background2.mp3');
        this.load.audio('background-music-3', 'assets/audio/background3.wav');
        //Projectile Sound(s)
        this.load.audio('projectile-sound-1', 'assets/audio/projectile.mp3');
    }

    //A spritesheet is a .png file that contains all the frames of an animation.
    //We will need to create spritesheets for the player, enemies, projectiles, and everything else that has an animation.
    //There are other ways to have animations, but spritesheets are generally what we use.
    //There is code that we have in the pseudo-kraken game that loads spritesheets, from metadata that is pulled from the NFT smart contracts for pseudo-krakens.
    //I will have to review how we did that, and then implement it here, if we want the player to use their own kraken(s) as their in-game character for the arcade-kraken shooter.
    loadSpritesheets(){
        
        //Player spritesheet
        this.load.spritesheet('player1', 'assets/images/spritesheets/kraken-player/kraken1-idle-sheet.png', { frameWidth: 145, frameHeight: 145 });
        this.load.spritesheet('player2', 'assets/images/spritesheets/kraken-player/kraken2-idle-sheet.png', { frameWidth: 145, frameHeight: 145 });
    }

    //Here we create the animations from spritesheets that we loaded in the loadSpritesheets() function.
    createAnims(){

        //The below code is from the Phaser 3 documentation, and is an example of how to create an animation from a spritesheet.
        this.anims.create({
            key: 'player1-idle',
            frames: this.anims.generateFrameNumbers('player1'),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'player2-idle',
            frames: this.anims.generateFrameNumbers('player2'),
            frameRate: 5,
            repeat: -1
        })

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

        //Add the player to the game
        this.player = this.physics.add.sprite(100, 450, 'player1');
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);
