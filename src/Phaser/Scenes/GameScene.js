export default class GameScene extends Phaser.Scene {
    constructor() {
      super('Game');
    }
  
    init(data) {
      this.scene.launch('Ui');
      //this.selectedKraken = data.selectedKraken || 0;
    }
}