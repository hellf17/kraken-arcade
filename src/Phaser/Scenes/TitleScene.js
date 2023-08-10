import * as Phaser from 'phaser';
import UiButton from '../classes/UiButton';
//import { getParam } from '../utils/utils';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    // create the title text
    this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Kraken Onslaught', {font:'Times New Roman', fontSize: '128px', fill: '#fff' });
    this.titleText.setOrigin(0.5);

    
    this.startButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.65,
      'button1',
      'button2',
      this.startScene.bind(this, 'Game'),
    );

    // handle game resize
    this.scale.on('resize', this.resize, this);
    // resize our game
    this.resize({ height: this.scale.height, width: this.scale.width });
  }

  startScene(targetScene) {
    this.scale.removeListener('resize', this.resize);
    this.scene.start(targetScene);
  }

  resize(gameSize) {
    const { width, height } = gameSize;

    this.cameras.resize(width, height);

    if (width < 1000) {
      this.titleText.setFontSize('64px');
    } else {
      this.titleText.setFontSize('128px');
    }

    if (height < 700) {
      this.titleText.setPosition(width / 2, height * 0.4);
    } else {
      this.titleText.setPosition(width / 2, height / 2);
    }
  }
}
