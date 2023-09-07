import 'phaser';

class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    preload() {
        this.load.image('endScene', './src/assets/images/backgrounds/EndScene.png');
        this.load.spritesheet('share', './src/assets/images/buttons/shareButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('connectButton', './src/assets/images/buttons/connectButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('registerScore', './src/assets/images/buttons/registerScoreButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.audio('endMenuMusic', './src/assets/audio/EndMenuMusic.mp3');
    }

    create() {
    // Background image
    const endImage = this.add.image(0, 0, 'endScene').setOrigin(0);

    //Get the width and height of the current scene
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    //Calculate a single scale factor to fit the image proportionally
    const scale = Math.max(screenWidth / endImage.width, screenHeight / endImage.height);

    //Apply the scale factor to resize the background image
    endImage.setScale(scale);
    
    //Position the image at the center
    endImage.setPosition(screenWidth / 2, screenHeight / 2);

    // Background music
    const music = this.sound.add('endMenuMusic', { loop: true });
    music.play();

    // End Game button
    const share = this.add.sprite(400, 200, 'share');
    this.anims.create({
        key: 'share',
        frames: this.anims.generateFrameNumbers('share', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    share.setInteractive(); // Make the button interactive

    // Options button
    const register = this.add.sprite(400, 300, 'registerScoreButton');
    this.anims.create({
        key: 'register',
        frames: this.anims.generateFrameNumbers('register', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    register.setInteractive();

    // Connect Wallet button
    const connectButton = this.add.connect(400, 400, 'connectButton');
    this.anims.create({
        key: 'connect',
        frames: this.anims.generateFrameNumbers('connect', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
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