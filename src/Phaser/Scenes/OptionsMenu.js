import * as Phaser from 'phaser';

class OptionsMenu extends Phaser.Scene {
    constructor() {
        super('OptionsMenu');
    }

    preload() {
        this.load.image('options', 'src/assets/images/backgrounds/optionsMenu.png');
        this.load.spritesheet('graphics', 'src/assets/images/buttons/graphicsButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('audio', 'src/assets/images/buttons/audioButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('controls', 'src/assets/images/buttons/controlsButton.png', { frameWidth: 300, frameHeight: 100 });
    }

    create() {
        // Get the width and height of the game config (screen dimensions)
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight

        // Background image; music is the same as the start menu
        const backgroundImage = this.add.image(0, 0, 'options');

        // Calculate a single scale factor to fit the image proportionally
        const scale = Math.max(screenWidth / backgroundImage.width, screenHeight / backgroundImage.height);

        // Apply the scale factor to resize the background image
        backgroundImage.setScale(scale);

        // Position the image at the center of the screen
        backgroundImage.setPosition(screenWidth / 2, screenHeight / 2);
        
        // Set the audio button
        const audio = this.add.sprite(screenWidth / 2, screenHeight / 2, 'audio');
        this.anims.create({
            key: 'audio',
            frames: this.anims.generateFrameNumbers('audio', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        audio.anims.play('audio', true);
        audio.setInteractive();

        // Set the controls button
        const controls = this.add.sprite(screenWidth / 2, (screenHeight / 2) + 100, 'controls');
        this.anims.create({
            key: 'controls',
            frames: this.anims.generateFrameNumbers('controls', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        controls.anims.play('controls', true);
        controls.setInteractive();

        // Set the graphics button
        const graphics = this.add.sprite(screenWidth / 2, (screenHeight / 2) + 200, 'graphics');
        graphics.setInteractive();
        this.anims.create({
            key: 'graphics',
            frames: this.anims.generateFrameNumbers('graphics', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        graphics.anims.play('graphics', true);

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
    }
}

export default OptionsMenu;