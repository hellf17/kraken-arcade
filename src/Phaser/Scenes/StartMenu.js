import * as Phaser from 'phaser';
import { connectToMetaMask, getOwnedKrakens, getOwnedMortis } from '../Classes/UI/Web3Connection.js';
import eventsCenter from '../Classes/UI/EventsCenter.js';

class StartMenu extends Phaser.Scene {
    constructor() {
        super({key: 'StartMenu'});
    }

    preload() {
        this.load.spritesheet('startMenu', './src/assets/images/backgrounds/startMenuSpritesheet.png', {frameWidth: 960, frameHeight: 544});
        this.load.spritesheet('playButton', './src/assets/images/buttons/playButton.png', {frameWidth: 300, frameHeight: 100});
        this.load.spritesheet('optionsButton', './src/assets/images/buttons/optionsButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('connectButton', './src/assets/images/buttons/connectButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('krakenButton', './src/assets/images/buttons/krakenButton.png', { frameWidth: 100, frameHeight: 100 });   
        this.load.spritesheet('mortiButton', './src/assets/images/buttons/mortiButton.png', { frameWidth: 100, frameHeight: 100 }); 
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
    backgroundImage.setDepth(0);

    // Position the image at the center of the screen
    backgroundImage.setPosition(screenWidth / 2, screenHeight / 2);

    // Play the animation
    backgroundImage.anims.play('startMenu', true);

    // Background music
    //const music = this.sound.add('backgroundMusic', { loop: true });
    //music.play();

    // Create containers for the buttons and for the Kraken/Morti selection
    this.buttonContainer = this.add.container();
    this.buttonContainer.visible = true;

    // Player selection variables
    this.selectedPlayerType = 0; // 0 for Kraken (default), 1 for Morti    
    this.selectedKraken = 1518; // The default Kraken Id
    this.selectedMorti = 779; // The default Morti Id

    // Set's the listener for the PlayerSelection scene
    eventsCenter.on('selected-kraken', () => {
        this.selectedPlayerType = 0;
        this.selectedKraken = eventsCenter.krakenId;
    }, this);

    eventsCenter.on('selected-morti', () => {
        this.selectedPlayerType = 1;
        this.selectedMorti = eventsCenter.mortiId;
    }, this);

    // Start Game button
    const playButton = this.add.sprite(screenWidth / 2, screenHeight / 2 - 200, 'playButton');
    playButton.setScale(1.2);
    this.anims.create({
        key: 'playButton',
        frames: this.anims.generateFrameNumbers('playButton', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    playButton.anims.play('playButton', true);
    playButton.setInteractive();
    this.buttonContainer.add(playButton);

    // Options button
    const optionsButton = this.add.sprite(screenWidth / 2, screenHeight / 2 - 100, 'optionsButton');
    this.anims.create({
        key: 'optionsButton',
        frames: this.anims.generateFrameNumbers('optionsButton', { start: 0, end: 9 
        }),
        frameRate: 10,
        repeat: -1
    });
    optionsButton.anims.play('optionsButton', true);
    optionsButton.setInteractive();
    this.buttonContainer.add(optionsButton);

    // Connect Wallet button
    const connectButton = this.add.sprite(screenWidth / 2, screenHeight / 2, 'connectButton');
    this.anims.create({
        key: 'connectButton',
        frames: this.anims.generateFrameNumbers('connectButton', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    connectButton.anims.play('connectButton', true);
    connectButton.setInteractive();
    this.buttonContainer.add(connectButton);

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
            if (this.selectedPlayerType === 0) {
                this.scene.start('Game', {playerType: this.selectedPlayerType, selectedTokenId: this.selectedKraken});
            }
            else if (this.selectedPlayerType === 1){
                this.scene.start('Game' , {playerType: this.selectedPlayerType, selectedTokenId: this.selectedMorti});
            }
        })
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
        this.connectText = this.add.text(connectButton.x - 500, connectButton.y + 30, 'Connect your Wallet to be able to play with your own Kraken and register your score at the leaderboard', { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });

    });

    connectButton.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        connectButton.setScale(1);
        // Hide connect text when the mouse is out
        this.connectText.visible = false;
    });

    connectButton.on('pointerdown', async () => {
        try {
            // Calls the connectToMetaMask function from Web3Connection.js and connects the user to MetaMask; wait for completion
            await connectToMetaMask();

            // Shows a message if the user is connected to MetaMask
            window.alert('You are connected to MetaMask');
    
            // After the user connects, get the list of owned Krakens and Mortis
            this.krakensIds = await getOwnedKrakens();
            this.mortisIds = await getOwnedMortis();

            // If the user has Krakens, show the Kraken selection
            if (this.krakensIds[0].length > 0 && this.mortisIds[0].length < 0) {
                // Call the Selection Scene with the Kraken IDs
                this.scene.run('PlayerSelection', {playerType: 0, userTokensIds: this.krakensIds});
            } 
            else if (this.krakensIds[0].length < 0 && this.mortisIds[0].length > 0) {
                // Call the Selection Scene with the Morti IDs
                this.scene.run('PlayerSelection', {playerType: 1, userTokensIds: this.mortisIds});
            } 
            else if (this.krakensIds[0].length > 0 && this.mortisIds[0].length > 0) {
                // Creates a black filter that covers the screen
                const filter = this.add.graphics();
                filter.fillStyle(0x000000, 0.4);
                filter.fillRect(0, 0, screenWidth, screenHeight);

                // Create a Kraken and a Morti button
                const krakenButton = this.add.sprite(screenWidth / 2, screenHeight / 2 - 100, 'krakenButton');
                krakenButton.setScale(2);
                this.anims.create({
                    key: 'krakenButton',
                    frames: this.anims.generateFrameNumbers('krakenButton', { start: 0, end: 9 }),
                    frameRate: 10,
                    repeat: -1
                });
                krakenButton.anims.play('krakenButton', true);
                krakenButton.setInteractive();
                const krakentext = this.add.text(krakenButton.getCenter, krakenButton.getCenter + 20, 'Play as Kraken', { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });
                this.buttonContainer.add(krakenButton);
                this.buttonContainer.add(krakentext);

                const mortiButton = this.add.sprite(screenWidth / 2, screenHeight / 2 + 100, 'mortiButton');
                mortiButton.setScale(2);
                this.anims.create({
                    key: 'mortiButton',
                    frames: this.anims.generateFrameNumbers('mortiButton', { start: 0, end: 9 }),
                    frameRate: 10,
                    repeat: -1
                });
                mortiButton.anims.play('mortiButton', true);
                mortiButton.setInteractive();
                const mortitext = this.add.text(mortiButton.getCenter, mortiButton.getCenter + 20, 'Play as Morti', { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });
                this.buttonContainer.add(mortiButton);
                this.buttonContainer.add(mortitext);

                // Button interactions
                krakenButton.on('pointerover', () => {
                    krakenButton.preFX.addGlow(0x000000);
                    krakenButton.setScale(2.2);
                });
                krakenButton.on('pointerout', () => {
                    krakenButton.preFX.clear();
                    krakenButton.setScale(2);
                });
                krakenButton.on('pointerdown', () => {
                    this.scene.run('PlayerSelection', {playerType: 0, userTokensIds: this.krakensIds});
                    // Clear the black filter
                    filter.destroy();
                    // Clear the Kraken and Morti buttons
                    krakenButton.destroy();
                    mortiButton.destroy();
                    // Clear the Kraken and Morti text
                    krakentext.destroy();
                    mortitext.destroy();
                });

                mortiButton.on('pointerover', () => {
                    mortiButton.preFX.addGlow(0x000000);
                    mortiButton.setScale(2.2);
                });
                mortiButton.on('pointerout', () => {
                    mortiButton.preFX.clear();
                    mortiButton.setScale(2);
                });
                mortiButton.on('pointerdown', () => {
                    this.scene.run('PlayerSelection', {playerType: 1, userTokensIds: this.mortisIds});
                    // Clear the black filter
                    filter.destroy();                    
                    // Clear the Kraken and Morti buttons
                    krakenButton.destroy();
                    mortiButton.destroy();
                    // Clear the Kraken and Morti text
                    krakentext.destroy();
                    mortitext.destroy();
                });

            } else {
                this.add.text(
                    screenWidth / 2, 
                    screenHeight / 2 + 300, 
                    ['You don\'t have any Krakens or Mortis in your wallet.',
                    'Go ahead, you can play as the default Kraken or ',
                    'Morti and shot your way up throught the leaderboard highs.'], 
                    { fontFamily: 'Minecraft', fontSize: 40, color: '#ffffff' });
            }
        } catch (error) {
            // Show an error message if failed
            console.log(error);
        }
    });
    }
}

export default StartMenu;
