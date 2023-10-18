import * as Phaser from 'phaser';
import eventsCenter from './EventsCenter';

class PlayerSelection extends Phaser.Scene {
    constructor ()
    {
        super('PlayerSelection');
    }

    init (data) {
        this.playerType = data.playerType;
        if (this.playerType == 0) { // Kraken
            this.userKrakenIds = data.userTokensIds;
        } else if (this.playerType == 1) { // Morti
            this.userMortiIds = data.userTokensIds;
        }
    }

    preload () {
        // Loops through the user's Tokens IDs and loads the spritesheets for each one
        // TODO: Add a loading bar
        if (this.playerType == 0) {
            for (let i = 0; i < this.userKrakenIds[0].length; i++) {
                const krakenId = this.userKrakenIds[0][i];
                this.load.spritesheet('player0' + krakenId, 'src/assets/images/spritesheets/player/kraken/sheet' + krakenId + '.png', { frameWidth: 64, frameHeight: 64 });
            }

        } else if (this.playerType == 1) {
            for (let i = 0; i < this.userMortiIds[0].length; i++) {
                const mortiId = this.userMortiIds[0][i];
                this.load.spritesheet('player1' + mortiId, 'src/assets/images/spritesheets/player/kraken/player1' + mortiId + '.png', { frameWidth: 64, frameHeight: 64 });
            }       
        }
    }

    create() {
        // Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Create the description text
        const descriptionText = this.add.text(screenWidth / 2 - 250, screenHeight / 2 + 50, 'Select your character:', { fontFamily: 'Minecraft', fontSize: 40, color: '#ffffff' })

        // Create the container for the thumbnails
        const thumbContainer = this.add.container();
        const thumbSpacingX = screenWidth/7;
        const thumbSpacingY = 150;
        const thumbScale = 1.5;

        let referenceXPos = screenWidth/2 - 3 * thumbSpacingX;
        let colIndex = 0;
        let rowIndex = 0;
        
        if (this.playerType == 0) {
            for (let i = 0; i < this.userKrakenIds[0].length; i++) {

                // Calculate the position for the thumbnail
                const xPos = referenceXPos + colIndex * thumbSpacingX;
                const yPos = screenHeight / 2 + 150 + rowIndex * thumbSpacingY;

                // Get the Kraken's ID
                const krakenId = this.userKrakenIds[0][i];

                // Create animation for the Kraken
                this.anims.create({
                    key: 'player0' + krakenId,
                    frames: this.anims.generateFrameNumbers('player0' + krakenId, { start: 0, end: 9 }),
                    frameRate: 10,
                    repeat: -1,
                    yoyo: true
                });

                // Create the Kraken's sprite and text
                const krakenSprite = this.add.sprite(xPos, yPos, 'player0' + krakenId);
                    krakenSprite.setScale(thumbScale);
                    krakenSprite.setDepth(1);
                    krakenSprite.play('player0' + krakenId);
                    krakenSprite.setInteractive()
                
                const tokenText = this.add.text(krakenSprite.x - 20, krakenSprite.y + 30, krakenId, { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });
                
                // Add a glowing white outline to the Kraken's sprite
                krakenSprite.preFX.setPadding(1);

                krakenSprite.on('pointerover', () => {
                    krakenSprite.setScale(1.6); // Highlight the Kraken when the mouse is over it
                    krakenSprite.preFX.addGlow(0xFFFFFF);
                });

                krakenSprite.on('pointerout', () => {
                    // Reset the button's scale when the mouse is out
                    krakenSprite.setScale(1.5);
                    krakenSprite.preFX.clear();
                });

                krakenSprite.on('pointerdown', () => {
                    // Emit an event containing the Kraken's ID
                    eventsCenter.emit('selectedKraken', `${krakenId}`);

                    // Show a message to the user
                    window.alert(`Selected Kraken ID ${krakenId}`);
                });

                thumbContainer.add(krakenSprite);
                thumbContainer.add(tokenText);

                // Update indices
                colIndex++;
                if (colIndex >= 9) { // Maximum of 5 Krakens per row
                    colIndex = 0;
                    rowIndex++;
                };
            }
        } 
        else if (this.playerType == 1) {
            for (let i = 0; i < this.userMortiIds[0].length; i++) {
                
                // Calculate the position for the thumbnail
                const xPos = referenceXPos + colIndex * thumbSpacingX;
                const yPos = screenHeight / 2 + 150 + rowIndex * thumbSpacingY;

                // Get the Morti's ID
                const mortiId = this.userMortiIds0[0][i];

                // Create animation for the Morti
                this.anims.create({
                    key: 'player1' + this.mortiId,
                    frames: this.anims.generateFrameNumbers('player1' + mortiId, { start: 0, end: 9 }),
                    frameRate: 10,
                    repeat: -1,
                    yoyo: true
                });


                // Create the Morti's sprite and text
                const mortiSprite = this.add.sprite(xPos, yPos, 'player1' + mortiId);
                    mortiSprite.setScale(thumbScale);
                    mortiSprite.setDepth(1);
                    mortiSprite.play('player1' + this.mortiId);
                    mortiSprite.setInteractive()

                const tokenText = this.add.text(mortiSprite.x - 20, mortiSprite.y + 30, mortiId, { fontFamily: 'Minecraft', fontSize: 20, color: '#ffffff' });
            
                // Add a glowing white outline to the Morti's sprite
                mortiSprite.preFX.setPadding(1);

                mortiSprite.on('pointerover', () => {
                    mortiSprite.setScale(1.6); // Highlight the Morti when the mouse is over it
                    mortiSprite.preFX.addGlow(0xFFFFFF);
                });

                mortiSprite.on('pointerout', () => {
                    // Reset the button's scale when the mouse is out
                    mortiSprite.setScale(1.5);
                    mortiSprite.preFX.clear();
                });

                mortiSprite.on('pointerdown', () => {
                    // Emit an event containing the Morti's ID
                    eventsCenter.emit('selectedMorti', mortiId);

                    // Show a message to the user
                    window.alert(`Selected Morti ID ${mortiId}`);
                });

                thumbContainer.add(mortiSprite);
                thumbContainer.add(tokenText);

                // Update indices
                colIndex++;
                if (colIndex >= 5) { // Maximum of 5 Krakens per row
                    colIndex = 0;
                    rowIndex++;
                };
            };
        }
    }
}

export default PlayerSelection;