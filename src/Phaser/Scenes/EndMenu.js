import * as Phaser from 'phaser';
import { recordPlayerStats, getTopStats } from '../../localDataStorage';
//import { recordPlayerStatsExt, getTopStatsExt } from '../../externalDataStorage';


class EndMenu extends Phaser.Scene {
    constructor() {
        super('EndMenu');
    }

    init (data)
    {
        this.tokenId = data.tokenId;
        this.xp = data.xp;
        this.timer = data.timer;
        this.kills = data.kills;
        this.deaths = data.deaths;
    }


    preload() {
        this.load.spritesheet('share', './src/assets/images/buttons/shareButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('connect', './src/assets/images/buttons/connectButton.png', { frameWidth: 300, frameHeight: 100 });
        this.load.spritesheet('registerScore', './src/assets/images/buttons/registerScoreButton.png', { frameWidth: 300, frameHeight: 100 });
        //this.load.audio('endMenuMusic', './src/assets/audio/EndMenuMusic.mp3');
    }

    create() {
    //Get the width and height of the current scene
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // Set's the background image
    const background = this.add.sprite(screenWidth / 2, screenHeight / 2, 'gameOverBackground' + this.deaths);
    // Insert a red filter to the background
    background.setTint(0xb4202a);
    
    // Show the player's score, time survived and enemies killed - received from the player file as xp, time and kills
    const finalScoreText = this.add.text(screenWidth / 5 - 200, screenHeight / 6 , 'Final Score: ' + this.xp, { 
        fontFamily: 'Minecraft',
        fontSize: '50px',
        color: '#333941',
        stroke: '#ffffff',
        strokeThickness: 3,
        fontStyle: 'bold'}
    );

    const killsText = this.add.text(finalScoreText.x - 50, finalScoreText.y + 100, 'Kills: ' + this.kills, {
        fontFamily: 'Minecraft',
        fontSize: '40px',
        color: '#333941',
        stroke: '#ffffff',
        strokeThickness: 2,
        fontStyle: 'bold'}
    );

    const timeText = this.add.text(finalScoreText.x + 250, finalScoreText.y + 100, 'Time: ' + (Math.floor(this.timer / 1000)% 60).toFixed(0), {
    fontFamily: 'Minecraft',
    fontSize: '40px',
    color: '#333941',
    stroke: '#ffffff',
    strokeThickness: 2,
    fontStyle: 'bold'}
    );

    // Show the Kraken death count
    const totalDeaths = this.add.text(finalScoreText.x, finalScoreText.y + 200, 'Krakens ∑ deaths: ' + this.deaths, {
        fontFamily: 'Minecraft',
        fontSize: '30px',
        color: '#333941',
        stroke: '#ffffff',
        strokeThickness: 2,
        fontStyle: 'bold'})

    // Background music
    //const music = this.sound.add('endMenuMusic', { loop: true });
    //music.play();

    //Save the player's score, time survived and enemies killed locally
    //recordPlayerStatsExt (this.tokenId, this.xp, this.timer, this.kills, this.deaths);
    recordPlayerStats (this.tokenId, this.xp, this.timer, this.kills, this.deaths);

    // Create a container for the top stats
    const topStatsContainer = this.add.container();
    this.add.existing(topStatsContainer); // Add the container to the scene


    
    // Shows the top 10 from scores, time survived and enemies killed; received from the external data storage
    const topScores = getTopStats('score', 4);
    topStatsContainer.add(this.add.text(screenWidth/2 - 100, screenHeight/2 + 25, 'Score Board', {
        fontFamily: 'Minecraft',
        fontSize: '40px',
        color: '#333941',
        stroke: '#ffffff',
        strokeThickness: 2,
        fontStyle: 'bold'}
    ));
    topScores.forEach((score, index) => {
        topStatsContainer.add(this.add.text(screenWidth/2, screenHeight/2 + 75 + index * 30, `${index + 1}. ${score.score}`, {
            fontFamily: 'Minecraft',
            fontSize: '30px',
            color: '#333941',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'bold'}
        ));
    });
    
    const topTimeSurvived = getTopStats('timeSurvived', 4);
    topStatsContainer.add(this.add.text(screenWidth/4 - 70, screenHeight/2 + 25, 'Time Board', {
        fontFamily: 'Minecraft',
        fontSize: '40px',
        color: '#333941',
        stroke: '#ffffff',
        strokeThickness: 2,
        fontStyle: 'bold'}
    ));
    topTimeSurvived.forEach((timeSurvived, index) => {
        topStatsContainer.add(this.add.text(screenWidth/4 , screenHeight/2 + 75 + index * 35, `${index + 1}. ${((Math.floor(timeSurvived.timeSurvived / 1000)% 60).toFixed(0))}`, {
            fontFamily: 'Minecraft',
            fontSize: '30px',
            color: '#333941',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'bold'}
        ));
    });
    
    const topKills = getTopStats('kills', 4);
    topStatsContainer.add(this.add.text(screenWidth * 0.75 - 70, screenHeight/2 + 25, 'Kill Board', {
        fontFamily: 'Minecraft',
        fontSize: '40px',
        color: '#333941',
        stroke: '#ffffff',
        strokeThickness: 2,
        fontStyle: 'bold'}
    ));

    topKills.forEach((kills, index) => {
        topStatsContainer.add(this.add.text(screenWidth - screenWidth/4, screenHeight/2 + 75 + index * 35, `${index + 1}. ${kills.kills}`, {
            fontFamily: 'Minecraft',
            fontSize: '30px',
            color: '#333941',
            stroke: '#ffffff',
            strokeThickness: 2,
            fontStyle: 'bold'}
    ))
    });

    // New game button
    const newGame = this.add.sprite(screenWidth * 0.625, screenHeight / 4 - 50, 'playButton');
    newGame.anims.play('playButton', true);
    newGame.setInteractive(); // Make the button interactive

    // Share button
    const share = this.add.sprite(screenWidth * 0.625, screenHeight / 4 + 100, 'share');
    this.anims.create({
        key: 'share',
        frames: this.anims.generateFrameNumbers('share', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    share.anims.play('share', true);
    share.setInteractive(); // Make the button interactive

    // Register score button
    const registerScore = this.add.sprite(screenWidth * 0.875, screenHeight / 4 - 50, 'registerScore');
    this.anims.create({
        key: 'registerScore',
        frames: this.anims.generateFrameNumbers('registerScore', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    registerScore.anims.play('registerScore', true);
    registerScore.setInteractive();

    // Connect Wallet button
    const connect = this.add.sprite(screenWidth * 0.875, screenHeight / 4 + 100, 'connect');
    this.anims.create({
        key: 'connect',
        frames: this.anims.generateFrameNumbers('connect', { start: 0, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
    connect.anims.play('connect', true);
    connect.setInteractive();

    
    // Button interactions
    newGame.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        newGame.setScale(1.1);
    });

    newGame.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        share.setScale(1);
    });

    newGame.on('pointerdown', () => {
        // Start new game
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Game');
            }
        )
    });

    share.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        share.setScale(1.1);
    });

    share.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        share.setScale(1);
    });

    share.on('pointerdown', () => {
        // Handle share button click - should share the game on social media
    });

    registerScore.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        registerScore.setScale(1.1);
    });

    registerScore.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        registerScore.setScale(1);
    });

    registerScore.on('pointerdown', () => {
        // Handle register button click - should register the score on the blockchain calling the smart contract
    });

    connect.on('pointerover', () => {
        // Highlight the button when the mouse is over it
        connect.setScale(1.1);
    });

    connect.on('pointerout', () => {
        // Reset the button's scale when the mouse is out
        connect.setScale(1);
    });

    connect.on('pointerdown', async () => {
        try {
            await connectToMetaMask();
            }
        catch (error) {
            console.log(error);
            window.alert("error", error.message);
            }
    });
    }
}

export default EndMenu;