import * as Phaser from 'phaser';
import { connectToMetaMask, getOwnedKrakens, getOwnedMortis } from '../Classes/UI/Web3Connection.js';
import { getPlayerSprites } from '../Classes/UI/GetPlayerSprites.js';

class StartMenu extends Phaser.Scene {
    constructor() {
        super({key: 'StartMenu'});
    }

    preload() {
        this.load.spritesheet('startMenu', './src/assets/images/backgrounds/startMenuSpritesheet.png', {frameWidth: 960, frameHeight: 544});
        this.load.spritesheet('playButton', './src/assets/images/buttons/playButton.png', {frameWidth: 300, frameHeight: 100});
        this.load.spritesheet('optionsButton', './src/assets/images/buttons/optionsButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('connectButton', './src/assets/images/buttons/connectButton.png', { frameWidth: 300, frameHeight: 100 });
        //this.load.audio('StartMenuMusic', './src/assets/audio/startMenuMusic.mp3');
    }

    create() {
    // Get the width and height of the game config (screen dimensions)
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    // Background image
    const backgroundImage = this.add.sprite(0, 0, 'startMenu');
    this.anims.create({
        key: 'startMenu',
        frames: this.anims.generateFrameNumbers('startMenu', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });

    // Calculate a single scale factor to fit the image proportionally
    const scale = Math.max(screenWidth / backgroundImage.width, screenHeight / backgroundImage.height);

    // Apply the scale factor to resize the background image
    backgroundImage.setScale(scale);

    // Position the image at the center of the screen
    backgroundImage.setPosition(screenWidth / 2, screenHeight / 2);

    // Play the animation
    backgroundImage.anims.play('startMenu', true);

    // Background music
    //const music = this.sound.add('backgroundMusic', { loop: true });
    //music.play();

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
    playButton.setInteractive(); // Make the button interactive

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
    playButton.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        playButton.setScale(1.1);
    });

    playButton.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        playButton.setScale(1);
    });

    playButton.on('pointerdown', () => {
        //music.stop();

        //Fade out the scene and start the game
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Game');
            }
        )
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
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('OptionsMenu');
            }
        )
    });

    connectButton.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        connectButton.setScale(1.1);
         // Show connect text when the mouse is over it
        connectText = this.add.text(screenWidth / 2 - 100, screenHeight / 2 + 210, 'Connect your Wallet to be able to play with your own Kraken and register your score at the leaderboard', { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });

    });

    connectButton.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        connectButton.setScale(1);
    });

    connectButton.on('pointerdown', async () => {
        try {
            // Calls the connectToMetaMask function from Web3Connection.js and connects the user to MetaMask; wait for completion
            await connectToMetaMask();
    
            // After the user connects, get the list of owned Krakens and Mortis
            this.krakensIds = await getOwnedKrakens();
            this.mortisIds = await getOwnedMortis();
    
        } catch (error) {
            console.error('Error connecting or fetching owned tokens:', error);
            // Pop up an alert to the user
            window.alert('Error connecting or fetching owned tokens:', error);
        }
    });

    // Create a list of Kraken token IDs
    const krakensList = this.add.text(screenWidth / 2 - 50, screenHeight / 2 + 250, 'Krakens:', { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });
    for (let i = 0; i < this.krakensIds.length; i++) {
        const tokenId = this.krakensIds[i];
        const krakenText = this.add.text(screenWidth / 2 + 150, screenHeight / 2 + 360 + (i * 30), tokenId, { fontFamily: 'Minecraft', fontSize: 16, color: '#ffffff' });
        
        // Make each token ID clickable
        krakenText.setInteractive();
    
        // Add a click event handler to select this Kraken token ID
        krakenText.on('pointerdown', () => {
            selected_tokenId = tokenId; // Set the selected_tokenId to the clicked token ID
            getPlayerSprites(selected_tokenId)
        });
    }
    
    // Create a list of Mortis token IDs
    const mortisList = this.add.text(screenWidth / 2 + 50, screenHeight / 2 + 250, 'Mortis:', { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });
    for (let i = 0; i < this.mortisIds.length; i++) {
        const tokenId = this.mortisIds[i];
        const mortisText = this.add.text(screenWidth / 2 + 300, screenHeight / 2 + 360 + (i * 30), tokenId, { fontFamily: 'Minecraft', fontSize: 16, color: '#ffffff' });
    
        // Make each token ID clickable
        mortisText.setInteractive();
    
        // Add a click event handler to select this Mortis token ID
        mortisText.on('pointerdown', () => {
            selected_tokenId = tokenId; // Set the selected_tokenId to the clicked token ID
            getPlayerSprites(selected_tokenId)
            });
        }
    }

export default StartMenu;
