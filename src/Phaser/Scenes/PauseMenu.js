import * as Phaser from 'phaser';


class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenu'});

    }

    preload() {
        this.load.spritesheet('resumeButton', './src/assets/images/buttons/resumeButton.png', { frameWidth: 300, frameHeight: 100 });
    }

    create() {
        // Get the Game scene
        this.gameScene = this.scene.get('Game');

        // Get the width and height of the game config (screen dimensions)
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
    
        // Resume the game from where it was paused
        const resumeButton = this.add.sprite(screenWidth / 2, screenHeight / 2 - 100, 'resumeButton');
        resumeButton.setScale(1.2);
        this.anims.create({
            key: 'resumeButton',
            frames: this.anims.generateFrameNumbers('resumeButton', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        resumeButton.anims.play('resumeButton', true);
        resumeButton.setInteractive();

        // Start Game button
        const playButton = this.add.sprite(screenWidth / 2, screenHeight / 2, 'playButton');
        playButton.setScale(1.2);
        this.anims.create({
            key: 'playButton',
            frames: this.anims.generateFrameNumbers('playButton', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        playButton.anims.play('playButton', true);
        playButton.setInteractive();
    
        // Options button
        const optionsButton = this.add.sprite(screenWidth / 2, screenHeight / 2 + 100, 'optionsButton');
        this.anims.create({
            key: 'optionsButton',
            frames: this.anims.generateFrameNumbers('optionsButton', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        optionsButton.anims.play('optionsButton', true);
        optionsButton.setInteractive();
    
        // Connect Wallet button
        const connectButton = this.add.sprite(screenWidth / 2, screenHeight / 2 + 200, 'connectButton');
        this.anims.create({
            key: 'connectButton',
            frames: this.anims.generateFrameNumbers('connectButton', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        connectButton.anims.play('connectButton', true);
        connectButton.setInteractive();
    
        // Button interactions
        resumeButton.on('pointerover', () => {
            // Highlight the button when the mouse is over it
            resumeButton.setScale(1.1);
        });

        resumeButton.on('pointerout', () => {
            // Reset the button's scale when the mouse is out
            resumeButton.setScale(1);
        });

        resumeButton.on('pointerdown', () => {
            // Resume the game
            this.scene.resume('Game');
            this.scene.stop();
        });

        playButton.on('pointerover', () => {
            // Highlight the button when the mouse is over it
            playButton.setScale(1.1);
        });
    
        playButton.on('pointerout', () => {
            // Reset the button's scale when the mouse is out
            playButton.setScale(1);
        });
    
        playButton.on('pointerdown', () => {
            // Handle Start Game button click
            //Restart the game
            this.scene.start('Game');
            this.scene.stop();
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
            this.scene.start('OptionsMenu');
        });
    
        connectButton.on('pointerover', () => {
            // Highlight the button when the mouse is over it
            connectButton.setScale(1.1);
        });
    
        connectButton.on('pointerout', () => {
            // Reset the button's scale when the mouse is out
            connectButton.setScale(1);
        });
    
        connect.on('pointerdown', async () => {
            try {
                await connectToMetaMask();
                }
            catch (error) {
                console.log(error);
                window.alert("error", error.message);
                }
        });
    
    }

    update() {
        // Update the lastTimeSurvivedUpdated in the Game scene with the current time
        const currentTime = this.time.now;
        this.gameScene.handlePlayerTimeSurvived(currentTime) 
    }
}
    
export default PauseMenu;