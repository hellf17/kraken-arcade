import * as Phaser from 'phaser';


class EndMenu extends Phaser.Scene {
    constructor() {
        super('EndMenu');
    }

    init (data)
    {
        this.xp = data.xp;
        this.timer = data.timer;
        this.kills = data.kills;
    }


    preload() {
        this.load.spritesheet('share', './src/assets/images/buttons/shareButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('connect', './src/assets/images/buttons/connectButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('registerScore', './src/assets/images/buttons/registerScoreButton.png', { frameWidth: 300, frameHeight: 100 });
        //this.load.audio('endMenuMusic', './src/assets/audio/EndMenuMusic.mp3');
    }

    create() {
    //Get the width and height of the current scene
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // Set's the background image
    const background = this.add.sprite(screenWidth / 2, screenHeight / 2, 'gameOverBackground');
    // Insert a red filter to the background
    background.setTint(0xff0000);
    
    // Show the player's score, time survived and enemies killed - received from the player file as xp, time and kills
    const scoreText = this.add.text(screenWidth / 2 - 200, screenHeight / 2 - 200 , 'Final Score: ' + this.xp, { 
        fontFamily: 'Minecraft',
        fontSize: '60px',
        color: '#D40004',
        stroke: '#ffffff',
        strokeThickness: 3,
        fontStyle: 'bold'}
    );

    const killsText = this.add.text(screenWidth / 2 + 150, screenHeight / 2 - 100, 'Kills: ' + this.kills, {
        fontFamily: 'Minecraft',
        fontSize: '40px',
        color: '#D40004',
        stroke: '#ffffff',
        strokeThickness: 2,
        fontStyle: 'bold'}
    );

    const timeText = this.add.text(screenWidth / 2 - 250, screenHeight / 2 - 100, 'Time: ' + (Math.floor(this.timer / 1000)% 60).toFixed(0), {
    fontFamily: 'Minecraft',
    fontSize: '40px',
    color: '#D40004',
    stroke: '#ffffff',
    strokeThickness: 2,
    fontStyle: 'bold'}
    );

    // Background music
    //const music = this.sound.add('endMenuMusic', { loop: true });
    //music.play();

    // New game button
    const newGame = this.add.sprite(screenWidth / 2, screenHeight / 2 + 100, 'playButton');
    newGame.anims.play('playButton', true);
    newGame.setInteractive(); // Make the button interactive

    // Share button
    const share = this.add.sprite(screenWidth / 2, screenHeight / 2 + 200, 'share');
    this.anims.create({
        key: 'share',
        frames: this.anims.generateFrameNumbers('share', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    share.anims.play('share', true);
    share.setInteractive(); // Make the button interactive

    // Register score button
    const registerScore = this.add.sprite(screenWidth / 2, screenHeight / 2 + 300, 'registerScore');
    this.anims.create({
        key: 'registerScore',
        frames: this.anims.generateFrameNumbers('registerScore', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    registerScore.anims.play('registerScore', true);
    registerScore.setInteractive();

    // Connect Wallet button
    const connect = this.add.sprite(screenWidth / 2, screenHeight / 2 + 400, 'connect');
    this.anims.create({
        key: 'connect',
        frames: this.anims.generateFrameNumbers('connect', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    connect.anims.play('connect', true);
    connect.setInteractive();

    
    // Button interactions
    newGame.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        newGame.setScale(1.1);
    });

    newGame.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        share.setScale(1);
    });

    newGame.on('pointerdown', () => {
        // Start new game
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Game');
            }
        )
    });

    share.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        share.setScale(1.1);
    });

    share.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        share.setScale(1);
    });

    share.on('pointerdown', () => {
        // Handle share button click - should share the game on social media
    });

    registerScore.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        registerScore.setScale(1.1);
    });

    registerScore.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        registerScore.setScale(1);
    });

    registerScore.on('pointerdown', () => {
        // Handle register button click - should register the score on the blockchain calling the smart contract
    });

    connect.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        connect.setScale(1.1);
    });

    connect.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        connect.setScale(1);
    });

    connect.on('pointerdown', () => {
        // Handle connect button click - should propmt the user to connect the wallet
    });

    }
}

export default EndMenu;