import 'phaser';

class OptionsMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsMenuScene' });
    }

    preload() {
        this.load.image('options', 'src/assets/images/buttons/optionsBackground.png');
        this.load.spritesheet('graphics', 'src/assets/images/buttons/graphicsButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('audio', 'src/assets/images/buttons/audioButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('controls', 'src/assets/images/buttons/controlsButton.png', { frameWidth: 300, frameHeight: 100 });
    }

    create() {
    // Background image; music is the same of the start menu
    this.add.image(0, 0, 'options').setOrigin(0);

    //Get the width and height of the current scene
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // Open the graphics settings menu
    const graphics = this.add.spritesheet(400, 200, 'graphics');
    this.anims.create({
        key: 'graphics',
        frames: this.anims.generateFrameNumbers('graphics', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    graphics.setInteractive(); // Make the button interactive

    // Open the audio settings menu
    const audio = this.add.spritesheet(400, 300, 'audio');
    this.anims.create({
        key: 'audio',
        frames: this.anims.generateFrameNumbers('audio', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    audio.setInteractive();

    // Open the controls settings menu
    const controls = this.add.spritesheet(400, 400, 'controls');
    this.anims.create({
        key: 'controls',
        frames: this.anims.generateFrameNumbers('controls', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    controls.setInteractive();

    // Button interactions
    graphics.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        graphics.setScale(1.1);
    });

    graphics.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        graphics.setScale(1);
    });

    graphics.on('pointerdown', () => {
        // Handle Graphics button click
        this.scene.start('graphics');
    });

    audio.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        audio.setScale(1.1);
    });

    audio.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        audio.setScale(1);
    });

    audio.on('pointerdown', () => {
        // Handle Audio button click
        this.scene.start('graphics');

    });

    controls.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        controls.setScale(1.1);
    });

    controls.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        controls.setScale(1);
    });

    controls.on('pointerdown', () => {
        // Handle Audio button click
        this.scene.start('audio');

    });
    }
}

export default OptionsMenuScene;