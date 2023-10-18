import * as Phaser from 'phaser';
import { loadHearts, createHeartAnimation, drawUiMaxHearts, drawUiHearts, removeUiHeart, addUiHeart, addShield, removeUiShield} from '../../../heart';
import eventsCenter from './EventsCenter'


class Interface extends Phaser.Scene {
    constructor ()
    {
        super('Interface');
    }

    init (data) {
        this.player = data.player;
    }

    preload () {
        this.load.image('background', 'src/assets/images/backgrounds/landscape.png')
        loadHearts(this)

    }

    create() {
        //Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        //Load the background image
        const background = this.add.image(0, 0, 'background');
        background.setDepth(0);

        //Calculate a single scale factor to fit the image proportionally
        const scale = Math.max(screenWidth / background.width, screenHeight / background.height);

        //Apply the scale factor to resize the background image
        background.setScale(scale);

        //Position the image at the center
        background.setPosition(screenWidth / 2, screenHeight / 2);

        //Create animations
        createHeartAnimation(this);

        //Initialize groups for collision detection and other purposes
        this.heartsUiGroup = this.physics.add.group(); // Group for the hearts at the UI
        this.shieldUiGroup = this.physics.add.group(); // Group for the shield at the UI

        //Draw the UI hearts
        drawUiMaxHearts(this, this.player); // Draw the empty hearts equal to the player's max hitpoints
        drawUiHearts(this, this.player); // Draw the filled hearts equal to the player's hitpoints

        //Create and draw the XP tracker text
        this.scoreText = this.add.text(30, 20, 'XP: 0', {
            fontFamily: 'Minecraft',
            fontSize: '20px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
            }
        ).setDepth(3);;
        
        //Create and draw the time survived tracker text
        this.timeSurvived = this.add.text(30, 40, 'Time Survived: 0', {
            fontFamily: 'Minecraft',
            fontSize: '20px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
        }).setDepth(3);

        //Create and draw the enemy kills tracker text
        this.enemyKills = this.add.text(30, 60, 'Enemy Kills: 0', {
            fontFamily: 'Minecraft',
            fontSize: '20px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
        }).setDepth(3);

        //Create and draw the deaths count text
        const deaths = this.scene.player.deaths;
        this.deathCount = this.add.text(30, 80, 'Death Count: ' + deaths, {
            fontFamily: 'Minecraft',
            fontSize: '20px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
        }).setDepth(3);

        //Listen to events
        eventsCenter.on('updateXp', Xp => this.updateXp(Xp), this);
        eventsCenter.on('updateTime', timeSurvived => this.updateTime(timeSurvived), this);
        eventsCenter.on('updateEnemyKills', enemyKills => this.updateEnemyKills(enemyKills), this);
        eventsCenter.on('addShield', shield => addShield (this, shield), this);
        eventsCenter.on('removeShield', enemyDamage => removeUiShield (this, enemyDamage), this);
        eventsCenter.on('addUiHeart', health, type => addUiHeart (this, health, type), this);
        eventsCenter.on('removeHeart', enemyDamage => removeUiHeart (this, enemyDamage), this);
        eventsCenter.on('drawUiMaxHearts', player => drawUiMaxHearts (this, player), this);
    }

    updateXp (XP)   {
        //Update the Score text with the actual XP value
        this.scoreText.setText('XP: ' + XP);
        this.score = XP;
    }

    updateTime (timeSurvived)   {
        //Update the Time survived tracker text with the actual time value
        this.timeSurvived.setText('Time Survived: ' + timeSurvived);
        this.timeSurvived = timeSurvived;
    }

    updateEnemyKills (enemyKills)   {
        //Update the Enemy Kills tracker text with the actual enemy kills value
        this.enemyKills.setText('Enemy Kills: ' + enemyKills);
        this.enemyKills = enemyKills;
    }  
}

export default Interface;