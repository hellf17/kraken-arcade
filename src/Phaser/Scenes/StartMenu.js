import 'phaser';

class StartMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartMenuScene' });
    }

    preload() {
        this.load.image('startMenu', './src/assets/images/backgrounds/startMenu.png');
        this.load.image('startButton', './src/assets/images/buttons/startButton.png');
        this.load.spritesheet('optionsButton', './src/assets/images/buttons/optionsButton.png');
        this.load.spritesheet('connectButton', './src/assets/images/buttons/connectButton.png');
        this.load.audio('StartMenuMusic', './src/assets/audio/startMenuMusic.mp3');
    }

    create() {
    // Background image
    const startMenuImage = this.add.image(0, 0, 'startMenu').setOrigin(0);

    //Get the width and height of the current scene
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    //Calculate a single scale factor to fit the image proportionally
    const scale = Math.max(screenWidth / startMenuImage.width, screenHeight / startMenuImage.height);

    //Apply the scale factor to resize the background image
    startMenuImage.setScale(scale);
    
    //Position the image at the center
    startMenuImage.setPosition(screenWidth / 2, screenHeight / 2);

    // Background music
    const music = this.sound.add('backgroundMusic', { loop: true });
    music.play();

    // Start Game button
    const startButton = this.add.image(400, 200, 'startButton');
    startButton.setInteractive(); // Make the button interactive

    // Options button
    const optionsButton = this.add.image(400, 300, 'optionsButton');
    optionsButton.setInteractive();

    // Connect Wallet button
    const connectButton = this.add.image(400, 400, 'connectButton');
    connectButton.setInteractive();

    // Button interactions
    startButton.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        startButton.setScale(1.1);
    });

    startButton.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        startButton.setScale(1);
    });

    startButton.on('pointerdown', () => {
        // Handle Start Game button click
        music.stop();
        this.scene.start('Game');
    });

    optionsButton.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        optionsButton.setScale(1.1);
    });

    optionsButton.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        optionsButton.setScale(1);
    });

    optionsButton.on('pointerdown', () => {
        // Handle Options button click
        this.scene.start('OptionsMenuScene'); // Replace 'OptionsMenuScene' with your options menu scene
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

export default StartMenuScene;