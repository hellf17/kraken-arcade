import * as Phaser from 'phaser';
import { connectToMetaMask, getOwnedKrakens } from '../Classes/UI/Web3Connection.js';
import { getKrakenSprites, getFirstFrame } from '../Classes/UI/GetPlayerSprites.js';

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

    // Create containers for the buttons and for the Kraken/Morti selection
    this.buttonContainer = this.add.container();
    this.krakenSelectionContainer = this.add.container();
    this.mortiSelectionContainer = this.add.container();
    this.buttonContainer.visible = true;
    this.krakenSelectionContainer.visible = false;
    this.mortiSelectionContainer.visible = false;
    

    // Player selection variables
    this.selectedPlayerType = 0; // 0 for Kraken, 1 for Morti    
    this.selectedKraken = 420420; // The Kraken Id selected by the user
    this.selectedMorti = 420420; // The Morti Id selected by the user
    
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
        frames: this.anims.generateFrameNumbers('optionsButton', { start: 0, end: 9 }),
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
            console.log('Connecting to MetaMask...');
            await connectToMetaMask();
    
            // After the user connects, get the list of owned Krakens and Mortis
            console.log('Fetching owned tokens...');
            this.krakensIds = await getOwnedKrakens();
            this.mortisIds = await getOwnedMortis();
            console.log('Owned tokens:', this.krakensIds, this.mortisIds);

            // If the user has Krakens, show the Kraken selection
            if (this.krakensIds.length > 0) {
                // Show the Kraken selection after the user connects
                console.log('Showing Kraken selection...');
                this.krakenSelection (this.krakensIds);
                this.krakenSelectionContainer.visible = true;
            }
        } catch (error) {
            console.error('Error connecting or fetching owned tokens:', error);
            // Pop up an alert to the user
            window.alert('Error connecting or fetching owned tokens:', error);
        }
    });
    }

    // Kraken selection function
    krakenSelection (userKrakenIds) {
        const krakenSpacingX = 164 // Horizontal spacing between Krakens
        const krakenSpacingY = 100; // Vertical spacing between Krakens
        const krakenScale = 0.3; // Scale factor for Krakens
        this.userKrakenIds = userKrakenIds; // The list of Krakens owned by the user  
        this.preFX.setPadding(4) // Set the padding for FX

        // Initialize row and column indices
        let rowIndex = 0;
        let colIndex = 0;

        // Draw each Kraken owned by the user in rows of 5 Krakens each; User can select one of the Krakens to play with
        this.userKrakensIds.forEach((krakenId) => {
            // Calculate the position for the Kraken
            const xPos = 100 + colIndex * krakenSpacingX;
            const yPos = window.height / 2 + rowIndex * krakenSpacingY;

            // Get the Kraken's sprite and add it to the scene; make it interactive
            getFirstFrame(krakenId).then((frame) => {
                const krakenSprite = this.add.sprite(xPos, yPos, frame);
                krakenSprite.setScale(krakenScale);
                krakenSprite.setInteractive();

                // Add a glowing white outline to the Kraken's sprite
                krakenSprite.preFX.addGlow(0x000000);

                // Add Kraken sprite to container
                this.krakenSelectionContainer.add(krakenSprite);

                krakenSprite.on('pointerover', () => {
                    krakenSprite.setScale(1.1); // Highlight the Kraken when the mouse is over it
                });

                krakenSprite.on('pointerout', () => {
                // Reset the button's scale when the mouse is out
                    krakenSprite.setScale(1);
                });

                krakenSprite.on('pointerdown', () => {
                    // Set the selected Kraken as the player's Kraken
                    this.selectedKraken = krakenId; // The selected Kraken ID
                    this.selectedPlayerType = 0; // 0 for Kraken, 1 for Morti
                    // Show a message to the user
                    window.alert(`Selected Kraken ID ${krakenId}, wait for the sprite to load`);
                });
            });

            // Update row and column indices
            colIndex++;
            if (colIndex >= 5) { // Maximum of 5 Krakens per row
                colIndex = 0;
                rowIndex++;
            }
        });
    }

    update() {
        // If the user selected a Kraken, call the getKrakenSprites function from GetPlayerSprites and get the Kraken's sprites
        // This must run only once each time the user selects a new Kraken
        if (this.selectedKraken !== 420420) {
            // Call the getKrakenSprites with the selected Kraken ID
            console.log(`Loading the sprite for Kraken ID ${this.selectedKraken}...`);
            getKrakenSprites(this.selectedKraken).then((frames) => {
 
            // Add the frames to the Phaser cache as textures
            console.log(`Adding the sprite for Kraken ID ${this.selectedKraken} to the cache...`);
            frames.forEach((frame, index) => {
                this.textures.addImage(`player + ${this.selectedKraken} + ${index + 1}`, frame);
                this.scene.load.image(`player + ${this.selectedKraken} + ${index + 1}`, frame);
            });
 
            // Show a message to the user if successful
            window.alert(`Successfully loaded the sprite for Kraken ID ${this.selectedKraken}`);

            // Reset the selected Kraken
            this.selectedKraken = 420420;
            });
        }
        
    }    
}

export default StartMenu;
