import * as Phaser from 'phaser';
//import InventoryWindow from '../classes/InventoryWindow';

export default class UiScene extends Phaser.Scene {
  constructor() {
    super('Ui');
  }

  init() {
    // grab a reference to the game scene
    this.gameScene = this.scene.get('Game');
    this.showInventory = false;
  }

  create() {
    this.setupUiElements();
    this.setupEvents();

    // handle game resize
    this.scale.on('resize', this.resize, this);
    // resize our game
    this.resize({ height: this.scale.height, width: this.scale.width });
  }

  setupUiElements() {
    // create the score text game object
    this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', fill: '#fff' });

    // create inventory button
    this.inventoryButton = this.add.image(50, this.scale.height - 50, 'inventoryButton').setInteractive();
    this.inventoryButton.setScale(2);
    this.inventoryButton.on('pointerdown', () => {
      this.toggleInventory(this.gameScene.player, true);
    });
  }

  /*
  setupEvents() {
    // listen for the updateScore event from the game scene
    this.gameScene.events.on('updateScore', (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    });

    this.gameScene.events.on('showInventory', (playerObject, mainPlayer) => {
      this.toggleInventory(playerObject, mainPlayer);
    });
  }
  */

  resize(gameSize) {
    if (this.inventoryWindow) this.inventoryWindow.resize(gameSize);

    if (gameSize.width < 560) {
      this.inventoryButton.y = gameSize.height - 250;
    } else {
      this.inventoryButton.y = gameSize.height - 50;
    }
  }

  toggleInventory(playerObject, mainPlayer) {
    this.showInventory = !this.showInventory;
    if (this.showInventory) {
      this.gameScene.dialogWindow.rect.disableInteractive();
      this.inventoryWindow.showWindow(playerObject, mainPlayer);
    } else {
      this.gameScene.dialogWindow.rect.setInteractive();
      this.inventoryWindow.hideWindow();
    }
  }
}