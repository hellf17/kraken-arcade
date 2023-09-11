import 'phaser';

class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    preload() {
        this.load.spritesheet('share', './src/assets/images/buttons/shareButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('connect', './src/assets/images/buttons/connectButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('registerScore', './src/assets/images/buttons/registerScoreButton.png', { frameWidth: 300, frameHeight: 100 });
        //this.load.audio('endMenuMusic', './src/assets/audio/EndMenuMusic.mp3');
    }

    create() {
    // Set the background image from the playerScreenshot.src
    const backgroundImage = this.add.image(0, 0, 'playerScreenshot');

    //Get the width and height of the current scene
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;


    // Background music
    //const music = this.sound.add('endMenuMusic', { loop: true });
    //music.play();

    // End Game button
    const share = this.add.sprite(screenWidth / 2, screenHeight / 2 - 200, 'share');
    this.anims.create({
        key: 'share',
        frames: this.anims.generateFrameNumbers('share', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.play('share', true);
    share.setInteractive(); // Make the button interactive

    // Options button
    const register = this.add.sprite(screenWidth / 2, screenHeight / 2 - 350, 'registerScore');
    this.anims.create({
        key: 'registerScore',
        frames: this.anims.generateFrameNumbers('registerScore', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.play('registerScore', true);
    register.setInteractive();

    // Connect Wallet button
    const connectButton = this.add.sprite(screenWidth / 2, screenHeight / 2 - 500, 'connect');
    this.anims.create({
        key: 'connect',
        frames: this.anims.generateFrameNumbers('connect', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.play('connect', true);
    connectButton.setInteractive();

    // Button interactions
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

    register.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        register.setScale(1.1);
    });

    register.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        register.setScale(1);
    });

    register.on('pointerdown', () => {
        // Handle register button click - should register the score on the blockchain calling the smart contract
    });

    connectButton.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        connectButton.setScale(1.1);
    });

    connectButton.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        connectButton.setScale(1);
    });

    connectButton.on('pointerdown', () => {
        // Handle connect button click - should propmt the user to connect the wallet
    });

    }
}

export default EndScene;