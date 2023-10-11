import * as Phaser from 'phaser';
import eventsCenter from './EventsCenter'


class PlayerSelection extends Phaser.Scene {
    constructor ()
    {
        super('PlayerSelection');
    }

    init (data) {
        this.playerType = data.playerType;
        if (this.playerType == 0) { // Kraken
            this.userKrakenIds = data.userTokenIds;
        } else if (this.playerType == 1) { // Morti
            this.userMortiIds = data.userTokenIds;
        }
    }

    preload () {
        // Loops through the user's Tokens IDs and loads the spritesheets for each one
        if (this.playerType == 0) {
            for (const krakenId of this.userKrakenIds[0]) {
            this.load.spritesheet('player0' + krakenId, 'src/assets/images/krakens/player0' + krakenId + '.png', { frameWidth: 128, frameHeight: 128 });
            console.log('Loaded spritesheet for Kraken ID ' + krakenId);
            }

        } else if (this.playerType == 1) {
            for (const mortiId of this.userMortiIds[0]) {
            this.load.spritesheet('player1' + mortiId, 'src/assets/images/mortis/player1' + mortiId + '.png', { frameWidth: 128, frameHeight: 128 });
            console.log('Loaded spritesheet for Morti ID ' + mortiId);
            }       
        }
    }

    create() {
        // Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Create the description text
        const descriptionText = this.add.text(screenWidth / 2, screenHeight / 2, 'Select your character:', { fontFamily: 'Minecraft', fontSize: 40, color: '#ffffff' });

        // Create the container for the thumbnails
        const thumbContainer = this.add.container();
        const thumbSpacingX = 164;
        const thumbSpacingY = 100;
        const thumbScale = 1;

        let colIndex = 0;
        let rowIndex = 0;

        if (this.playerType == 0) {
            for (const krakenId of this.userKrakenIds[0]) {
                // Create animation for the Kraken
                this.anims.create({
                    key: 'player0' + krakenId,
                    frames: this.anims.generateFrameNumbers('player0' + krakenId, { start: 0, end: 9 }),
                    frameRate: 10,
                    repeat: -1,
                    yoyo: true
                });
                console.log('Created animation for Kraken ID ' + krakenId);

                // Calculate the position for the thumbnail
                const xPos = 100 + colIndex * thumbSpacingX;
                const yPos = screenHeight / 2 + rowIndex * thumbSpacingY;

                // Create the Kraken's sprite and text
                const krakenSprite = this.add.sprite(xPos, yPos, 'player0' + krakenId);
                console.log('Created sprite for Kraken ID ' + krakenId);
                    krakenSprite.setScale(thumbScale);
                    krakenSprite.setDepth(1);
                    krakenSprite.play('player0' + krakenId);
                    krakenSprite.setInteractive()
                const tokenText = this.add.text(xPos, yPos - 30, krakenId, { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });
            
                // Add a glowing white outline to the Kraken's sprite
                krakenSprite.preFX.setPadding(4);
                tokenText.preFX.setPadding(4);

                krakenSprite.on('pointerover', () => {
                    krakenSprite.setScale(0.3); // Highlight the Kraken when the mouse is over it
                    krakenSprite.preFX.addGlow(0x000000);
                    tokenText.preFX.addGlow(0x000000);
                });

                krakenSprite.on('pointerout', () => {
                    // Reset the button's scale when the mouse is out
                    krakenSprite.setScale(0.2);
                    krakenSprite.preFX.clear();
                    tokenText.preFX.clear();
                });

                krakenSprite.on('pointerdown', () => {
                    // Emit an event containing the Kraken's ID
                    eventsCenter.emit('selected-kraken', krakenId);

                    // Show a message to the user
                    window.alert(`Selected Kraken ID ${krakenId}`);
                });

                thumbContainer.add(krakenSprite);
                thumbContainer.add(tokenText);
            }
            
            // Update row and column indices
            colIndex++;
            if (colIndex >= 5) { // Maximum of 5 Krakens per row
                colIndex = 0;
                rowIndex++;
            };
        } 
        else if (this.playerType == 1) {
            for (const mortiId of this.userMortiIds[0]) {
                // Create animation for the Morti
                this.anims.create({
                    key: 'player1' + mortiId,
                    frames: this.anims.generateFrameNumbers('player1' + mortiId, { start: 0, end: 9 }),
                    frameRate: 10,
                    repeat: -1,
                    yoyo: true
                });
                console.log('Created animation for Morti ID ' + mortiId);

                // Calculate the position for the thumbnail
                const xPos = 100 + colIndex * thumbSpacingX;
                const yPos = window.innerHeight / 2 + rowIndex * thumbSpacingY;

                // Create the Morti's sprite and text
                const mortiSprite = this.add.sprite(xPos, yPos, 'player1' + mortiId);
                console.log('Created sprite for Morti ID ' + mortiId);
                    mortiSprite.setScale(thumbScale);
                    mortiSprite.setDepth(1);
                    mortiSprite.play('player1' + mortiId);
                    mortiSprite.setInteractive()
                const tokenText = this.add.text(xPos, yPos - 30, mortiId, { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });
            
                // Add a glowing white outline to the Morti's sprite
                mortiSprite.preFX.setPadding(4);
                tokenText.preFX.setPadding(4);

                mortiSprite.on('pointerover', () => {
                    mortiSprite.setScale(0.3); // Highlight the Morti when the mouse is over it
                    mortiSprite.preFX.addGlow(0x000000);
                    tokenText.preFX.addGlow(0x000000);
                });

                mortiSprite.on('pointerout', () => {
                    // Reset the button's scale when the mouse is out
                    mortiSprite.setScale(0.2);
                    mortiSprite.preFX.clear();
                    tokenText.preFX.clear();
                });

                mortiSprite.on('pointerdown', () => {
                    // Emit an event containing the Morti's ID
                    eventsCenter.emit('selected-morti', mortiId);

                    // Show a message to the user
                    window.alert(`Selected Morti ID ${mortiId}`);
                });

                thumbContainer.add(mortiSprite);
                thumbContainer.add(tokenText);
            }
            
            // Update row and column indices
            colIndex++;
            if (colIndex >= 5) { // Maximum of 5 Mortis per row
                colIndex = 0;
                rowIndex++;
            };
        }
    }
}

export default PlayerSelection;