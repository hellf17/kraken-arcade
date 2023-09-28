import * as Phaser from 'phaser';
import { loadHearts, createHeartAnimation, drawUiMaxHearts, drawUiHearts, removeUiHeart, addUiHeart, addShield, removeUiShield, spawnHearts } from './heart';
import eventsCenter from './EventsCenter'


export default class Interface extends Phaser.Scene
{
    constructor ()
    {
        super('Interface');
    }

    preload (){
        this.load.image('background', 'src/assets/images/backgrounds/landscape.png')
        loadHearts(this)

    }

    create() {
        //Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        //Load the background image
        const background = this.add.image(0, 0, 'background');
        background.setDepth(-3);

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

        //Initialize variables - these are used to track the player's stats between all sessions;
        //Data is stored in cookies and externally in a decentralized database?
        this.score = 0; //TODO: Implement score
        this.timeSurvived = 0; //TODO: Implement time survived
        this.enemyKills = 0; //TODO: Implement enemy kills
        this.deathCount = 0; //TODO: Implement death count

        //Draw the UI hearts
        drawUiMaxHearts(this); // Draw the empty hearts equal to the player's max hitpoints
        drawUiHearts(this); // Draw the filled hearts equal to the player's hitpoints


        //Create and draw the XP tracker text
        this.scoreText = this.add.text(30, 20, 'XP: 0', {
            fontFamily: 'Minecraft',
            fontSize: '30px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
            }
        );
        
        //Create and draw the time survived tracker text
        this.timeSurvived = this.add.text(30, 40, 'Time Survived: 0', {
            fontFamily: 'Minecraft',
            fontSize: '30px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
            });

        //Create and draw the enemy kills tracker text
        this.enemyKills = this.add.text(30, 60, 'Enemy Kills: 0', {
            fontFamily: 'Minecraft',
            fontSize: '30px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
            });

        //Create and draw the death count tracker text
        this.deathCount = this.add.text(30, 80, 'Death Count: 0', {
            fontFamily: 'Minecraft',
            fontSize: '30px',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'normal'
            });

        //Listen to events
        eventsCenter.on('updateXp', this.updateXp, this);
        eventsCenter.on('updateTime', this.updateTime, this);
        eventsCenter.on('updateEnemyKills', this.updateEnemyKills, this);
        eventsCenter.on('updateDeathCount', this.updateDeathCount, this);
        eventsCenter.on('addShield', addShield, this);
        eventsCenter.on('removeShield', removeUiShield, this);
        eventsCenter.on('addUiHeart', addUiHeart, this);
        eventsCenter.on('removeHeart', removeUiHeart, this);
        eventsCenter.on('drawUiMaxHearts', drawUiMaxHearts, this);
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

    updateDeathCount (deathCount)   {
        //Update the Death Count tracker text with the actual death count value
        this.deathCount.setText('Deaths: ' + deathCount);
        this.deathCount = deathCount;
    }
  
}

export { Interface };